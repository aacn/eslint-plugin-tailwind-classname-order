import { Rule } from 'eslint';
import { defaultHandler } from '@/variants/default';
import { nestedExpressionHandler } from '@/variants/nested-expression';
import { simpleExpressionHandler } from '@/variants/simple-expression';
import { twRnHandler } from '@/variants/tailwind-rn';
import { templateStringHandler } from '@/variants/template-string';

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      wrongOrder: "Tailwind classes aren't ordered correctly",
    },
    type: 'layout',
    docs: {
      description:
        'Enforce a specififed order on an element\'s applied tailwind classes.',
      recommended: true,
      url: 'https://github.com/aacn/eslint-plugin-tailwind-classname-order/tree/HEAD/README.md',
    },
    fixable: 'code',
    schema: [],
  },
  create: (context) => {
    return {
      JSXAttribute: (node: any) => {
        if (!node.value) {
          return;
        }

        // tailwind-rn support for attribute=tailwind("tw-classes")
        if (twRnHandler.validateNodeType(node)) {
          return twRnHandler.fixOrder(context, node);
        }

        // classname expression className={"tw-classes"}
        if (simpleExpressionHandler.validateNodeType(node)) {
          // default nested expression
          if (node.value.expression.value !== undefined) {
            return simpleExpressionHandler.fixOrder(context, node);
          }

          // nested className expression className={"func('w-10 h-10')"} / className={"func('w-10 h-10', second_argument)"}
          if (nestedExpressionHandler.validateNodeType(node)) {
            return nestedExpressionHandler.fixOrder(context, node);
          }
        }

        // classname expression/template element className={`tw-classes ${variable}`}
        else if (templateStringHandler.validateNodeType(node)) {
          return templateStringHandler.fixOrder(context, node);
        }

        // default tailwind className="tw-classes"
        else if (defaultHandler.validateNodeType(node)) {
          return defaultHandler.fixOrder(context, node);
        } else {
          // abort refactor - node doesn't refer to a className attribute or is in a not supported format
          return;
        }
      },
    };
  },
};
export = rule;
