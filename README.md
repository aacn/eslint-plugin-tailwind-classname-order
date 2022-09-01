# eslint-plugin-tailwind-classname-order

Sort tailwind classes for each elements className list by a given order-config

## Features
- [x] order class names by config
- [x] recognize predefined classes
- [x] recognize negative valued class names
- [ ] recognize states like hover,active,peer etc.
- [ ] recognize mediaquerys

## Unsupported tailwind classes
For the latest version the following tailwind classes are unsupported by the order plugin and will be handled as predefined class.
These classes might gonna be added in a later version.
- Grid column  start / end
- Grid row start / end
- Background Size (when using arbitrary values)
- Border Color (when using arbitrary values)
- Box Shadow Color

## Default order config
- predefined class

#### #object reference - High priority because it refers to neighboring content
- peer
- group

#### #object identity, positioning (where)
- position
- (position) top, right, bottom, left
- z-index

#### #object identity, sizing (how)
(- flex) flex width
- width
- width-min
- width-max
- height
- height-min
- height-max

#### #object identity, core identity (what)
- display

#### #flex identity, core flex identity (what flex)
- (flex) direction (row/col)
- (flex) justify-content
- (flex) align-items
- (flex) wrap

#### #grid identity, core grid identity (what grid)
- (grid) row settings
- (grid) row-flow
- (grid) col settings
- (grid) col-flow

#### #flex/grid identity, core flex/grid identity (what flex/grid)
- (flex / grid) gap (x, y)

#### #object identity, environmental behaviour
- padding x
- padding y
- padding (top, right, bottom, left)
- margin-x
- margin-y
- margin (top, right, bottom, left)

#### #object identity modification
- transform (x, y, rotate, scale, skew)

#### #content behaviour
- overflow
- order

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
<br/><br/>
- media query


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


