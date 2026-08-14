// ES2026 Features Demo
// 📘 For TypeScript comparison, see: 39.6-es2026-features-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sumPrecise
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2026 features:
// 1. Math.sumPrecise()
// 2. Array.fromAsync()
// 3. Error.isError()
// 4. Uint8Array Base64 methods (fromBase64, toBase64, fromHex, toHex)
// 5. Map.prototype.upsert()
// 6. JSON.parse source text access
// 7. Iterator Sequencing (concat)

// ============================================
// Table of Contents
// ============================================
// 1. Math.sumPrecise()
// 2. Array.fromAsync()
// 3. Error.isError()
// 4. Uint8Array Base64/Hex Methods
// 5. Map.prototype.upsert()
// 6. JSON.parse Source Text Access
// 7. Iterator Sequencing
// 8. Common Pitfalls
// 9. Best Practices
// 10. Cross-references

console.log("\n=== ES2026 Features ===\n");

// ============================================
// 1. Math.sumPrecise()
// ============================================
console.log("\n--- 1. Math.sumPrecise() ---\n");

// Precise summation of numbers, avoids floating point errors
const numbers = [0.1, 0.2, 0.3, 0.4, 0.5];

// Regular sum has floating point error
const regularSum = numbers.reduce((a, b) => a + b, 0);
console.log("0.1 + 0.2 =", 0.1 + 0.2); // 0.30000000000000004

if (typeof Math.sumPrecise === "function") {
  // Math.sumPrecise gives exact result
  const preciseSum = Math.sumPrecise(numbers);
  console.log("Math.sumPrecise sum:", preciseSum); // 1.5 (exact)

  // Handles large arrays without precision loss
  const largeArray = Array(1000).fill(0.1);
  const largeRegularSum = largeArray.reduce((a, b) => a + b, 0);
  const largePreciseSum = Math.sumPrecise(largeArray);
  console.log("\n1000 * 0.1 regular sum:", largeRegularSum); // ~99.9999999999986
  console.log("1000 * 0.1 precise sum:", largePreciseSum); // 100 (exact)

  // Throws if any element is not a number
  try {
    Math.sumPrecise([1, 2, "3"]); // ❌ TypeError: can't sum non-numbers
  } catch (e) {
    console.log("\nSumming non-numbers throws:", e.message);
  }

  // Use case: Financial calculations, scientific computing where precision matters
  const prices = [1.99, 2.99, 3.99, 4.99];
  const total = Math.sumPrecise(prices);
  console.log("\nTotal price (precise): $" + total.toFixed(2)); // $13.96 (correct)
} else {
  console.log("⚠️ Math.sumPrecise is not available in this Node.js version");
  console.log("It will be added when your runtime supports ES2026+");
}

/*
 * verification:
 *   feature: Math.sumPrecise
 *   status: ES2026
 *   stage4Date: 2025-07
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposal-math-sum
 */

// ============================================
// 2. Array.fromAsync()
// ============================================
console.log("\n--- 2. Array.fromAsync() ---\n");

/*
 * verification:
 *   feature: Array.fromAsync
 *   status: ES2026
 *   stage4Date: 2025-05
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposal-array-from-async
 */

// Convert async iterables to arrays
async function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
  await new Promise(resolve => setTimeout(resolve, 10));
  yield 4;
}

// Usage:
// const numbersArray = await Array.fromAsync(generateNumbers());
// console.log("From async generator:", numbersArray); // [1, 2, 3, 4]

// Also works with sync iterables, promises, and array-like objects
const promiseArray = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
// const resolved = await Array.fromAsync(promiseArray);
// console.log("Resolved promises:", resolved); // [1, 2, 3]

// With map function
// const doubled = await Array.fromAsync(generateNumbers(), n => n * 2);
// console.log("Doubled async values:", doubled); // [2, 4, 6, 8]

// Before ES2026: Had to use for-await-of loop
async function fromAsyncManual(iterable) {
  const result = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}

console.log("Array.fromAsync converts async iterables, promises, and array-like objects to arrays");
console.log("Useful for processing streams, async generators, and collections of promises");

