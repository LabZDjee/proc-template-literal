/* jshint esversion: 6 */

import { processTemplateLiteral } from "./index.mjs";

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

const meas = 12.34,
  average = 15.34;

console.log(
  processTemplateLiteral('`meas: ${meas}: ${meas<average?`less than average (${average})`:"ok"}`', (s) => eval(s))
);
