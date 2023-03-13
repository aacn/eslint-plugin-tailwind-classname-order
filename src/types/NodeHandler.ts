import { Rule } from 'eslint';

interface NodeHandler {
  validateNodeType(node: any): boolean;

  classExtractor(node: any): Array<string>;

  fixOrder(context: Rule.RuleContext, node: any): void;
}

export { NodeHandler };
