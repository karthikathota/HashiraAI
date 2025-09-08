const fs = require("fs");

function decodeValue(valueStr, base) {
  if (base === 10) {
    return BigInt(valueStr);
  }

  let result = 0n;
  const baseBig = BigInt(base);

  for (let i = 0; i < valueStr.length; i++) {
    const digit = valueStr[i];
    let digitValue;

    if (digit >= "0" && digit <= "9") {
      digitValue = BigInt(digit.charCodeAt(0) - "0".charCodeAt(0));
    } else if (digit >= "A" && digit <= "Z") {
      digitValue = BigInt(digit.charCodeAt(0) - "A".charCodeAt(0) + 10);
    } else if (digit >= "a" && digit <= "z") {
      digitValue = BigInt(digit.charCodeAt(0) - "a".charCodeAt(0) + 10);
    } else {
      digitValue = 0n;
    }

    if (digitValue >= baseBig) {
      digitValue = 0n;
    }

    result = result * baseBig + digitValue;
  }

  return result;
}

function lagrangeInterpolation(points, x) {
  let result = 0n;
  const xBig = BigInt(x);

  for (let i = 0; i < points.length; i++) {
    let [xi, yi] = points[i];
    xi = BigInt(xi);
    yi = BigInt(yi);

    let term = yi;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let [xj] = points[j];
        xj = BigInt(xj);

        const denominator = xi - xj;
        if (denominator !== 0n) {
          term = (term * (xBig - xj)) / denominator;
        }
      }
    }

    result += term;
  }

  return result;
}

function solvePolynomial(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const k = data.keys.k;

  const points = [];
  for (const key of Object.keys(data)) {
    if (key !== "keys" && !isNaN(key)) {
      const x = BigInt(key);
      const base = parseInt(data[key].base) || 10;
      const y = decodeValue(data[key].value || "", base);
      points.push([x, y]);
    }
  }
  points.sort((a, b) => {
    const diff = a[0] - b[0];
    if (diff < 0n) return -1;
    if (diff > 0n) return 1;
    return 0;
  });

  const selectedPoints = points.slice(0, k);
  const c = lagrangeInterpolation(selectedPoints, 0);

  return c;
}

console.log("Testcase1 c =", solvePolynomial("./testcase1.json").toString());
console.log("Testcase2 c =", solvePolynomial("./testcase2.json").toString());
