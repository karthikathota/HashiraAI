const fs = require("fs");

/**
 * Decode a root from given base to BigInt
 */
function decodeValue(valueStr, base) {
  return BigInt(parseInt(valueStr, base));
}

/**
 * Lagrange interpolation
 * Given points [ [x0, y0], [x1, y1], ... ]
 * Returns polynomial value at x
 */
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

/**
 * Solve polynomial from JSON roots using interpolation
 */
function solvePolynomial(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const n = data.keys.n;

  // Step 1: decode all roots
  const roots = Object.keys(data)
    .filter((k) => k !== "keys")
    .map((k) => decodeValue(data[k].value, parseInt(data[k].base)));

  if (roots.length !== n) {
    throw new Error(`Expected ${n} roots, found ${roots.length}`);
  }

  // Step 2: construct f(x) = product (x - r_i)
  // We only need f(x) at sample points to interpolate
  const points = [];
  for (let x = 0; x <= n; x++) {
    let fx = 1n;
    for (const r of roots) {
      fx *= BigInt(x) - r;
    }
    points.push([x, fx]);
  }

  // Step 3: use Lagrange interpolation to reconstruct P(x) and find P(0)
  const c = lagrangeInterpolation(points, 0);

  return c;
}

// Example usage
console.log("Testcase1 c =", solvePolynomial("./testcase1.json").toString());
console.log("Testcase2 c =", solvePolynomial("./testcase2.json").toString());