// ============================================
// 3. Error.isError()
// ============================================
console.log("\n--- 3. Error.isError() ---\n");

// Reliably check if a value is an Error object
console.log("Error.isError(new Error()):", Error.isError(new Error())); // true
console.log("Error.isError(new TypeError()):", Error.isError(new TypeError())); // true
console.log("Error.isError({ name: 'Error', message: 'fake' }):", Error.isError({ name: 'Error', message: 'fake' })); // false
console.log("Error.isError(null):", Error.isError(null)); // false
console.log("Error.isError(undefined):", Error.isError(undefined)); // false
console.log("Error.isError('string'):", Error.isError('string')); // false
console.log("Error.isError(42):", Error.isError(42)); // false

// Works with cross-realm errors (from iframes, workers, other realms)
// const iframe = document.createElement('iframe');
// document.body.appendChild(iframe);
// const iframeError = new iframe.contentWindow.Error('cross realm');
// console.log("Cross-realm error:", Error.isError(iframeError)); // true (whereas instanceof Error would be false)

// Before ES2026: Unreliable checks
function isErrorOld(value) {
  return value instanceof Error; // Fails for cross-realm errors
  // Or: Object.prototype.toString.call(value) === '[object Error]' // Better but still can be spoofed
}

// Use case: Error handling in libraries that receive values from different realms
function handleError(err) {
  if (Error.isError(err)) {
    console.error("Actual error:", err.message, err.stack);
  } else {
    console.error("Non-error thrown:", err);
  }
}

// ============================================
// 4. Uint8Array Base64/Hex Methods
// ============================================
console.log("\n--- 4. Uint8Array Base64/Hex Methods ---\n");

/*
 * verification:
 *   feature: Uint8Array Base64
 *   status: ES2026
 *   stage4Date: 2025-07
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposal-arraybuffer-base64
 */

const data = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]); // "Hello World"
console.log("Original Uint8Array:", data);

if (typeof data.toBase64 === "function") {
  // Encode to base64 string
  const base64 = data.toBase64();
  console.log("toBase64():", base64); // "SGVsbG8gV29ybGQ="

  // Decode base64 string back to Uint8Array
  const decoded = Uint8Array.fromBase64(base64);
  console.log("fromBase64():", decoded); // Uint8Array containing "Hello World"
  console.log("Decoded to string:", new TextDecoder().decode(decoded)); // "Hello World"

  // Base64 URL variant (safe for URLs/filenames, no padding)
  const base64url = data.toBase64({ urlSafe: true, omitPadding: true });
  console.log("toBase64 URL-safe:", base64url); // "SGVsbG8gV29ybGQ"

  // Decode URL-safe base64
  const decodedUrl = Uint8Array.fromBase64(base64url, { urlSafe: true });
  console.log("fromBase64 URL-safe:", new TextDecoder().decode(decodedUrl)); // "Hello World"
} else {
  console.log("⚠️ Uint8Array.prototype.toBase64 / fromBase64 / toHex / fromHex are not available in this Node.js version");
}

if (typeof data.toHex === "function") {
  const hex = data.toHex();
  console.log("toHex():", hex); // "48656c6c6f20576f726c64"

  const decodedHex = Uint8Array.fromHex(hex);
  console.log("fromHex():", decodedHex);
  console.log("Decoded hex to string:", new TextDecoder().decode(decodedHex)); // "Hello World"
} else {
  console.log("⚠️ Hex encoding methods also not available in this Node.js version");
}

// ============================================
// 5. Map.prototype.upsert()
// ============================================
console.log("\n--- 5. Map.prototype.upsert() ---\n");

/*
 * verification:
 *   feature: Upsert
 *   status: ES2026
 *   stage4Date: 2026-01
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposal-upsert
 */

