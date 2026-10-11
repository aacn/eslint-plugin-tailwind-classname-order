import { Rule } from "eslint";
import { sanitizeNode } from "@/util/sanitize-node";
import { loadOrderConfig } from '@/util/load-order-config';
import { stripString } from "@/util/strip-string";
import { OrderProps } from "@/types/OrderProps";
import { escapeClassname } from "@/util/escape-classname";

const orderList = loadOrderConfig();

class OrderClasses {
  /**
   * Resolves a class name to its semantic priority in the order config.
   * @param className Class name whose priority should be resolved.
   * @param iteration Current recursive prefix-reduction depth.
   * @returns Priority of the provided class name.
   */
  private getClassPriority(
    className: string,
    iteration: number = 0
  ): number {
    //only run on initial call
    if(iteration === 0) {
      //explicit edge case that needs to run first
      const immediateEdgeCase = this.checkImmediateEdgeCases(className);
      if(immediateEdgeCase !== null) {
        return immediateEdgeCase;
      }

      //remove potential arbitrary content that could break the plugin
      className = this.cleanArbitraryContent(className);

      //remove possible modifiers on the className like negativ values (-z-index-2) or !important (!block)
      className = this.removeModifier(className);
    }

    //check if current className string is listed in config
    let classPrio = this.findTailwindClass(className);
    if(classPrio !== -1) {
      return classPrio;
    }

    //also only run on first iteration, but after first class check
    //this allows edge case classes like display: 'flex' to be ordered properly
    if(iteration === 0) {
      //nothing found immediately -> check for edge cases
      const edgeCase = this.checkEdgeCases(className);
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
    return this.getClassPriority(strippedClassName, iteration + 1);
  }

  /**
   * Resolves ambiguous classes that must be checked before their value is stripped.
   * @param className Original, unmodified class name.
   * @returns Matching semantic priority, or `null` when normal lookup should continue.
   */
  private checkImmediateEdgeCases(className: string) {
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

  /**
   * some classNames could contain arbitrary values that include ":" or "-", which could break the plugin.
   * Therefor they'll be removed as they're not necessary for the plugin anyway
   * @param className
   * @return className that is potentially stripped from arbitrary content
   */
  private cleanArbitraryContent(className: string) {
    if(className.includes("[") && className.includes("]")) {
      const background = className.match(/(?:^|:)bg-\[(.*)]$/);
      if(background) {
        const type = this.isBackgroundImage(background[1]) ? 'image' : 'color';
        return className.replace(/\[.*]/, `[${type}]`);
      }
      return className.replace(/\[.*]/, '[value]');
    }
    return className;
  }

  /**
   * Identifies CSS image values supported by arbitrary background utilities.
   * Unknown arbitrary values default to colors because CSS variables are ambiguous.
   * @param value Contents of a `bg-[...]` utility.
   * @returns Whether the value unambiguously represents a CSS image.
   */
  private isBackgroundImage(value: string): boolean {
    return /^(image:|url\(|(?:repeating-)?(?:linear|radial|conic)-gradient\(|image-set\(|cross-fade\(|element\()/i.test(
      value.trim()
    );
  }

  /**
   * checking for edge case that are a result of duplicated naming of tailwind classes and therefor need to be treated differently
   * @param className name of tailwind class
   * @return priority value for possibly found edge case otherwise return null
   */
  private checkEdgeCases(className: string) {
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
    if(new RegExp(/^bg-.*/).test(className)) {
      // Custom image names need an img slug because unknown bg-* names can also be colors.
      if(className.includes('bg-[image]') || className.includes("img")) {
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
    //11. edge case: logical sizing conflicts with the inline and block display utilities.
    if(new RegExp(/^(min-|max-)?inline-.*/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(inline-size)"));
    }
    if(new RegExp(/^(min-|max-)?block-.*/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(block-size)"));
    }
    //12. edge case: check if it uses the max-[...] modifier.
    if(new RegExp(/^max-\[.*]/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(max-width)"));
    }
    if(new RegExp(/^min-\[.*]/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(min-width)"));
    }
    if(new RegExp(/^@.*/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(@container-query)"));
    }
    //13. edge case: check if it uses the supports-[...] modifier to style things based on whether a certain feature is supported in the user’s browser.
    if(new RegExp(/supports-\.*/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(supports)"));
    }
    //14. edge case: check if it uses the aria-[...] modifier.
    if(new RegExp(/aria-\.*/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(aria)"));
    }
    //15. edge case: check if it uses the data-[...] modifier.
    if(new RegExp(/data-\.*/).test(className)) {
      return orderList.priority.findIndex(elem => elem.includes("(data)"));
    }

    return null;
  }

  /**
   * Removes potential modifiers from className
   * @param className
   * @return className without any modifiers
   */
  private removeModifier(className: string) {
    //remove potential negation className (e.g. -z-index-2 -> z-index: -2)
    if(new RegExp(/^-.*/).test(className)) {
      className = className.substr(1);
    }
    return className.replace("!","");
  }

  /**
   * checks if the provided classname exists inside the orderConfig list
   * @param className classname string to look for
   * @return priority of the given classname or -1 if not found
   */
  private findTailwindClass(className: string) {
    const escapedClassName = escapeClassname(className);

    //add regex to prevent search from grabing classnames that include the provided term, but aren't the class that was searched for
    const regex = new RegExp(`((?!-)( |^))${escapedClassName}(($| )(?!-))`, "gm");
    return orderList.priority.findIndex(elem => regex.test(elem));
  }

  /**
   * Splits a class into variant and utility priorities without treating colons
   * inside arbitrary selectors or values as separators.
   * @param className Class name including any stacked variants.
   * @returns Lexicographically comparable priorities for every segment.
   */
  private getClassSortKey(className: string): Array<number> {
    const segments = [''];
    let bracketDepth = 0;
    let escaped = false;

    for(const character of className) {
      if(escaped) {
        segments[segments.length - 1] += character;
        escaped = false;
      } else if(character === '\\') {
        segments[segments.length - 1] += character;
        escaped = true;
      } else if(character === '[') {
        bracketDepth += 1;
        segments[segments.length - 1] += character;
      } else if(character === ']') {
        bracketDepth -= 1;
        segments[segments.length - 1] += character;
      } else if(character === ':' && bracketDepth === 0) {
        segments.push('');
      } else {
        segments[segments.length - 1] += character;
      }
    }

    return segments.map(segment => this.getClassPriority(segment));
  }

  /** Compares semantic sort keys segment by segment. */
  private compareClassNames(a: string, b: string): number {
    const aKey = this.getClassSortKey(a);
    const bKey = this.getClassSortKey(b);
    const length = Math.max(aKey.length, bKey.length);

    for(let index = 0; index < length; index += 1) {
      if(index === aKey.length) return -1;
      if(index === bKey.length) return 1;
      if(aKey[index] !== bKey[index]) return aKey[index] - bKey[index];
    }
    return 0;
  }

  order(context: Rule.RuleContext, classNames: Array<string>): OrderProps {
    classNames = sanitizeNode(classNames);
    const sortedClassNames = Array.from(classNames).sort((a, b) =>
      this.compareClassNames(a, b)
    );

    return {
      isSorted: sortedClassNames.join(" ") === classNames.join(" "),
      orderedClassNames: sortedClassNames
    }
  }
}

export const orderClasses = new OrderClasses();
