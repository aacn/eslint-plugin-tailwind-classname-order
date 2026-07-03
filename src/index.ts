import { ESLint } from 'eslint';
import order from './rules/order';

const name = '@aacn.eu/eslint-plugin-tailwind-classname-order';
const plugin: ESLint.Plugin = {
  meta: { name },
  rules: {
    order,
  },
};

plugin.configs = {
  recommended: [
    {
      plugins: { '@aacn.eu/tailwind-classname-order': plugin },
      rules: { '@aacn.eu/tailwind-classname-order/order': 'warn' },
    },
  ],
};

export = plugin;
