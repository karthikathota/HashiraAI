const fs = require("fs");

function decodeValue(valueStr, base) {
  return BigInt(parseInt(valueStr, base));
}

function lagrangeInterpolation(points, x) {
  let result = 0n;

  for (let i = 0; i < points.length; i++) {
    let [xi, yi] = points[i];
    xi = BigInt(xi);
    yi = BigInt(yi);

    let term = yi;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let [xj] = points[j];
        xj = BigInt(xj);
        term = (term * (BigInt(x) - xj)) / (xi - xj);
      }
    }

    result += term;
  }

  return result;
}

function solvePolynomial(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const n = data.keys.n;

  const roots = Object.keys(data)
    .filter((k) => k !== "keys")
    .map((k) => decodeValue(data[k].value, parseInt(data[k].base)));

  if (roots.length !== n) {
    throw new Error(`Expected ${n} roots, found ${roots.length}`);
  }

  const points = [];
  for (let x = 0; x <= n; x++) {
    let fx = 1n;
    for (const r of roots) {
      fx *= BigInt(x) - r;
    }
    points.push([x, fx]);
  }

  const c = lagrangeInterpolation(points, 0);

  return c;
}

console.log("Testcase1 c =", solvePolynomial("./testcase1.json").toString());
console.log("Testcase2 c =", solvePolynomial("./testcase2.json").toString());
