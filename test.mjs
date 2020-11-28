/* jshint esversion: 6 */

import chalk from "chalk";
import roundTo from "round-to";
const { green, greenBright, red, redBright, yellow } = chalk;

import { processTemplateLiteral } from "./index.mjs";

const a = 3.14;

const abc = "ABCDEF";
const bce = {
  n: 2,
};

const oneHundred = 100;
const sumBetween1an100 = (oneHundred * (oneHundred + 1)) / 2;

const meas = 12.34,
  average = 15.34;

const stringsToTest = [
  "`sum of all numbers between 1 and ${oneHundred} = ${oneHundred*(oneHundred+1)/2}`",
  '`hello $${abc}} world ${roundTo(bce.n/3, 3)} ${true ?`yes, hello + "${abc+abc}"`:"false"}!` -ignored-',
  "missing back ticks",
  "`missing ending back tick",
  "`escaped $\\{1+1}`",
  '`"escaped" \\${1+1} $ {1+2} ${"four".length}`',
  "`1 + 1 is ${1+1}`, NoContextedEval",
  "`invalid expression ${xyz}`",
  '`${a>3?"is":"is not"} more than three`',
  "`${a>3?'is':'is not'} more than three`",
  "`${a>3?\"is\":'is not'} more than three`",
  "`${a>3?\"is\":'is not'} more than \\`three\\``",
  "`${[1, 2, 3, 4].reduce((r, v)=>v*r, 1)}`",
  '`meas: ${meas}: ${meas<average?`less than average (${average})`:"ok"}`',
];
const expectedResults = [
  "sum of all numbers between 1 and 100 = " + sumBetween1an100,
  'hello $ABCDEF} world 0.667 yes, hello + "ABCDEFABCDEF"!',
  null,
  null,
  "escaped ${1+1}",
  '"escaped" ${1+1} $ {1+2} 4',
  "1 + 1 is 2",
  null,
  "is more than three",
  "is more than three",
  "is more than three",
  "is more than `three`",
  "24",
  "meas: 12.34: less than average (15.34)",
];

let testNumber = 1;
let nbOfErrors = 0;

function contextedEval(str) {
  return eval(str);
}

stringsToTest.forEach((strToTest, index) => {
  console.log(yellow(`Test ${testNumber}:\n processTemplateLiteral on \\"${strToTest}\\"`));
  const result = strToTest.includes("NoContextedEval")
    ? processTemplateLiteral(strToTest)
    : processTemplateLiteral(strToTest, contextedEval);
  const expectedResult = expectedResults[index];
  if (result === expectedResult) {
    console.log(green(` correct, returned: "${expectedResult}"`));
  } else {
    console.log(red(` wrong, expected: "${expectedResult}"`));
    console.log(red(`        got: "${result}"`));
    nbOfErrors++;
  }
  testNumber++;
});

if (nbOfErrors > 0) {
  console.log(redBright(`FAILED with ${nbOfErrors} error${nbOfErrors === 1 ? "" : "s"}`));
} else {
  console.log(greenBright(`PASSED all ${testNumber} tests!`));
}
