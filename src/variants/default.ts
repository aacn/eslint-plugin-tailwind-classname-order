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
    return typeof node.value.value === 'string';
  }

  /**
   * Extract the tailwind className string from the className attribute.
   * @param node currently inspected node.
   * @returns {Array<string>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<string> {
    return [node.value.value];
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    const order = orderClasses.order(context, this.classExtractor(node));

    if (!order.isSorted) {
      context.report({
        messageId: 'wrongOrder',
        data: { expected: order.orderedClassNames.join(' ') },
        node,
        fix: (fixer) => {
          return fixer.replaceTextRange(
            [node.value.range[0] + 1, node.value.range[1] - 1],
            order.orderedClassNames.join(' ')
          );
        },
      });
    }
  }
}

export const defaultHandler = new DefaultHandler();
