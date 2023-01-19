module.exports = {
  root: true, //otherwise will also use eslintrc.js from root directory
  extends: ["next/core-web-vitals", "prettier"],
  plugins: ["@aacn_org/tailwind-classname-order"],
  rules: {
    "@aacn_org/tailwind-classname-order/order": 1
  },
  overrides: [
    {
      files: ["./src/**/*.ts", "./src/**/*.tsx"]
    },
  ],
}
