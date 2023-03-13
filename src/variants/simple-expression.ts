import { NodeHandler } from '@/types/NodeHandler';
import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';

/**
 * Node type handler class for simple expressions.
 */
class SimpleExpressionHandler implements NodeHandler {
  /**
   * Check if node is a simple expression call, without template strings.
   * @param node currently inspected node.
   * @returns {boolean} A boolean depending on whether the node is a simple expression or not.
   */
  validateNodeType(node: any): boolean {
    // The nodes name matches 'className' && the node is not empty && the node doesn't include any template strings
    return (
      node.name.name === 'className' &&
      node.value.expression !== undefined &&
      node.value.expression?.quasis === undefined
    );
  }

  /**
   * Extract the tailwind className string from inside the function call.
   * @param node currently inspected node.
   * @returns {Array<string>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<string> {
    return Array.from(node.value.expression.value.split(' '));
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
            node.value.expression.value,
            `${order.orderedClassNames.join(' ')}`
          );
          return fixer.replaceText(node.parent, updatedExpression);
        },
      });
    }
  }
}

export const simpleExpressionHandler = new SimpleExpressionHandler();
