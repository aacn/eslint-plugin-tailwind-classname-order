import { NodeHandler } from '@/types/NodeHandler';
import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';

/**
 * Node type handler class for tailwind-rn function call expressions.
 */
class TwRnHandler implements NodeHandler {
  /**
   * tailwind-rn support for attribute=tailwind("tw-classes").
   * @param node currently inspected node.
   * @returns {boolean} A boolean depending on whether the node calls the tailwind function with attributes or not.
   */
  validateNodeType(node: any): boolean {
    // does the node has a function call which is named 'tailwind'? && does the function call contains values?
    return (
      node.value.expression?.callee?.name === 'tailwind' &&
      node.value.expression.arguments?.[0]?.type === 'Literal' &&
      typeof node.value.expression.arguments[0].value === 'string'
    );
  }

  /**
   * Extract the tailwind className string from inside the function call.
   * This calls the first argument in the array, as the function call should only have one argument, which are the classes.
   * @param node currently inspected node.
   * @returns {Array<string>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<string> {
    return [node.value.expression.arguments[0].value];
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    const order = orderClasses.order(context, this.classExtractor(node));

    if (!order.isSorted) {
      context.report({
        messageId: 'wrongOrder',
        data: { expected: order.orderedClassNames.join(' ') },
        node,
        fix: (fixer) => {
          const argument = node.value.expression.arguments[0];
          return fixer.replaceTextRange(
            [argument.range[0] + 1, argument.range[1] - 1],
            order.orderedClassNames.join(' ')
          );
        },
      });
    }
  }
}

export const twRnHandler = new TwRnHandler();
