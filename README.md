# HashiraPlaceemnt

A small Node.js script that reconstructs a polynomial using Lagrange interpolation and prints the constant term `c` for sample inputs in `testcase1.json` and `testcase2.json`.

## Project Structure

- `ans.js`: Main script
- `testcase1.json`, `testcase2.json`: Sample inputs
- `package.json`: Project metadata

## Setup

```bash
npm install
```

## Run

```bash
node ans.js
```

This will print output like:

```
Testcase1 c = <value>
Testcase2 c = <value>
```

## How it works (ans.js)

- **Input format**: Each `testcase*.json` contains a `keys.n` field and multiple entries with `{ base, value }`. Each entry represents a root of a monic polynomial, encoded as a string in the specified base.

- **`decodeValue(valueStr, base)`**: Converts each encoded root from its base into a JavaScript `BigInt`.

- **`lagrangeInterpolation(points, x)`**: Evaluates, in `BigInt` arithmetic, the value at `x` of the unique polynomial that passes through the provided `points` using Lagrange basis polynomials. For each point `(xi, yi)`, it accumulates `yi * Π_{j≠i} (x - xj) / (xi - xj)` using exact `BigInt` division (works because the constructed points ensure divisibility).

- **`solvePolynomial(filePath)`**:

  - Reads JSON and extracts `n = data.keys.n`.
  - Decodes all roots with `decodeValue`. Validates that the number of decoded roots equals `n`.
  - Builds sample points for the polynomial `f(x) = Π_i (x - r_i)` at integer `x = 0..n`. Each `f(x)` is computed purely with `BigInt`.
  - Uses `lagrangeInterpolation(points, 0)` to evaluate the reconstructed polynomial at `x = 0`. For a monic polynomial with the given roots, this value is the constant term `c = f(0) = Π_i (0 - r_i)`.
  - Returns that constant term `c` as a `BigInt`.

- **Output**: The script logs the constant term for both `testcase1.json` and `testcase2.json`.

- **Notes and assumptions**:
  - Arithmetic uses `BigInt` throughout to avoid overflow and preserve exactness.
  - The sample `points` include `n+1` distinct `x` values, which is sufficient to interpolate a degree-`n` polynomial.
  - The inputs are assumed to be valid and to represent distinct roots (so denominators `(xi - xj)` are non-zero).
