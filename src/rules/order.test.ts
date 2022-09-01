import { RuleTester } from "eslint";
import rule from "./order";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    jsx: true,
  },
});

tester.run("order", rule, {
  valid: [
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass sticky flex-[1_2_10%] text-white uppercase bg-green-500" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="font-sans text-xl font-[1100] lowercase opacity-50 bg-rose-700/50" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="bg-img-my-fav-banner bg-repeat bg-center bg-auto bg-green-500" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="border-solid border border-x-3 border-y-5 border-l-10 border-slate-50" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 bottom-4 left-10 -z-index-20" />`,
    },
  ],
  invalid: [
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="text-white min-w-1/2 predefinedClass flex-[1_1_10%] bg-green-500 uppercase underline sticky" />`,
      output: `(props: props) => <button className="predefinedClass sticky flex-[1_1_10%] min-w-1/2 text-white uppercase underline bg-green-500" />`,
      errors: [{ message: "tailwind class names are not in correctly defined order." }],
    },
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="border-slate-50 border-solid border-x-3 border" />`,
      output: `(props: props) => <button className="border-solid border border-x-3 border-slate-50" />`,
      errors: [{ message: "tailwind class names are not in correctly defined order." }],
    },
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="text-green underline decoration-[12px] decoration-green-500" />`,
      output: `(props: props) => <button className="text-green underline decoration-green-500 decoration-[12px]" />`,
      errors: [{ message: "tailwind class names are not in correctly defined order." }],
    },
  ],
});
