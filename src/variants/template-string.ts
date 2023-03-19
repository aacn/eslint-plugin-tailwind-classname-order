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
    // node name is 'className' && a template string exists && there are values inside the template string
    return (
      node.name.name === 'className' &&
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
      if (templateElem.type === "TemplateElement") {
        classNameArguments.push({ originalIndex: index, value: sanitizeNode(templateElem.value.cooked.split(' ')) });
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
        node,
        fix: (fixer) => {
          let expression = context.getSourceCode().getText(node.parent);

          // place each ordered quasi back to into their original position
          classNameQuasis.forEach((sortedQuasi: NestedArgumentProps) => {
            // Check if original quasi has whitespace at the start or end of the string, as this indicates the
            // added whitespace for a following expression.
            if (hasLeadingWhitespace(node.value.expression.quasis[sortedQuasi.originalIndex].value.cooked)) {
              sortedQuasi.value[0] = ' ' + sortedQuasi.value[0];
            }

            if (hasTrailingWhitespace(node.value.expression.quasis[sortedQuasi.originalIndex].value.cooked)) {
              sortedQuasi.value[sortedQuasi.value.length - 1] = sortedQuasi.value[sortedQuasi.value.length - 1] + ' ';
            }

            expression = expression.replace(node.value.expression.quasis[sortedQuasi.originalIndex].value.cooked, sortedQuasi.value.join(' '));
          });

          return fixer.replaceText(node.parent, expression);
        },
      });
    }
  }
}

export const templateStringHandler = new TemplateStringHandler();
