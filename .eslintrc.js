const rulesDirPlugin = require("eslint-plugin-rulesdir");
rulesDirPlugin.RULES_DIR = "lib/rules";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
  ],
  env: {
    node: true,
  },
  plugins: ["rulesdir"],
  rules: {
    "rulesdir/order": 2,
  },
  overrides: [
    {
      files: ["tests/**/*.js"],
      env: { mocha: true },
    },
  ],
};
