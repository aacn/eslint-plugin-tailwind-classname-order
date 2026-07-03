# Changelog

## Unreleased

### Added
- Added Tailwind CSS 4.3 utility and variant coverage to the semantic order config.
- Added the `tw-class-order` executable for creating `tw-class-order.json` project overrides.
- Added parent-directory config discovery with `before` and `after` overrides, while retaining full `priority` replacement support.
- Added a recommended ESLint flat config export.
- Added configurable JSX attribute names through the `attributes` rule option.
- Added expected class sequences to ordering diagnostics.

### Changed
- Updated the plugin toolchain and playground to current ESLint, TypeScript, Jest, Next.js, React, and Tailwind CSS versions.
- Raised the minimum supported Node.js version to 20.19.
- Migrated project linting to ESLint flat config and updated the pre-commit verification command.
- Updated rule compatibility for current ESLint `RuleContext` and `RuleTester` APIs.

### Fixed
- Fixed arbitrary background colors such as `bg-[#fff]` being classified as background images.
- Fixed logical inline and block sizing utilities conflicting with display utilities.
- Fixed missing and misspelled Tailwind utility and variant groups in the order config.

## [0.4.4](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.4.4) - 2025-04-22

### Fixed
- Fixed a bug that caused the linting to fail as a regex run into an unescaped sequence, caused by variables beeing inluced inside the className string.

## [0.4.3](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.4.3) - 2023-06-20
### Updated
- Updated the order config to include newly added/missing prefixes, especially focusing on the upcoming support for `aria` tags.
- Added missing options for gradient settings `from`, `middle`, `to`

## [0.4.2](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.4.2) - 2023-05-26
### Fixed
- Fixed a bug, where when trying to order a template string with a `${}` variable at the end of it, causing to add `undefined` to the element.

## [0.4.1](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.4.1) - 2023-03-19
### Fixed
- Fixed a bug that caused the className string inside a template string to be placed at the start of the AST.

## [0.4.0](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.4.0) - 2023-03-13
### Updated
- Refactored and modularized codebase
### Fixed
- Fixed a bug where the library crashed when trying to order an expression that includes a function call with multiple arguments.

## [0.3.1](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.3.0) - 2023-01-19
### Updated
- Adjusted README

## [0.3.0](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.3.0) - 2023-01-19
### Updated
- Removed unecessary files from lib
- Changed package name to **@aacn.eu/eslint-plugin-tailwind-classname-order**
### Added
- Added support for [tailwind-rn](https://www.npmjs.com/package/tailwind-rn)
- Added support for expressions
```js
 // tailwind-rn
<div style={tailwind("px-3 mt-4")}></div>

// expressions
<div className={"px-3 mt-4"}></div>
<div className={`px-3 mt-4 ${myVar}`}></div>
```

## [0.2.7](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.2.7) - 2022-09-08
### Fixed
- Fixed a bug, where the plugin couldn't interpret classNames that had the !important modifier added to it (e.g. !text-green).

## [0.2.6](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.2.6) - 2022-09-08
### Added
- Updated readme to include roadmap and add changelog

### Fixed
- Fixed a bug, where when a className contained a line-break within, the ordered list started with some whitespace.

## [0.2.5](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.2.5) - 2022-09-07
### Added
- First stable running version
