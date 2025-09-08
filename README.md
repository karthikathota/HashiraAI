# HashiraPlaceemnt

A small Node.js script that reconstructs the constant term `c` (the secret) of a polynomial using Lagrange interpolation from at least `k` points. Points are provided in JSON, with y-values encoded in various bases.

## Project Structure

- `ans.js`: Main script
- `testcase1.json`, `testcase2.json`: Sample inputs
- `package.json`: Project metadata

## Requirements

- Node.js 18+ (for built-in `BigInt` support)

## Setup

```bash
npm install
```

## Run

```bash
node ans.js
```

Expected output format:

```
Testcase1 c = <value>
Testcase2 c = <value>
```

## Input format

Each testcase file is a JSON object with:

- `keys.n`: Total number of shares available (not used by the script, informational)
- `keys.k`: Threshold number of shares required to reconstruct the secret
- One or more numbered properties (`"1"`, `"2"`, ...). Each numbered key is the x-coordinate of a share. Its value is an object with:
  - `base`: String representing the numeric base of the encoded y-value (e.g., `"2"`, `"10"`, `"16"`)
  - `value`: String representing the y-value encoded in the specified base

Example snippet:

```json
{
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2", "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4", "value": "213" }
}
```

## How it works (ans.js)

- Parses the JSON file and reads `k = data.keys.k`.
- Decodes each point `(x, y)` where:
  - `x` is the numeric value of the property name (e.g., `"1"`, `"2"`, `"6"`).
  - `y` is obtained by decoding the string `value` from the given `base` into a `BigInt`.
- Sorts all available points by `x` and selects the first `k` points.
- Uses Lagrange interpolation over the integers (with `BigInt`) to evaluate the unique degree `< k` polynomial at `x = 0` and returns that value as `c`.
- Logs the result for both `testcase1.json` and `testcase2.json`.

## Notes and assumptions

- Arithmetic uses `BigInt` throughout for exactness. No modular arithmetic is performed.
- The script assumes all selected points are valid for interpolation (distinct `x` values; denominators `(xi - xj) ≠ 0`).
- Division steps in interpolation are expected to be exact for the given datasets.
- If more than `k` points are present, only the smallest `k` by `x` are used.
- Only `keys.k` is used for computation; `keys.n` is informational.
