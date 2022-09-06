import { Rule } from "eslint";
import orderList from './orderConfig.json';

const rule: Rule.RuleModule = {
  create: context => {
    return {
      JSXAttribute: (node: any) => {
        if (!node.value || node.name.name !== "className" || !(typeof(node.value) === "string")) {
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


/**
 * querys the priority number from the config
 * @param className string that the priority should be queried for
 * @param iteration predefined number to keep track of the current recursion loop
 * @return priority number of provided className string
 */
function getClassPriority(className: string, iteration: number = 0): number {
  //only run on initial call
  if(iteration === 0) {
    //explicit edge case that needs to run first
    const immediateEdgeCase = checkImmediateEdgeCases(className);
    if(immediateEdgeCase !== null) {
      return immediateEdgeCase;
    }

    //check if className contains any kind of prefix and handle accordingly
    if(className.includes(":")) {
      return getPrefixClassPriority(className);
    }

    //remove potential negation className (e.g. -z-index-2 -> z-index: -2)
    if(new RegExp(/^-.*/).test(className)) {
      className = className.substr(1);
    }
  }

  //check if current className string is listed in config
  let classPrio = findTailwindClass(className);
  if(classPrio !== -1) {
    return classPrio;
  }

  //also only run on first iteration, but after first class check
  //this allows edge case classes like display: 'flex' to be ordered properly
  if(iteration === 0) {
    //nothing found immediately -> check for edge cases
    const edgeCase = checkEdgeCases(className);
    if(edgeCase !== null) {
      return edgeCase;
    }
  }

  //remove last occuring "-" from string and run recursion with stripped string (e.g. w-1/2 -> w)
  let strippedClassName = stripString(className, "-");
  //return as custom class, if string couldn't be split further
  if(strippedClassName === null) {
    return orderList.priority.indexOf("(predefined)");
  }
  return getClassPriority(strippedClassName, iteration+1);
}

/**
 * queries the priority values for string that include prefixes (e.g. hover:)
 * this also takes stacked prefixes into incorporation
 * @param className string that the priority should be queried for
 * @return priority number of provided className string
 */
function getPrefixClassPriority(className: string): number {
  const splitClassName = className.split(":");
  let amountPrio: number = splitClassName.length - 1;
  //example: base prio (prefix) hover = 2 + prio text-green = 26 -> 2,00026 total prio
  //first 2 decimals are reserved for 0-99 prefix prio value and the last 3 0-999 for actual class prios
  //when stacking, the base prio is applied first (the first prefix in the string)
  //example: hover:disabled:text-green
  //base prio (hover) = 2,XX XXX
  //second its determined how many prefixes exist in the given string, so by default a strings priority gets less with each added prefix
  //amount prio (hover, disabled) = 2/100 -> 2,02 XXX
  //third the actual class prio is added
  //class prio (text-green) = 26/100.000 -> 2,02 026
  return getClassPriority(splitClassName[0]) + amountPrio/100 + getClassPriority(splitClassName[splitClassName.length -1])/100000;
}

/**
 * checks if the provided classname exists inside the orderConfig list
 * @param classname classname string to look for
 * @return priority of the given classname or -1 if not found
 */
function findTailwindClass(classname: string) {
  //add regex to prevent search from grabing classnames that include the provided term, but aren't the class that was searched for
  const regex = new RegExp(`((?!-)( |^))${classname}(($| )(?!-))`, "gm");
  return orderList.priority.findIndex(elem => regex.test(elem));
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
  //6. edge case: check if text includes arbitrary values thus it's font-size otherwise it's text-color
  if(new RegExp(/text-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(font-size)"));
  }
  //7. edge case: check if outline includes arbitrary value thus it's outline-width otherwise it's outline-color
  if(new RegExp(/outline-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(outline-width)"));
  }
  //8. edge case: check if ring includes arbitrary value thus makes it's ring-width otherwise it's ring-color
  if(new RegExp(/ring-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(ring-width)"));
  }
  //9. edge case: check if ring-offset includes arbitrary value thus makes it's ring-offset-width otherwise it's ring-offset-color
  if(new RegExp(/ring-offset-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(ring-offset-width)"));
  }
  //10. edge case: check if stroke includes arbitrary value thus makes it's stroke-width otherwise it's stroke-color
  if(new RegExp(/stroke-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(stroke-width)"));
  }
  //10. edge case: check if shadow includes arbitrary value thus makes it's box-shadow otherwise it's box-shadow-color
  if(new RegExp(/shadow-\[.*]/).test(className)) {
    return orderList.priority.findIndex(elem => elem.includes("(box-shadow)"));
  }

  return null;
}

function checkImmediateEdgeCases(className: string) {
  if(className === "border") {
    return orderList.priority.findIndex(elem => elem.includes("(border-width)"));
  }
  if(className === "outline") {
    return orderList.priority.findIndex(elem => elem.includes("(outline-style)"));
  }
  if(className === "ring") {
    return orderList.priority.findIndex(elem => elem.includes("(ring-width)"));
  }
  if(className === "shadow") {
    return orderList.priority.findIndex(elem => elem.includes("(box-shadow)"));
  }

  return null;
}

export = rule;
