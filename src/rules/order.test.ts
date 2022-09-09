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
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer peer:flex peer:text-green absolute top-2 bottom-4 left-10 -z-index-20" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer peer:flex peer:text-green hover:text-green hover:uppercase disabled:color-grey" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer peer:flex peer:text-green hover:text-green hover:disabled:text-green hover:disabled:active:text-green" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="hover:text-green hover:disabled:text-green hover:disabled:uppercase hover:disabled:bg-green hover:disabled:active:text-green" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="hover:disabled:block hover:disabled:text-green hover:disabled:uppercase hover:disabled:bg-green hover:disabled:active:text-green" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="flex text-green hover:text-green hover:disabled:text-green sm:text-base sm:hover:text-yellow lg:text-lg lg:hover:text-red" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="sticky flex-[1:1-10%]" />`,
    },
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="min-h-10px !block px-2 py-2" />`,
    },
  ],
  invalid: [
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="text-white min-w-1/2 predefinedClass flex-[1:1-10%] bg-green-500 uppercase underline sticky" />`,
      output: `(props: props) => <button className="predefinedClass sticky flex-[1:1-10%] min-w-1/2 text-white uppercase underline bg-green-500" />`,
      errors: [{ message: "Tailwind classes aren't correctly ordered" }],
    },
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="border-slate-50 border-solid border-x-3 border" />`,
      output: `(props: props) => <button className="border-solid border border-x-3 border-slate-50" />`,
      errors: [{ message: "Tailwind classes aren't correctly ordered" }],
    },
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="text-green underline decoration-[12px] decoration-green-500" />`,
      output: `(props: props) => <button className="text-green underline decoration-green-500 decoration-[12px]" />`,
      errors: [{ message: "Tailwind classes aren't correctly ordered" }],
    },
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="flex-[1_2_3] flex-col flex items-center justify-start bg-img-name" />`,
      output: `(props: props) => <button className="flex-[1_2_3] flex flex-col justify-start items-center bg-img-name" />`,
      errors: [{ message: "Tailwind classes aren't correctly ordered" }],
    },
  ],
});
