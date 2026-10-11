import { NodeHandler } from '@/types/NodeHandler';
import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';
import { NestedArgumentProps } from "@/types/NestedArgumentProps";
import {
  hasLeadingWhitespace,
  hasTrailingWhitespace,
  sanitizeNode
} from "@/util/sanitize-node";

/**
 * Node type handler class for template strings.
 */
class TemplateStringHandler implements NodeHandler {
  /**
   * Check if the node is a template string.
   * @param node currently inspected node.
   * @returns {boolean} A boolean depending on whether the node is a template string or not.
   */
  validateNodeType(node: any): boolean {
    return (
      node.value.expression !== null &&
      node.value.expression?.quasis
    );
  }

  /**
   * Extract the tailwind className string from the template string.
   * @param node currently inspected node.
   * @returns {Array<NestedArgumentProps>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<NestedArgumentProps> {
    let classNameArguments: NestedArgumentProps[] = [];

    node.value.expression.quasis.forEach((templateElem: any, index: number) => {
      // check if template is a template element and the value of it is not empty, the empty check prevents things like this:
      // {`bg-white ${open ? 'absolute' : null} `} -> classNameArgs = [{oi: 0, value : 'bg-white'}, {oi: 1, value : ''}]
      if (templateElem.type === "TemplateElement" && templateElem.value.cooked.replace(/\s/g,'') !== '') {
        classNameArguments.push({ originalIndex: index, value: sanitizeNode([templateElem.value.raw]) });
      }
    });

    return classNameArguments;
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    // extract all quasis elements with their index & value as array.
    let classNameQuasis: Array<NestedArgumentProps> = this.classExtractor(node);
    let unsortedQuasisExists = false;

    // sort each quasi individually and check if they're ordered correctly.
    classNameQuasis.forEach((quasis: NestedArgumentProps, index: number) => {
      const orderedQuasi = orderClasses.order(context, quasis.value);
      if (!orderedQuasi.isSorted) unsortedQuasisExists = true;

      classNameQuasis[index].value = orderedQuasi.orderedClassNames;
    });

    if (unsortedQuasisExists) {
      context.report({
        messageId: 'wrongOrder',
        data: {
          expected: classNameQuasis.map(item => item.value.join(' ')).join(' | '),
        },
        node,
        fix: (fixer) => {
          return classNameQuasis.map((sortedQuasi: NestedArgumentProps) => {
            const quasi =
              node.value.expression.quasis[sortedQuasi.originalIndex];
            const raw = quasi.value.raw;
            const source = context.sourceCode.getText(quasi);
            const start = quasi.range[0] + source.indexOf(raw);
            const value = [
              hasLeadingWhitespace(raw) ? ' ' : '',
              sortedQuasi.value.join(' '),
              hasTrailingWhitespace(raw) ? ' ' : '',
            ].join('');
            return fixer.replaceTextRange([start, start + raw.length], value);
          });
        },
      });
    }
  }
}

export const templateStringHandler = new TemplateStringHandler();
