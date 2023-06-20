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
      code: `<button className="top-6 max-rr:top-10 max-xl:top-8" />`,
      output: `<button className="top-6 max-xl:top-8 max-rr:top-10" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
  ],
});
