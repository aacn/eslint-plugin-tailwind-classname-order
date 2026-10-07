import { Rule } from 'eslint';
import { orderClasses } from '@/util/order-classes';

/** Returns the configured name for identifier and member-expression callees. */
function getFunctionName(node: any): string | null {
  if(node?.type === 'Identifier') return node.name;
  if(node?.type !== 'MemberExpression' || node.computed) return null;
  const object = getFunctionName(node.object);
  return object && node.property.type === 'Identifier'
    ? `${object}.${node.property.name}`
    : null;
}

/** Sorts every statically known class string inside a configured function value. */
function sortClassValue(context: Rule.RuleContext, node: any): void {
  if(!node) return;

  if(node.type === 'Literal' && typeof node.value === 'string') {
    const source = context.sourceCode.getText(node);
    reportString(context, node, source.slice(1, -1), [node.range[0] + 1, node.range[1] - 1]);
    return;
  }

  if(node.type === 'TemplateLiteral') {
    node.quasis.forEach((quasi: any) => {
      if(!quasi.value.raw.trim()) return;
      const source = context.sourceCode.getText(quasi);
      const start = quasi.range[0] + source.indexOf(quasi.value.raw);
      reportString(context, quasi, quasi.value.raw, [start, start + quasi.value.raw.length]);
    });
    return;
  }

  if(node.type === 'ArrayExpression') {
    node.elements.forEach((element: any) => sortClassValue(context, element));
  } else if(node.type === 'ConditionalExpression') {
    sortClassValue(context, node.consequent);
    sortClassValue(context, node.alternate);
  } else if(node.type === 'LogicalExpression') {
    sortClassValue(context, node.left);
    sortClassValue(context, node.right);
  } else if(node.type === 'ObjectExpression') {
    node.properties.forEach((property: any) => {
      if(property.type === 'Property' && !property.computed) {
        sortClassValue(context, property.key);
      }
    });
  } else if(node.type === 'SpreadElement') {
    sortClassValue(context, node.argument);
  }
}

/** Reports and fixes one static class string when its order is incorrect. */
function reportString(
  context: Rule.RuleContext,
  node: any,
  value: string,
  range: [number, number]
): void {
  const leading = /^\s/.test(value) ? ' ' : '';
  const trailing = /\s$/.test(value) ? ' ' : '';
  const order = orderClasses.order(context, value.split(/\s+/));
  if(order.isSorted) return;
  const expected = order.orderedClassNames.join(' ');

  context.report({
    messageId: 'wrongOrder',
    data: { expected },
    node,
    fix: fixer => fixer.replaceTextRange(range, `${leading}${expected}${trailing}`),
  });
}

export { getFunctionName, sortClassValue };
