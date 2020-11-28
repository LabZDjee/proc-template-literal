/* jshint esversion: 6 */

function processTemplateLiteral(strIn, contextedEval = eval, details = {}) {
  let charIndex = 0;
  try {
    if (strIn.charAt(0) !== "`") {
      details.failure = true;
      details.reason = "no opening backtick";
      details.charIndex = 0;
      return null;
    }
    const str = strIn.substring(1);
    let result = "";
    let evalContents;
    let isInEvalSection = false;
    let nbCurlies;
    for (charIndex = 0; charIndex < str.length; charIndex++) {
      const ch = str.charAt(charIndex);
      if (isInEvalSection) {
        switch (ch) {
          case "{":
            nbCurlies++;
            break;
          case "}":
            if (nbCurlies == 0) {
              result += contextedEval(evalContents);
              isInEvalSection = false;
            } else {
              nbCurlies--;
            }
            break;
          case "`":
            const r = processTemplateLiteral(str.substring(charIndex), contextedEval, details);
            if (r === null) {
              details.charIndex += charIndex;
              return null;
            }
            evalContents += '"' + r.replaceAll(/(?<!\\)"/g, '\\"') + '"';
            charIndex += details.charIndex;
            continue;
        }
        evalContents += ch;
      } else {
        const nextCh = charIndex < str.length - 1 ? str.charAt(charIndex + 1) : "";
        switch (ch) {
          case "`":
            details.failure = false;
            details.reason = "completed ok";
            details.charIndex = charIndex + 1;
            return result;
          case "\\":
            if (nextCh === "") {
              details.failure = true;
              details.reason = "dangling back space";
              details.charIndex = charIndex + 1;
              return null;
            }
            switch (nextCh) {
              case "$":
              case "{":
              case "`":
                result += nextCh;
                charIndex++;
                continue;
              default:
                break;
            }
            break;
          case "$":
            if (nextCh === "{") {
              isInEvalSection = true;
              evalContents = "";
              charIndex++;
              nbCurlies = 0;
              continue;
            }
            result += ch;
            break;
          default:
            result += ch;
            break;
        }
      }
    }
    details.failure = true;
    details.reason = "no closing bracket";
    details.charIndex = charIndex + 1;
    return null;
  } catch (e) {
    details.failure = true;
    details.reason = e.toString();
    details.charIndex = charIndex + 1;
    return null;
  }
}

export { processTemplateLiteral };
