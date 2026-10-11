import { NodeHandler } from '@/types/NodeHandler';
import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';
import { NestedArgumentProps } from "@/types/NestedArgumentProps";

/**
 * Node type handler class for nested expressions.
 */
class NestedExpressionHandler implements NodeHandler {
  /**
   * Check if the simple expression node is actually a nested expression.
   * @param node currently inspected node.
   * @returns {boolean} A boolean depending on whether the node is a nested expression or not.
   */
  validateNodeType(node: any): boolean {
    // value of node has a sub call to a function && the function possesses arguments
    return (
      node.value.expression?.callee !== undefined &&
      node.value.expression.arguments?.length > 0
    );
  }

  /**
   * Only fetch arguments that hold strings (these are declared as type 'Literal' in the AST).
   * This function also saves the original index position of the arguments, so they can be placed at
   * the exact position in the fixer function later, since argument order is important in function calls.
   * @param node currently inspected node.
   * @returns {Array<NestedArgumentProps>} An Array with the original index of the argument and its value as array of strings.
   */
  classExtractor(node: any): Array<NestedArgumentProps> {
    let classNameArguments: NestedArgumentProps[] = [];

    node.value.expression.arguments.forEach((argument: any, index: number) => {
      if (argument.type === 'Literal' && typeof argument.value === 'string') {
        classNameArguments.push({ originalIndex: index, value: [argument.value] });
      }
    });

    return classNameArguments;
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    let classNameArguments: Array<NestedArgumentProps> = this.classExtractor(node);
    let unsortedArgumentExists = false;

    // order each argument block separately and keep track if one of the blocks was sorted wrong.
    classNameArguments.forEach((argument: NestedArgumentProps, index: number) => {
      const orderedArgument = orderClasses.order(context, argument.value);
      if (!orderedArgument.isSorted) unsortedArgumentExists = true;

      classNameArguments[index].value = orderedArgument.orderedClassNames;
    });

    if (unsortedArgumentExists) {
      context.report({
        messageId: 'wrongOrder',
        data: {
          expected: classNameArguments
            .map(item => item.value.join(' '))
            .join(' | '),
        },
        node,
        fix: (fixer) => {
          return classNameArguments.map((sortedArgument: NestedArgumentProps) => {
            const argument =
              node.value.expression.arguments[sortedArgument.originalIndex];
            return fixer.replaceTextRange(
              [argument.range[0] + 1, argument.range[1] - 1],
              sortedArgument.value.join(' ')
            );
          });
        },
      });
    }
  }
}

export const nestedExpressionHandler = new NestedExpressionHandler();
