import { NodeHandler } from '@/types/NodeHandler';
import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';

/**
 * Node type handler class for default node className attribute types.
 */
class DefaultHandler implements NodeHandler {
  /**
   * Check if the node is a normal className attribute string.
   * @param node currently inspected node.
   * @returns {boolean} A boolean depending on whether the node is a normal className attribute string or not.
   */
  validateNodeType(node: any): boolean {
    // make sure the attribute of the current node refers to 'className' && the value of the attribute is a string
    return (
      node.name.name === 'className' && typeof node.value.value === 'string'
    );
  }

  /**
   * Extract the tailwind className string from the className attribute.
   * @param node currently inspected node.
   * @returns {Array<string>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<string> {
    return Array.from(node.value.value.split(' '));
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    const order = orderClasses.order(context, this.classExtractor(node));

    if (!order.isSorted) {
      context.report({
        messageId: 'wrongOrder',
        node,
        fix: (fixer) => {
          return fixer.replaceText(
            node.value,
            `"${order.orderedClassNames.join(' ')}"`
          );
        },
      });
    }
  }
}

export const defaultHandler = new DefaultHandler();
