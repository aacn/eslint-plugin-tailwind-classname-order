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
      node.value.expression?.arguments
    );
  }

  /**
   * Extract the tailwind className string from inside the function call.
   * This calls the first argument in the array, as the function call should only have one argument, which are the classes.
   * @param node currently inspected node.
   * @returns {Array<string>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<string> {
    return Array.from(node.value.expression?.arguments[0].value.split(' '));
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    const order = orderClasses.order(context, this.classExtractor(node));

    if (!order.isSorted) {
      context.report({
        messageId: 'wrongOrder',
        node,
        fix: (fixer) => {
          const expression = context.getSourceCode().getText(node.parent);
          const updatedExpression = expression.replace(
            node.value.expression.arguments[0].value,
            `${order.orderedClassNames.join(' ')}`
          );
          return fixer.replaceText(node.parent, updatedExpression);
        },
      });
    }
  }
}

export const twRnHandler = new TwRnHandler();
