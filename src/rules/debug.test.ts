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
      code: "<button className={`${ this.open ? 'transform rotate-180' : ''} h-5 w-5 text-white` } />",
      output: "<button className={`${ this.open ? 'transform rotate-180' : ''} w-5 h-5 text-white` } />",
      errors: [{ messageId: "wrongOrder" }],
    },
  ],
});
