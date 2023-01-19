module.exports = {
  root: true, //otherwise will also use eslintrc.js from root directory
  extends: ["next/core-web-vitals", "prettier"],
  plugins: ["@aacn.eu/tailwind-classname-order"],
  rules: {
    "@aacn.eu/tailwind-classname-order/order": 1
  },
  overrides: [
    {
      files: ["./src/**/*.ts", "./src/**/*.tsx"]
    },
  ],
}
