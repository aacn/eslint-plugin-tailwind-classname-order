# Changelog
## [0.3.0](https://github.com/aacn/eslint-plugin-tailwind-classname-order/releases/tag/v0.3.0) - 2023-01-19
### Updated
- Removed unecessary files from lib
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
