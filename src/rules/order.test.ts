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
  valid: [
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass sticky flex-[1_2_10%] text-white uppercase bg-green-500" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="font-sans text-xl font-[1100] lowercase opacity-50 bg-rose-700/50" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="bg-img-my-fav-banner bg-repeat bg-center bg-auto bg-green-500" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="border-solid border border-x-3 border-y-5 border-l-10 border-slate-50" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 bottom-4 left-10 -z-index-20" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer peer:flex peer:text-green absolute top-2 bottom-4 left-10 -z-index-20" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer peer:flex peer:text-green hover:text-green hover:uppercase disabled:color-grey" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer peer:flex peer:text-green hover:text-green hover:disabled:text-green hover:disabled:active:text-green" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="hover:text-green hover:disabled:text-green hover:disabled:uppercase hover:disabled:bg-green hover:disabled:active:text-green" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="hover:disabled:block hover:disabled:text-green hover:disabled:uppercase hover:disabled:bg-green hover:disabled:active:text-green" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="flex text-green hover:text-green hover:disabled:text-green sm:text-base sm:hover:text-yellow lg:text-lg lg:hover:text-red" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="sticky flex-[1:1-10%]" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="min-h-10px !block px-2 py-2" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props, tailwind) => <button className="min-h-10px !block px-2 py-2" style={tailwind('items-center pt-12 mr-2')} />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={`${ 'ml-5 text-lg' } w-5 h-5 text-white` } />",
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={` ${ 'ml-5 text-lg' }w-5 h-5 text-white` } />",
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={` ${ func('ml-5 text-lg') }w-5 h-5 text-white` } />",
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 bottom-4 left-10 -z-index-20 md:top-4 max-md:top-6 max-rr:top-8" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 max-rr:top-8 aria-rr:top-10" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 max-rr:top-8 landscape:top-12 aria-rr:top-10" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 max-rr:top-8 supports-rr:top-12 aria-rr:top-10" />`,
    },
    {
      filename: 'valid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="predefinedClass peer absolute top-2 rtl:top-20 print:top-10 data-rr:top-12" />`,
    },
  ],
  invalid: [
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="text-white min-w-1/2 predefinedClass flex-[1:1-10%] bg-green-500 uppercase underline sticky" />`,
      output: `(props: props) => <button className="predefinedClass sticky flex-[1:1-10%] min-w-1/2 text-white uppercase underline bg-green-500" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="border-slate-50 border-solid border-x-3 border" />`,
      output: `(props: props) => <button className="border-solid border border-x-3 border-slate-50" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="text-green underline decoration-[12px] decoration-green-500" />`,
      output: `(props: props) => <button className="text-green underline decoration-green-500 decoration-[12px]" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="flex-[1_2_3] flex-col flex items-center justify-start bg-img-name" />`,
      output: `(props: props) => <button className="flex-[1_2_3] flex flex-col justify-start items-center bg-img-name" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props, tailwind) => <button aria-label="yoo" style={tailwind("flex-[1_2_3] flex-col flex items-center justify-start bg-img-name")} />`,
      output: `(props: props, tailwind) => <button aria-label="yoo" style={tailwind("flex-[1_2_3] flex flex-col justify-start items-center bg-img-name")} />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props, tailwind) => <button onclick={tailwind("flex-[1_2_3] flex-col flex items-center justify-start bg-img-name")} aria-label="yoo" />`,
      output: `(props: props, tailwind) => <button onclick={tailwind("flex-[1_2_3] flex flex-col justify-start items-center bg-img-name")} aria-label="yoo" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className={"flex-[1_2_3] flex-col flex items-center justify-start bg-img-name"} />`,
      output: `(props: props) => <button className={"flex-[1_2_3] flex flex-col justify-start items-center bg-img-name"} />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props, classNames, vars: TestVarProps) => <button className={classNames('w-full z-50 h-[14px] flex flex-col justify-center items-center select-none', vars.className)} />`,
      output: `(props: props, classNames, vars: TestVarProps) => <button className={classNames('z-50 w-full h-[14px] flex flex-col justify-center items-center select-none', vars.className)} />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props, classNames, vars: TestVarProps) => <button className={classNames(vars.className, 'w-full z-50 h-[14px] flex flex-col justify-center items-center select-none')} />`,
      output: `(props: props, classNames, vars: TestVarProps) => <button className={classNames(vars.className, 'z-50 w-full h-[14px] flex flex-col justify-center items-center select-none')} />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props, func) => <button className={func(vars.className, 'h-full w-full', 'w-full z-50 h-[14px] flex flex-col justify-center items-center select-none')} />`,
      output: `(props: props, func) => <button className={func(vars.className, 'w-full h-full', 'z-50 w-full h-[14px] flex flex-col justify-center items-center select-none')} />`,
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={`text-md ml-5 ${ 'ml-5 text-lg' } h-5 w-5 text-white` } />",
      output: "<button className={`ml-5 text-md ${ 'ml-5 text-lg' } w-5 h-5 text-white` } />",
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={`text-md ml-5 ${ 'ml-5 text-lg' } h-5 w-5 text-white ${ 'mt-1 mr-4' } mr-2 mt-2` } />",
      output: "<button className={`ml-5 text-md ${ 'ml-5 text-lg' } w-5 h-5 text-white ${ 'mt-1 mr-4' } mt-2 mr-2` } />",
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={`${ open ? 'transform rotate-180' : ''} h-5 w-5 text-white` } />",
      output: "<button className={`${ open ? 'transform rotate-180' : ''} w-5 h-5 text-white` } />",
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: "<button className={`rounded-full bg-white ${open ? 'absolute -top-3.5 -right-3.5' : null} `} />",
      output: "<button className={`bg-white rounded-full ${open ? 'absolute -top-3.5 -right-3.5' : null} `} />",
      errors: [{ messageId: "wrongOrder" }],
    },
    {
      filename: 'invalid.tsx', // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button className="via-green-200/25 to-yellow-300/10 h-6 flex flex-row px-1.5 -space-x-2 bg-slate-100/80 bg-gradient-to-r from-blue-300/10 backdrop-blur" />`,
      output: `(props: props) => <button className="h-6 flex flex-row px-1.5 -space-x-2 bg-slate-100/80 bg-gradient-to-r from-blue-300/10 via-green-200/25 to-yellow-300/10 backdrop-blur" />`,
      errors: [{ messageId: "wrongOrder" }],
    },
  ],
});
