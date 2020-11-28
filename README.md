# proc-template-literal

The idea is to process a string as a *[template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)* (also called *template strings*, a string surrounded with backticks  where expressions surrounded between, called *placeholders*, `${`  and  `}` are processed as an ECMAScript expression)  in cases this feature is not supported, e.g. with Internet Explorer

A template literal looks like this: `string text ${expression} string text`

Static template literals can of course be [*transpiled*](https://en.wikipedia.org/wiki/Source-to-source_compiler). So the reason for this package is to address cases where *dynamic* template strings should be evaluated by an ECMAScript runtime which does not support those template literals. As for example when those strings come from a file.  So is the primary object of this package: translation of strings embedding expressions which should be dynamically evaluated

## API

### `processTemplateLiteral(strIn, contextedEval = eval)`

Processes string `strIn` as a *template literal* and returns `null` in case of any error met, otherwise the processed string is returned

`contextedEval` is a function which *evaluates* an expression in a particular context thanks to a *closure*, where expressions will find their definitions. It defaults to simply `eval` which will obviously evaluate in the called function what is not required most of the time. Implementation of `contextEval` is usually very simple:

```javascript
function ctxEvaluate(expression) {
  return evaluate(expression);
}
```

### Notes

- A *template literal* should be surrounded by *backticks*, no character should exist before the opening backtick and and any character beyond the closing character will be ignored
- This function never throws any exception
- Nested template literals are supported (see example below)
- Backticks as well as dollar signs and left curly braces can be escaped with a leading backslash
- A third optional parameter `details` is an object reference which can be used as a debug facility (and is internally used in the implementation). It contains three properties:
  1. `failure`: `true` if and only if operation failed
  2. `reason`: a string which provides details about a potential failure (if an exception occurs, it will be caught and its text will be copied here)
  3. `charIndex`: zero-based index pointing a position of the analysis when it failed, or the index of the closing backtick

# How-to

## Installation

- `npm install @labzdjee/proc-template-literal`

## Use Example

This example stresses the importance of the `contextedEval` function:

```javascript
import { processTemplateLiteral } from "@labzdjee/proc-template-literal";

const stats = [
  { weight: 12, score: 4 },
  { weight: 8, score: 6 },
  { weight: 21, score: 9 },
  { weight: 16, score: 5 },
];

stats.forEach((element) => {
  function ev(str) {
    return eval(str);
  }

console.log(processTemplateLiteral("`w: ${element.weight}, s²: ${element.score*element.score}`", ev));
});
function dist(acc, element) {
  return acc + element.weight * element.score * element.score;
}

console.log(processTemplateLiteral("`result: ${Math.sqrt(stats.reduce(dist, 0)/stats.length)}`", (s) => eval(s)));

const meas = 12.34, average = 15.34;

console.log(
  processTemplateLiteral('`meas: ${meas}: ${meas<average?`less than average (${average})`:"ok"}`', (s) => eval(s))
);

```

Last call illustrates use of a nested template literal

## Unitary Tests

From the [github](https://github.com/LabZDjee/proc-template-string) repo:

- `npm test`

As of writing, parameter `details` of `processTemplateLiteral` is not covered by those tests

