# eslint-plugin-tailwind-classname-order

Sort tailwind classes for each element className list by a given order-config.

- [1. Features](#features)
- [2. Currently unsupported tailwind classes](#currently-unsupported-tailwind-classes)
- [3. Default order config](#default-order-config)
- [4. Installation](#installation)
- [5. Usage](#usage)

## Features
- [x] Order class names by config
- [x] Recognize predefined classes
- [x] Recognize negative valued class names
- [x] Recognize states like hover,active,peer etc.
- [x] Recognize stacked states properly.
- [x] Recognize mediaquerys
- [ ] Remove 'img' slug restriction for bg-images, by reading tailwind-config file
- [ ] Handle className objects that are not string typed

## Currently supported tailwind classes
For the latest version the following tailwind classes are supported by the order plugin.
Classes that are not yet included, will be treated as predefined custom classes.

https://progress-bar.dev/<thepercentage>?title=<title>
- Background Size (when using arbitrary values)
- Border Color (when using arbitrary values)
- Box Shadow Color

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
- padding x
- padding y
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

#### #content behaviour
- object fit
- object position
- overflow
- overscroll
- order
- break-before
- break-after
- break-inside
- box-decoration-break

#### #styling - content / text related
- whitespace

#### #text styling
- font-family
- font-size
- font-weight
- font-style
- tracking
- leading
- text-color
- text-position
- indent
- word-break

#### #body behaviour
- opacity

#### #body styling
- background (url, repeat, pos, size)
- background-color
- (svg) fill
- (svg) stroke
- border (style, width, radius)
- border-color
- box-shadow
- transition (property, duration, timing function, delay)

#### #state management
States are priority wise in the same order as they are presented on the tailwind docs, excluding the ```@media``` type prefixes https://tailwindcss.com/docs/hover-focus-and-other-states#appendix

#### #media querys
This plugin supports the default breakpoint prefixes as listed on the tailwind docs. https://tailwindcss.com/docs/responsive-design <br/>
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

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-tailwind-classname-order`:

```sh
npm install eslint-plugin-tailwind-classname-order --save-dev
```

## Usage

Add `tailwind-classname-order` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "tailwind-classname-order"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "tailwind-classname-order/rule-name": 2
    }
}
```