if (typeof new Map().upsert === "function") {
  // Update or insert a value in a Map atomically
  const map = new Map([
    ["a", 1],
    ["b", 2]
  ]);
  console.log("Original map:", Object.fromEntries(map));

  // If key exists: update with update function, else insert with insert value
  const aValue = map.upsert("a", 10, (oldValue) => oldValue * 2);
  console.log("\nupsert('a') - existing key:");
  console.log("Return value:", aValue); // 2 (old value 1 * 2)
  console.log("Map now:", Object.fromEntries(map)); // { a: 2, b: 2 }

  // If key doesn't exist: insert value
  const cValue = map.upsert("c", 3, (oldValue) => oldValue * 2);
  console.log("\nupsert('c') - new key:");
  console.log("Return value:", cValue); // 3 (insert value)
  console.log("Map now:", Object.fromEntries(map)); // { a: 2, b: 2, c: 3 }

  // Use case: Counters
  const counts = new Map();
  const words = ["hello", "world", "hello", "test", "world", "hello"];
  words.forEach(word => {
    counts.upsert(word, 1, count => count + 1);
  });
  console.log("\nWord counts:", Object.fromEntries(counts));
  // { hello: 3, world: 2, test: 1 }
} else {
  console.log("⚠️ Map.prototype.upsert is not available in this Node.js version");
  console.log("It will be added when your runtime supports ES2026+");
}

// Before ES2026: Had to check existence manually
function upsertOld(map, key, insert, update) {
  if (map.has(key)) {
    const value = update(map.get(key), key);
    map.set(key, value);
    return value;
  } else {
    map.set(key, insert);
    return insert;
  }
}

// ============================================
// 6. JSON.parse Source Text Access
// ============================================
console.log("\n--- 6. JSON.parse Source Text Access ---\n");

/*
 * verification:
 *   feature: JSON.parse source text access
 *   status: ES2026
 *   stage4Date: 2025-11
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposal-json-parse-source
 */

// Access the original source text of parsed JSON values
const json = `{"number": 123.456, "big": 9007199254740993, "string": "hello"}`;
// Note: The big number exceeds MAX_SAFE_INTEGER (JSON.parse will lose precision without source text access)

// Pass source text accessor function
const parsed = JSON.parse(json, (key, value, { source }) => {
  if (key === "big") {
    // Use source text to create BigInt instead of Number (which would lose precision)
    return BigInt(source);
  }
  if (key === "number") {
    console.log(`Source text for 'number': '${source}'`); // "123.456"
  }
  return value;
});

console.log("\nParsed value:");
console.log("parsed.number:", parsed.number); // 123.456 (number)
console.log("parsed.big:", parsed.big); // 9007199254740993n (BigInt, no precision loss)
console.log("parsed.string:", parsed.string); // "hello"

// Before ES2026: Couldn't get original source text, numbers over MAX_SAFE_INTEGER lost precision
const parsedOld = JSON.parse(json);
console.log("\nOld parse (no source access):");
console.log("parsedOld.big:", parsedOld.big); // 9007199254740992 (lost precision!)

// Use case: Parsing JSON with large numbers without losing precision, validating input format
const reviver = (key, value, { source }) => {
  if (typeof value === "number" && !Number.isInteger(value)) {
    // Parse decimals as strings to preserve exact decimal representation
    return source;
  }
  return value;
};

const financialJSON = '{"price": 19.99, "quantity": 100}';
const financialData = JSON.parse(financialJSON, reviver);
console.log("\nFinancial data with preserved decimals:");
console.log("price:", financialData.price, "(type:", typeof financialData.price, ")"); // "19.99" string
console.log("quantity:", financialData.quantity, "(type:", typeof financialData.quantity, ")"); // 100 number

// ============================================
// 7. Iterator Sequencing (concat)
// ============================================
console.log("\n--- 7. Iterator Sequencing ---\n");

/*
 * verification:
 *   feature: Iterator Sequencing
 *   status: ES2026
 *   stage4Date: 2025-11
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposal-iterator-sequencing
 */

