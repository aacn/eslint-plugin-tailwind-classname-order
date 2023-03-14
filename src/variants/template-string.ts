import { NodeHandler } from '@/types/NodeHandler';
import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';

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
   * @returns {Array<string>} An array containing the classNames separated as strings.
   */
  classExtractor(node: any): Array<string> {
    let classNameValues: Array<string> = [];
    node.value.expression.quasis.forEach((templateElem: any) => {
      const arr: string[] = Array.from(templateElem.value.cooked.split(' '));
      classNameValues.push.apply(classNameValues, arr);
    });

    return classNameValues;
  }

  fixOrder(context: Rule.RuleContext, node: any): void {
    const order = orderClasses.order(context, this.classExtractor(node));

    if (!order.isSorted) {
      context.report({
        messageId: 'wrongOrder',
        node,
        fix: (fixer) => {
          let expression = context.getSourceCode().getText(node.parent);
          for (let i = 1; node.value.expression.quasis.length > i; i++) {
            if (i === node.value.expression.quasis.length - 1) {
              expression = expression.replace(
                node.value.expression.quasis[i].value.cooked,
                ''
              );
            } else {
              expression = expression.replace(
                node.value.expression.quasis[i].value.cooked,
                ' '
              );
            }
          }

          expression = expression.replace(
            node.value.expression.quasis[0].value.cooked,
            `${order.orderedClassNames.join(' ') + ' '}`
          );
          return fixer.replaceText(node.parent, expression);
        },
      });
    }
  }
}

export const templateStringHandler = new TemplateStringHandler();
