![GitHub package.json version](https://img.shields.io/github/package-json/v/MarlonAACN/eslint-plugin-tailwind-classname-order?style=flat-square)
![GitHub](https://img.shields.io/github/license/MarlonAACN/eslint-plugin-tailwind-classname-order?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/MarlonAACN/eslint-plugin-tailwind-classname-order?style=flat-square)
# eslint-plugin-tailwind-classname-order

This eslint plugin automatically orders the tailwind classes included in the className tags from
each element by the provided default order list.

- [1. Features](#features)
- [2. Roadmap](#roadmap)
- [3. Currently supported tailwind classes](#currently-supported-tailwind-classes)
- [4. Explicitly unsupported classes](#explicitly-unsupported-classes)
- [5. Default order config](#default-order-config)
- [6. Installation](#installation)
- [7. Usage](#usage)

## Features
- [x] Order tailwind classes by given config
- [x] Recognize predefined classes
- [x] Recognize negative valued class names
- [x] Recognize states like hover,active,peer etc.
- [x] Recognize stacked states properly.
- [x] Recognize mediaquerys
- [x] Support for [tailwind-rn](https://www.npmjs.com/package/tailwind-rn)
- [x] Supporting not only strings, but also expressions

## Development

Requires Node.js 20.19 or newer and Yarn 1.x.

```sh
yarn install
yarn verify

cd playground
yarn install
cd ..
yarn verify:all
```

## Roadmap
1. Resolve custom background images from project theme data when Tailwind offers
a stable synchronous API.
2. ~~Include className objects that are not string typed instead of just ignoring them.~~
3. Make custom ordering for the user more accessible and easier.

## Currently supported tailwind classes
For the latest version the following tailwind classes are supported by the order plugin.
Classes that are not yet included, will be treated as predefined custom classes.
Classes are categorized as seen in the tailwind documentation [here](https://tailwindcss.com/docs)
<br/>

![](https://progress-bar.dev/100/?title=Layout)
![](https://progress-bar.dev/100/?title=Flexbox_Grid)
![](https://progress-bar.dev/100/?title=Spacing)<br/>
![](https://progress-bar.dev/100/?title=Sizing)
![](https://progress-bar.dev/99/?title=Typography)
![](https://progress-bar.dev/98/?title=Backgrounds)<br/>
![](https://progress-bar.dev/98/?title=Borders)
![](https://progress-bar.dev/99/?title=Effects)
![](https://progress-bar.dev/100/?title=Filters)<br/>
![](https://progress-bar.dev/100/?title=Tables)
![](https://progress-bar.dev/100/?title=Transitions_Animations)
![](https://progress-bar.dev/100/?title=Transformers)<br/>
![](https://progress-bar.dev/100/?title=Interactivity)
![](https://progress-bar.dev/98/?title=SVG)
![](https://progress-bar.dev/100/?title=Accessibility)<br/>

Custom background images defined in a Tailwind theme must include `img` in
their class name so the plugin can distinguish them from custom colors:

```txt
bg-home-img
bg-img-hero
```

Without theme evaluation, an ambiguous name such as `bg-hero` could represent
either `background-image` or `background-color` and is therefore treated as a
color. Built-in gradients and arbitrary image values such as
`bg-[url('/hero.jpg')]` are detected automatically.

## Explicitly unsupported classes
Some classes in tailwind have counterparts with the same name and since interpreting arbitrary values
is not supported on the current version, they won't be detected properly.
There are two major differences:
1. The plugin doesn't support arbitrary values in any way for the certain class. Even when they're
predefined in the tw config file, they won't be interpreted properly.
2. The plugin can't interpret arbitrary values when they're added inline, but the plugin will be able
to detect the proper class, when the value is predefined in the config.
<br/>This Problem will presumably be fixed with a future version.

- Font Family (inline)
- Text Color (inline)
- Text Decoration Color (inline)
- Background Size (arbitrary generally)
- Background Position (arbitrary generally)
- Stroke Color (inline)
- Border Color (inline)
- Outline Color (inline)
- Ring Color (inline)
- Ring Offset Color (inline)
- Box Shadow Color (inline)

## Default order config
- predefined class

#### #browser behavior
- box-sizing

#### #object reference - High priority because it refers to neighboring content
- peer
- group

#### #object identity, positioning (where)
- position
- (position) top, right, bottom, left
- visibility
- z-index

#### #object identity, sizing (how)
- (flex) flex width
- (flex) basis
- container
- width
- width-min
- width-max
- height
- height-min
- height-max
- aspect-ratio

#### #object identity, core identity (what)
- display

#### #flex identity, core flex identity (what flex)
- (flex) direction (row/col)
- (flex) wrap

#### #grid identity, core grid identity (what grid)
- (grid) grid-cols (grid-template-columns)
- (grid) grid-column
- (grid) grid-rows (grid-template-rows)
- (grid) grid-row
- (grid) grid-flow
- (grid) auto-cols
- (grid) auto-rows
- (grid) justify items
- (grid) justify self
- (grid) align content

#### #flex/grid identity, core flex/grid identity (what flex/grid)
- (flex / grid) justify-content
- (flex / grid) align-items
- (flex / grid) align self
- (flex / grid) gap (x, y)

#### #object identity, environmental behaviour
- place items
- place content
- place self
- padding-x
- padding-y
- padding (top, right, bottom, left)
- margin-x
- margin-y
- margin (top, right, bottom, left)
- space between (x, y)
- float
- clear
- isolation

#### #object identity modification
- transform (x, y, rotate, scale, skew)
- transform origin

#### #content behaviour
- object fit
- object position
- overflow
- overscroll
- order
- break-before
- break-after
- break-inside
- box decoration break

#### #styling - content / text related
- whitespace

#### #text styling
- font-family
- font-size
- font smoothing
- font-weight
- font-style
- font-variant-numeric
- tracking (letter spacing)
- leading (line-height)
- list style type
- list style position
- text alignment
- text-color
- text-transform
- text-overflow
- text-decoration
- text-decoration-color
- text-decoration-style
- text-decoration-thickness
- text-underline-offset
- text-indent
- word break
- vertical align
- pseudo-class content

#### #body behaviour
- opacity

#### #body styling
- background (url, repeat, pos, size)
- background-attachment
- background-clip
- background-color
- background-origin
- gradient color from-{color}
- gradient color middle-{color}
- gradient color to-{color}
- mix-blend-mode
- background blend mode
- (svg) fill
- (svg) stroke color
- (svg) stroke width
- border (style, width, radius)
- border-color
- divide (x, y)
- divide color
- divide-style
- outline-width
- outline-style
- outline-offset
- ring width
- ring color
- ring offset width
- ring offset color
- box-shadow
- box-shadow-color

#### #table styling
- border-collapse
- border-spacing
- table-layout

#### #filters
- blur
- brightness
- contrast
- drop-shadow
- grayscale
- hue-rotate
- invert
- saturate
- sepia
- backdrop blur
- backdrop brightness
- backdrop contrast
- backdrop grayscale
- backdrop hue rotate
- backdrop invert
- backdrop opacity
- backdrop saturate
- backdrop sepia

#### #transitions & animation
- transition (property, duration, timing function, delay)
- animate

#### #interactivity
- accent-color
- appearance
- cursor
- caret-color
- pointer events
- resize
- scroll behavior
- scroll padding (x, y)
- scroll margin (x, y)
- scroll snap align
- scroll snap stop
- scroll snap type
- touch action
- user select
- will-change

#### #accesiblility
- screen readers

#### #state management
States are priority wise in the same order as they are presented on the [tailwind docs (states)](https://tailwindcss.com/docs/hover-focus-and-other-states#appendix), excluding the ```@media``` type prefixes.

#### #media queries
This plugin supports the default breakpoint prefixes as listed on the [tailwind docs for responsive design](https://tailwindcss.com/docs/responsive-design). <br/>
Furthermore more custom prefixes are also already added. The ```orderConfig.json``` file can of course be altered to include even more custom breakpoint prefixes.
- xs
- sm
- md
- 2md
- lg
- 2lg
- xl
- 2xl
- 3xl

## Installation

You'll first need to install [ESLint](https://eslint.org/):

#### With npm
```sh
# via npm
npm install eslint --save-dev

# via yarn
yarn add -D eslint
```

Next, install `eslint-plugin-tailwind-classname-order`:

```sh
# via npm
npm install @aacn.eu/eslint-plugin-tailwind-classname-order --save-dev

# via yarn
yarn add -D @aacn.eu/eslint-plugin-tailwind-classname-order
```


## Usage

Add the plugin and rule to `eslint.config.mjs`:

```js
import tailwindClassnameOrder from '@aacn.eu/eslint-plugin-tailwind-classname-order';

export default [
  {
    plugins: {
      '@aacn.eu/tailwind-classname-order': tailwindClassnameOrder,
    },
    rules: {
      '@aacn.eu/tailwind-classname-order/order': 'warn',
    },
  },
];
```
