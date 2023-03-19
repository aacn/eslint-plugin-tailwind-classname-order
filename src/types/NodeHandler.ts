import { Rule } from 'eslint';
import { NestedArgumentProps } from "@/types/NestedArgumentProps";

interface NodeHandler {
  validateNodeType(node: any): boolean;

  classExtractor(node: any): Array<string | NestedArgumentProps>;

  fixOrder(context: Rule.RuleContext, node: any): void;
}

export { NodeHandler };
