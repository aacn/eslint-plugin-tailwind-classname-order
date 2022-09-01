import { Rule } from "eslint";
import orderList from './orderConfig.json';

const rule: Rule.RuleModule = {
  create: context => {
    return {
      JSXAttribute: (node: any) => {
        if (!node.value || node.name.name !== "className") {
          return;
        }

        const classNames: string[] = Array.from(node.value.value.split(" "));
        const sortedClassNames = Array.from(classNames).sort((a: string, b: string) => {
          const aPrio = getClassPriority(a);
          const bPrio = getClassPriority(b);
          if(aPrio < bPrio) {
            return -1;
          }
          if(aPrio > bPrio) {
            return 1;
          }
          return 0;
        });

        if(sortedClassNames.join(" ") !== classNames.join(" ")) {
          context.report({
            message: "tailwind class names are not in correctly defined order.",
            node,
            fix: fixer => {
              return fixer.replaceText(node.value, `"${sortedClassNames.join(" ")}"`);
            }
          });
        }
      },
    };
  },
  meta: {
    fixable: "code",
  },
};


function getClassPriority(className: string) {
  //explicit edge case that needs to run first
  if(className === "border") {
    return orderList.priority.findIndex(elem => elem.includes("(border-width)"));
  }

  //remove potential negation className (e.g. -z-index-2 -> z-index: -2)
  if(new RegExp(/^-.*/).test(className)) {
    className = className.substr(1);
  }

  //first iteration (instant find -> static class)
  let classPrio = findTailwindClass(className);
  if(classPrio !== -1) {
    return classPrio;
  }

  //nothing found immediately -> check for edge cases
  const edgeCase = checkEdgeCases(className);
  if(edgeCase !== null) {
    return edgeCase;
  }

  //second iteration with potentially now stripped values (e.g. w-1/2 -> w)
  let strippedClassName = stripString(className, "-");
  //return as custom class, if no splitpoints exist
  if(strippedClassName === null) {
    return orderList.priority.indexOf("(predefined)");
  }
  classPrio = findTailwindClass(strippedClassName);
  if(classPrio !== -1) {
    return classPrio;
  }

  //third iteration to catch potentially now stripped values (e.g. (before first split) text-green-500 -> text-green -> text
  let doubleStrippedClassName = stripString(strippedClassName, "-");
  if(doubleStrippedClassName === null) {
    return orderList.priority.indexOf("(predefined)");
  }
  classPrio = findTailwindClass(doubleStrippedClassName);
  if(classPrio !== -1) {
    return classPrio;
  }

  //nothing matching found after third iteration, assume it's a predefined class
  return orderList.priority.indexOf("(predefined)");
}

/**
 * checks if the provided classname exists inside the orderConfig list
 * @param classname classname string to look for
 * @return priority of the given classname or -1 if not found
 */
function findTailwindClass(classname: string) {
  //add empty space to prevent search from grabing classnames that include the provided term, but aren't the class that was searched for
  return orderList.priority.findIndex(elem => elem.includes(classname + " "));
}

/**
 * Strips last occurence of given string from provided elem
 * @param elem string that's meant to be stripped
 * @param at string at which the elem should be split
 * @return stripped string or null if string couldn't be split
 */
function stripString(elem: string, at: string) {
  if(!elem.includes(at)) {
    return null;
  }
  return elem.substr(0, elem.lastIndexOf(at));
}

/**
 * checking for edge case that are a result of duplicated naming of tailwind classes and therefor need to be treated differently
 * @param className name of tailwind class
 * @return priority value for possibly found edge case otherwise return null
 */
function checkEdgeCases(className: string) {
  //1. edge case: flex width includs arbitrary values (conflicts with display: flex)
  if(new RegExp(/flex-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(flex-width)"));
  }
  //2. edge case: (text)-decoration includs arbitrary values (conflicts with text-decoration-color)
  if(new RegExp(/decoration-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(text-decoration-thickness)"));
  }
  //3. edge case: font-weight includs arbitrary values (conflicts with font-family)
  if(new RegExp(/font-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(font-weight)"));
  }
  //4. edge case: check if bg- is an image or color setting (conflicts with bg-color)
  //all defined images need an 'img' slug in their naming to be identifiable!
  if(new RegExp(/^bg-.*/).test(className)) {
    if(new RegExp(/bg-\[.*]/).test(className) || className.includes("img")) {
      return orderList.priority.findIndex(elem => elem.includes("(bg-image)"));
    } else {
      return orderList.priority.findIndex(elem => elem.includes("(bg-color)"));
    }
  }
  //5. edge case: check if provided classname is meant for border-with including arbitrary values
  if(new RegExp(/border-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(border-width)"));
  }

  return null;
}

export = rule;