if (typeof Iterator.prototype.concat === "function") {
  // Iterator.prototype.concat() combines multiple iterators
  const iter1 = [1, 2, 3].values();
  const iter2 = [4, 5, 6].values();
  const iter3 = [7, 8, 9].values();

  const combined = iter1.concat(iter2, iter3);
  console.log("Combined iterator:", [...combined]); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

  // Works with any iterable, not just arrays
  function* genA() { yield "a"; yield "b"; }
  function* genB() { yield "c"; yield "d"; }
  const letters = genA().concat(genB(), ["e", "f"]);
  console.log("Combined generators and array:", [...letters]); // ["a", "b", "c", "d", "e", "f"]

  // Chaining with other iterator helpers
  const result = [1, 2, 3].values()
    .concat([4, 5, 6].values())
    .filter(n => n % 2 === 0)
    .map(n => n * 2)
    .toArray();
  console.log("\nChained concat with helpers:", result); // [4, 8, 12]
} else {
  console.log("⚠️ Iterator.prototype.concat is not available in this Node.js version");
}

// ============================================
// 8. Common Pitfalls
// ============================================
console.log("\n--- 8. Common Pitfalls ---\n");

// Pitfall 1: Math.sumPrecise throws on non-numbers
if (typeof Math.sumPrecise === "function") {
  try {
    Math.sumPrecise([1, 2, null]); // ❌ TypeError
  } catch (e) {
    console.log("Pitfall1: sumPrecise with non-number throws:", e.message);
  }
} else {
  console.log("Pitfall1: Math.sumPrecise not available in this runtime");
}

// Pitfall 2: Array.fromAsync always returns a promise, even for sync iterables
// const syncArr = Array.fromAsync([1,2,3]); // Promise<number[]>, not number[]

// Pitfall 3: fromBase64 throws on invalid base64
if (typeof Uint8Array.fromBase64 === "function") {
  try {
    Uint8Array.fromBase64("invalid!base64"); // ❌ SyntaxError
  } catch (e) {
    console.log("Pitfall3: Invalid base64 throws:", e.message);
  }
} else {
  console.log("Pitfall3: fromBase64 not available in this runtime");
}

// Pitfall 4: Map.upsert update function is called only if key exists
if (typeof new Map().upsert === "function") {
  let called = false;
  const m = new Map();
  m.upsert("new-key", 0, () => { called = true; return 1; });
  console.log("\nPitfall4: upsert for new key - update called:", called); // false (update not called)
} else {
  console.log("\nPitfall4: Map.prototype.upsert not available in this runtime");
}

// Pitfall 5: JSON.parse source text is the exact substring from the JSON input
// It includes quotes for strings, whitespace, etc.
JSON.parse('"  test  "', (k, v, { source }) => {
  console.log("\nString source text:", JSON.stringify(source)); // "\"  test  \"" (includes quotes)
  return v;
});

// ============================================
// 9. Best Practices
// ============================================
console.log("\n--- 9. Best Practices ---\n");

console.log("✅ Use Math.sumPrecise() for financial/scientific calculations requiring exact summation");
console.log("✅ Use Array.fromAsync() to convert async iterables to arrays cleanly");
console.log("✅ Use Error.isError() for reliable error detection, especially across realms");
console.log("✅ Use Uint8Array base64/hex methods instead of manual btoa/atob conversions");
console.log("✅ Use Map.upsert() for atomic update/insert operations (better than has+get+set)");
console.log("✅ Use JSON.parse source access for parsing large numbers/decimals without precision loss");
console.log("✅ Use Iterator.concat() to combine multiple iterators lazily");
console.log("⚠️  Always handle exceptions from base64/hex decoding of untrusted input");
console.log("⚠️  Remember that Math.sumPrecise() returns a Number, it just does intermediate steps precisely");

// ============================================
// 10. Cross-references
// ============================================
console.log("\n--- 10. Cross-references ---\n");

console.log("📘 Numbers/Math: 05-numbers-math.js");
console.log("📘 Arrays: 06-arrays.js");
console.log("📘 Async Iterators: 22-iterators-generators.js");
console.log("📘 Error Handling: 20-error-handling.js");
console.log("📘 Typed Arrays: 41-typed-arrays.js");
console.log("📘 Map/Set: 10-map-set.js");
console.log("📘 JSON: 11-json.js");
console.log("📘 Iterators: 22-iterators-generators.js");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39.6-es2026-features-ts-comparison.ts
*/
