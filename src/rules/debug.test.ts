import { RuleTester } from 'eslint';
import rule from './order';

const tester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    jsx: true,
  },
});

type TestVarProps = {
  className: string
}

// @ts-ignore
tester.run('order', rule, {
  valid: [],
  invalid: [
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={`rounded-full bg-white ${open ? 'absolute -top-3.5 -right-3.5' : null} `} />",
      output: "<button className={`bg-white rounded-full ${open ? 'absolute -top-3.5 -right-3.5' : null} `} />",
      errors: [{ messageId: "wrongOrder" }],
    },
  ],
});
