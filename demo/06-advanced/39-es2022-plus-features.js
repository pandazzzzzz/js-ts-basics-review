// ES2022+ Features Demo
// 📘 For TypeScript comparison, see: 39-es2022-plus-features-ts-comparison.ts
// 📘 javascript.info scattered chapters + MDN "New in JavaScript"
// 📘 https://github.com/tc39/proposals/blob/main/finished-proposals.md
// 📌 Covers ES2021 ~ ES2027 features + Stage 3 proposals

// ============================================
// ES2021 Features (Brief Review)
// ============================================

// Note: Promise combinators (Promise.all, Promise.race, Promise.allSettled, Promise.any)
// are covered in detail in 30-promises.js
// This file focuses on OTHER ES2021+ features

console.log("\n=== ES2021+ Features Overview ===\n");
console.log("ES2021:");
console.log("  - Promise.any(), AggregateError (see 30-promises.js)");
console.log("  - String.replaceAll()");
console.log("  - Logical assignment operators (||=, &&=, ??=)");
console.log("  - Numeric separators");
console.log("  - WeakRef, FinalizationRegistry");
console.log("  - Intl.PluralRules");
console.log("\nES2022:");
console.log("  - Class private fields (#field)");
console.log("  - .at() method for arrays/strings");
console.log("  - Object.hasOwn()");
console.log("  - Error.cause");
console.log("  - Top-level await");
console.log("  - RegExp /d flag (match indices)");
console.log("\nES2023:");
console.log("  - Immutable array methods (toSorted, toReversed, with)");
console.log("  - findLast(), findLastIndex()");
console.log("  - Hashbang syntax");
console.log("\nES2024:");
console.log("  - Object.groupBy(), Map.groupBy()");
console.log("  - Promise.withResolvers()");
console.log("  - RegExp /v flag (unicodeSets)");
console.log("  - ArrayBuffer.transfer (transfer/resize)");
console.log("  - Well-Formed Unicode Strings (isWellFormed/toWellFormed)");
console.log("\nES2025:");
console.log("  - Set methods (union, intersection, difference)");
console.log("  - Iterator helpers");
console.log("  - RegExp.escape() (escape regex special characters)");
console.log("  - Promise.try() (normalize sync/async errors)");
console.log("  - Float16Array / Math.f16round() (half-precision floats)");
console.log("  - JSON Modules (import JSON directly)");
console.log("  - Import Attributes (with { type: 'json' })");
console.log("  - RegExp Modifiers (inline flag changes)");
console.log("  - Redeclarable global eval vars");
console.log("\nES2026:");
console.log("  - Math.sumPrecise (high-precision floating-point summation)");
console.log("  - Array.fromAsync (create arrays from async iterables)");
console.log("  - Error.isError (type checking for Error objects)");
console.log("  - Uint8Array to/from Base64 (base64 encoding/decoding)");
console.log("  - Map.prototype.upsert (conditional insert/update)");
console.log("  - JSON.parse source text access");
console.log("  - Iterator Sequencing (iter1 + iter2)");
console.log("\nES2027:");
console.log("  - Temporal API (modern date/time API)");
console.log("  - Explicit Resource Management (using/await using, ES2027)");
console.log("  - DisposableStack");
console.log("  - Atomics.pause");
console.log("  - Joint Iteration");
console.log("\nStage 3 Proposals:");
console.log("  - Decorators (Stage 3 - class/method decorators)");

// ============================================
// ES2022 Features
// ============================================

// Note: Class enhancements covered in 16-classes.js

// ============================================
// Error.cause (ES2022)
// - Allows chaining errors with original cause
// - Useful for preserving error context through multiple layers
console.log("\n=== Error.cause (ES2022) ===");

function connectDatabase() {
  throw new Error("Connection timeout");
}

function initializeApp() {
  try {
    connectDatabase();
  } catch (originalError) {
    // Chain errors with cause property
    throw new Error("Failed to initialize app", { cause: originalError });
  }
}

try {
  initializeApp();
} catch (error) {
  console.log("Error message:", error.message);
  console.log("Original cause:", error.cause?.message);
  // Output:
  // Error message: Failed to initialize app
  // Original cause: Connection timeout
}

// ============================================
// Top-level await (ES2022)
// - Use await at the top level of ES modules
// - No need to wrap in async function
// - Module evaluation waits for the promise to resolve
console.log("\n=== Top-level await (ES2022) ===");

// Example (only works in ES modules):
// const data = await fetch('/api/config').then(r => r.json());
// const module = await import('./dynamic-module.js');

// Use cases:
// - Dynamic imports based on runtime conditions
// - Loading configuration before module execution
// - Dependency initialization

console.log("Note: Top-level await only works in ES modules");

// ============================================
// ES2021: String Methods
// ============================================

console.log("\n=== String.replaceAll() (ES2021) ===");

// Replace all occurrences of substring
const text = "hello world, hello universe";
const replaced = text.replaceAll("hello", "hi");
console.log("Replaced:", replaced); // "hi world, hi universe"

// Replace with global regex
const text2 = "cat cat cat";
const replaced2 = text2.replaceAll(/cat/g, "dog");
console.log("Replaced with regex:", replaced2); // "dog dog dog"

// ⚠️ Pitfall: Non-global regex throws TypeError
try {
  text2.replaceAll(/arez/, "dog"); // Missing 'g' flag
} catch (err) {
  console.log("Non-global regex error:", err.message);
}

// Comparison with replace() - replaces only first occurrence
console.log("replace() vs replaceAll():");
console.log("  replace():", "cat cat cat".replace("cat", "dog")); // "dog cat cat"
console.log("  replaceAll():", "cat cat cat".replaceAll("cat", "dog")); // "dog cat dog"

// ============================================
// ES2021: Logical Assignment Operators
// ============================================

console.log("\n=== Logical Assignment Operators (ES2021) ===");

// Logical OR assignment (||=) - assigns if falsy
let x = 0;
x ||= 10;
console.log("x ||= 10:", x); // 10 (0 is falsy)

let y = 5;
y ||= 10;
console.log("y ||= 10:", y); // 5 (5 is truthy, no assignment)

// Logical AND assignment (&&=) - assigns if truthy
let a = 5;
a &&= 10;
console.log("a &&= 10:", a); // 10 (5 is truthy)

let b = 0;
b &&= 10;
console.log("b &&= 10:", b); // 0 (0 is falsy, no assignment)

// Nullish coalescing assignment (??=) - assigns if null/undefined
let c = null;
c ??= 20;
console.log("c ??= 20:", c); // 20 (null is nullish)

let d = 0;
d ??= 20;
console.log("d ??= 20:", d); // 0 (0 is not nullish)

// Practical use case: Set defaults
let config = {};
config.port ??= 8080;      // Only sets if 8080 if undefined/null
config.timeout ??= 5000;
console.log("Config defaults:", config);

// ============================================
// ES2021: Numeric Separators
// ============================================

console.log("\n=== Numeric Separators (ES2021) ===");

const billion = 1_000_000_000;
const pi = 3.141_592_653;
const bytes = 0xFF_FF_FF_FF;
const binary = 0b1010_0001_1000_0101;

console.log("Billion:", billion); // 1000000000
console.log("PI:", pi); // 3.141592653
console.log("Bytes:", bytes); // 4294967295
console.log("Binary:", binary); // 41373

// Comparison (harder to read):
const oldStyle = 1000000000;
const newStyle = 1_000_000_000;
console.log("Same value:", oldStyle === newStyle); // true

// ============================================
// ES2021: WeakRef
// ============================================

console.log("\n=== WeakRef (ES2021) ===");

let weakTarget = { data: "important" };
const weakRef = new WeakRef(weakTarget);

console.log("WeakRef deref:", weakRef.deref()); // { data: "important" }

weakTarget = null; // Remove strong reference
// weakRef.deref() may now return undefined after GC
console.log("After removing target:", weakRef.deref()); // { data: "important" } or undefined

// ============================================
// ES2021: FinalizationRegistry
// ============================================

console.log("\n=== FinalizationRegistry (ES2021) ===");

const registry = new FinalizationRegistry((heldValue) => {
  console.log("Object was GC'd, held value:", heldValue);
});

let finalObj = { id: 1 };
registry.register(finalObj, "Object #1");

finalObj = null; // Remove strong reference
// GC may trigger callback with "Object #1"

// ============================================
// ES2021: Intl.PluralRules
// ============================================

console.log("\n=== Intl.PluralRules (ES2021) ===");

const en = new Intl.PluralRules('en-US');
console.log("1:", en.select(1));    // "one"
console.log("2:", en.select(2));    // "other"
console.log("0:", en.select(0));    // "other"

const ru = new Intl.PluralRules('ru', { type: 'ordinal' });
console.log("Russian ordinal 1:", ru.select(1)); // "one"
console.log("Russian ordinal 2:", ru.select(2)); // "few"

// ============================================
// .at() Method (ES2022)
// - Access array/string elements with negative indices
// - Returns undefined for out-of-bounds indices
console.log("\n=== .at() Method (ES2022) ===");

const arr = [10, 20, 30, 40, 50];
console.log("arr.at(0):", arr.at(0));    // 10 (first element)
console.log("arr.at(-1):", arr.at(-1));  // 50 (last element)
console.log("arr.at(-2):", arr.at(-2));  // 40 (second to last)
console.log("arr.at(10):", arr.at(10));  // undefined (out of bounds)

// Comparison with bracket notation:
console.log("arr[-1]:", arr[-1]);        // undefined (doesn't work)
console.log("arr[arr.length - 1]:", arr[arr.length - 1]); // 50 (verbose)

// Works with strings too:
const str = "Hello";
console.log("str.at(-1):", str.at(-1));  // "o"

// ============================================
// Object.hasOwn() (ES2022)
// - Safer alternative to Object.prototype.hasOwnProperty()
// - Not affected by prototype chain overrides
console.log("\n=== Object.hasOwn() (ES2022) ===");

const obj = { name: "Alice", age: 30 };

// Old way (can be overridden):
console.log("obj.hasOwnProperty('name'):", obj.hasOwnProperty("name")); // true

// New way (safer):
console.log("Object.hasOwn(obj, 'name'):", Object.hasOwn(obj, "name")); // true
console.log("Object.hasOwn(obj, 'toString'):", Object.hasOwn(obj, "toString")); // false

// Why safer? Consider this case:
const objWithoutProto = Object.create(null);
objWithoutProto.name = "Bob";
// objWithoutProto.hasOwnProperty('name'); // ❌ TypeError!
console.log("Object.hasOwn(objWithoutProto, 'name'):", Object.hasOwn(objWithoutProto, "name")); // ✅ true

// ============================================
// RegExp /d Flag (ES2022)
// - Provides start and end indices for matches and capture groups
console.log("\n=== RegExp /d Flag (ES2022) ===");

const dateText = "2023-12-25";
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/d;
const match = dateRegex.exec(dateText);

console.log("Match:", match[0]);                    // "2023-12-25"
console.log("Year group:", match.groups.year);      // "2023"
console.log("Indices:", match.indices);             // [[0, 10], [0, 4], [5, 7], [8, 10]]
console.log("Year indices:", match.indices.groups.year); // [0, 4]

// Use case: Syntax highlighting, precise text replacement

// ============================================
// ES2023 Features
// ============================================

// ============================================
// Immutable Array Methods (ES2023)
// Note: See 02-data-structures/06-arrays.js for detailed coverage
console.log("\n=== Immutable Array Methods (ES2023) ===");

const numbers = [3, 1, 4, 1, 5];
console.log("Original:", numbers);
console.log("toSorted():", numbers.toSorted());     // [1, 1, 3, 4, 5]
console.log("toReversed():", numbers.toReversed()); // [5, 1, 4, 1, 3]
console.log("with(2, 99):", numbers.with(2, 99));   // [3, 1, 99, 1, 5]
console.log("Original unchanged:", numbers);        // [3, 1, 4, 1, 5]

// toSpliced() - Immutable version of splice()
// splice(start, deleteCount, ...items) - modifies original
// toSpliced(start, deleteCount, ...items) - returns new array
const items = [1, 2, 3, 4, 5];
console.log("\n=== toSpliced() - Immutable splice ===");
console.log("Original items:", items);

// Remove 2 elements starting at index 1
const spliced1 = items.toSpliced(1, 2);
console.log("toSpliced(1, 2):", spliced1); // [1, 4, 5]

// Replace 1 element at index 2 with 'a' and 'b'
const spliced2 = items.toSpliced(2, 1, 'a', 'b');
console.log("toSpliced(2, 1, 'a', 'b'):", spliced2); // [1, 2, 'a', 'b', 4, 5]

// Insert elements at index 3 without deleting
const spliced3 = items.toSpliced(3, 0, 'x', 'y');
console.log("toSpliced(3, 0, 'x', 'y'):", spliced3); // [1, 2, 3, 'x', 'y', 4, 5]

// Original array remains unchanged
console.log("Original items still:", items); // [1, 2, 3, 4, 5]

// Comparison with mutable splice()
const mutableItems = [...items];
const removed = mutableItems.splice(1, 2);
console.log("\nMutable splice() comparison:");
console.log("  mutableItems after splice:", mutableItems); // [1, 4, 5] (modified)
console.log("  removed elements:", removed); // [2, 3]

const findItems = [1, 2, 3, 4, 5];
console.log("findLast(x => x > 3):", findItems.findLast(x => x > 3)); // 5
console.log("findLastIndex(x => x > 3):", findItems.findLastIndex(x => x > 3)); // 4

// ============================================
// Hashbang Syntax (ES2023)
// - Allows JavaScript files to be executed directly as scripts
console.log("\n=== Hashbang Syntax (ES2023) ===");

// Example file content:
// #!/usr/bin/env node
// console.log("This file can be executed directly!");

// Usage:
// 1. Add hashbang as first line
// 2. Make file executable: chmod +x script.js
// 3. Run directly: ./script.js

console.log("Hashbang allows JS files to be executable scripts");

// ============================================
// ES2024 Features
// ============================================

// ============================================
// Object.groupBy / Map.groupBy (ES2024)
// - Group array elements by a key function
// - Object.groupBy returns plain object, Map.groupBy returns Map
console.log("\n=== Object.groupBy / Map.groupBy (ES2024) ===");

const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 30 }
];

// Group by age using Object.groupBy
const groupedByAge = Object.groupBy(people, person => person.age);
console.log("Grouped by age:", groupedByAge);
// { 25: [{name: "Alice", age: 25}, {name: "Charlie", age: 25}],
//   30: [{name: "Bob", age: 30}, {name: "David", age: 30}] }

// Group by age using Map.groupBy
const mapGrouped = Map.groupBy(people, person => person.age);
console.log("Map grouped:", mapGrouped);
console.log("Get age 25 group:", mapGrouped.get(25));

// Old way (manual reduce):
const manualGroup = people.reduce((acc, person) => {
  const key = person.age;
  if (!acc[key]) acc[key] = [];
  acc[key].push(person);
  return acc;
}, {});
console.log("Manual grouping:", manualGroup);

// ============================================
// Promise.withResolvers() (ES2024)
// - Exposes resolve and reject functions outside Promise constructor
// - Useful for external control of Promise state
console.log("\n=== Promise.withResolvers() (ES2024) ===");

// Old way:
let resolveOld, rejectOld;
const promiseOld = new Promise((resolve, reject) => {
  resolveOld = resolve;
  rejectOld = reject;
});

// New way:
const { promise, resolve, reject } = Promise.withResolvers();

// Use case: Event-driven promise resolution
class AsyncQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item) {
    const { promise, resolve } = Promise.withResolvers();
    this.queue.push({ item, resolve });
    return promise;
  }

  dequeue() {
    if (this.queue.length === 0) return null;
    const { item, resolve } = this.queue.shift();
    resolve(item);
    return item;
  }
}

const queue = new AsyncQueue();
queue.enqueue("task1").then(result => console.log("Resolved:", result));
setTimeout(() => queue.dequeue(), 100);

// ============================================
// RegExp /v Flag (ES2024)
// - Enhanced Unicode support with set operations
// - Replaces /u flag with more features
console.log("\n=== RegExp /v Flag (ES2024) ===");

// Set operations in character classes:
// - Intersection: [A&&B]
// - Subtraction: [A--B]
// - Union: [A[B]] (implicit)

console.log("RegExp /v flag features:");
console.log("- Set operations in character classes");
console.log("- Intersection: [A&&B]");
console.log("- Subtraction: [A--B]");
console.log("- Union: [A[B]]");

// ⚠️  Note:
// - SharedArrayBuffer only works with integer TypedArrays (Int32Array, BigInt64Array)

// Example: Match emoji but not keycap emoji
// const emojiRegex = /[\p{Emoji}--\p{Emoji_Keycap}]/v;
// console.log("😀 matches:", emojiRegex.test("😀")); // true
// console.log("1️⃣ matches:", emojiRegex.test("1️⃣")); // false (keycap)

// Example: Match letters that are both uppercase and Latin
// const upperLatinRegex = /[\p{Uppercase}&&\p{Script=Latin}]/v;
// console.log("A matches:", upperLatinRegex.test("A")); // true
// console.log("Α matches:", upperLatinRegex.test("Α")); // false (Greek)

console.log("\nUse cases:");
console.log("- Complex Unicode character matching");
console.log("- Emoji filtering and validation");
console.log("- Script-specific text processing");

// ============================================
// ArrayBuffer.transfer() (ES2024)
// - Transfer ownership of ArrayBuffer to another context
// - Useful for worker communication
console.log("\n=== ArrayBuffer.transfer() (ES2024) ===");

console.log("ArrayBuffer.prototype.transfer():");
console.log("- Transfer ownership without copying");
console.log("- Detaches original buffer");
console.log("- Worker.postMessage optimization");

console.log("\nExample:");
console.log(`
const buffer = new ArrayBuffer(1024);
const transferred = buffer.transfer(); // buffer becomes detached
// transferred is now the new owner of the memory
`);

// ============================================
// Resizable ArrayBuffers (ES2024)
// - Dynamically resize buffers without reallocation
console.log("\n=== Resizable ArrayBuffers (ES2024) ===");

console.log("Resizable/growable ArrayBuffer features:");
console.log("- new ArrayBuffer(size, { maxByteLength })");
console.log("- buffer.resize(newSize)");
console.log("- buffer.resizable / buffer.maxByteLength");

console.log("\nExample:");
console.log(`
const buffer = new ArrayBuffer(1024, { maxByteLength: 4096 });
console.log(buffer.resizable); // true
buffer.resize(2048); // Resize to 2KB
console.log(buffer.byteLength); // 2048
`);

// ============================================
// Well-Formed Unicode Strings (ES2024)
// - isWellFormed() / toWellFormed() for lone surrogate handling
console.log("\n=== Well-Formed Unicode Strings (ES2024) ===");

console.log("String.prototype.isWellFormed():");
console.log("- Returns true if string contains no lone surrogates");
console.log("- Useful for proper Unicode handling");

console.log("\nString.prototype.toWellFormed():");
console.log("- Replaces lone surrogates with U+FFFD");
console.log("- Safe for text processing");

console.log("\nExample:");
console.log(`
const str = "\\uD800"; // Lone surrogate (invalid)
console.log(str.isWellFormed()); // false
console.log(str.toWellFormed()); // "\\uFFFD" (replacement char)
`);

// ============================================
// ES2025 Features (Stage 4 / Finalized)
// ============================================

/*
 * verification:
 *   feature: Set methods
 *   status: ES2025
 *   stage4Date: 2024-02
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Set Methods (ES2025)
// - Mathematical set operations
// - Returns new Set (immutable)
console.log("\n=== Set Methods (ES2025) ===");

// ⚠️ BROWSER/RUNTIME SUPPORT:
// - Chrome: 122+ (February 2024)
// - Firefox: 127+ (June 2024)
// - Safari: 17+ (March 2024)
// - Node.js: 22.0+ (April 2024)
// - Edge: 122+ (February 2024)

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union: All elements from both sets
console.log("union:", setA.union(setB)); // Set {1, 2, 3, 4, 5, 6}

// Intersection: Elements in both sets
console.log("intersection:", setA.intersection(setB)); // Set {3, 4}

// Difference: Elements in A but not in B
console.log("difference:", setA.difference(setB)); // Set {1, 2}

// Symmetric Difference: Elements in either set but not both
console.log("symmetricDifference:", setA.symmetricDifference(setB)); // Set {1, 2, 5, 6}

// Subset/Superset checks
console.log("isSubsetOf:", new Set([1, 2]).isSubsetOf(setA)); // true
console.log("isSupersetOf:", setA.isSupersetOf(new Set([1, 2]))); // true

// Disjoint check: No common elements
console.log("isDisjointFrom:", setA.isDisjointFrom(new Set([7, 8]))); // true

/*
 * verification:
 *   feature: Iterator helpers
 *   status: ES2025
 *   stage4Date: 2024-02
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Iterator Helpers (ES2025)
// - Lazy evaluation methods for iterators
// - More memory efficient than array methods
console.log("\n=== Iterator Helpers (ES2025) ===");

// ⚠️ BROWSER/RUNTIME SUPPORT:
// - Chrome: 122+ (February 2024)
// - Firefox: 131+ (October 2024)
// - Safari: 17.4+ (March 2024)
// - Node.js: 22.0+ (April 2024)
// - Edge: 122+ (February 2024)
// - Polyfill: es-iterator-helpers (npm)

// Note: Iterator helpers are ES2025 features
// They require runtime support or polyfills
// Uncomment when available in your environment

// Example generator function
// function* numbersIterator() {
//   yield 1;
//   yield 2;
//   yield 3;
//   yield 4;
//   yield 5;
// }
// 
// const iter = numbersIterator();
// 
// // Chain operations (lazy evaluation)
// const result = iter
//   .map(x => x * 2)        // [2, 4, 6, 8, 10]
//   .filter(x => x > 5)     // [6, 8, 10]
//   .take(2)                // [6, 8]
//   .toArray();             // Convert to array
// 
// console.log("Iterator result:", result); // [6, 8]

console.log("Iterator helper methods:");
console.log("- map(fn): Transform each value");
console.log("- filter(fn): Filter values");
console.log("- take(n): Take first n elements");
console.log("- drop(n): Skip first n elements");
console.log("- forEach(fn): Execute function for each element");
console.log("- reduce(fn, initial): Reduce to single value");
console.log("- flatMap(fn): Map and flatten");
console.log("- some(fn), every(fn), find(fn)");
console.log("- toArray(): Convert to array");

// Advantage: Lazy evaluation - operations only execute when needed
console.log("\nLazy evaluation example:");
console.log("Infinite iterator with filter and take:");
console.log("- Creates infinite sequence");
console.log("- Filters even numbers");
console.log("- Takes first 10");
console.log("- Only computes what's needed");

// const infiniteIter = (function* () {
//   let i = 0;
//   while (true) yield i++;
// })();
// 
// const first10Even = infiniteIter
//   .filter(x => x % 2 === 0)
//   .take(10)
//   .toArray();
// 
// console.log("First 10 even numbers:", first10Even);

/*
 * verification:
 *   feature: Float16Array
 *   status: ES2025
 *   stage4Date: 2024-03
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Float16Array / Math.f16round (ES2025)
// - Half-precision floating point numbers (16-bit)
// - More memory efficient than Float32Array
console.log("\n=== Float16Array / Math.f16round (ES2025) ===");

console.log("Float16Array:");
console.log("- 16-bit half-precision floats");
console.log("- Memory efficient for ML/audio graphics");
console.log("- new Float16Array(length or typed array)");

console.log("\nMath.f16round():");
console.log("- Round to nearest Float16 value");
console.log("- Similar to Math.fround() for Float32");

console.log("\nExample:");
console.log(`
const arr = new Float16Array([1.0, 2.5, 3.14159]);
console.log(arr[2]); // 3.14 (rounded to Float16 precision)

const rounded = Math.f16round(3.14159265359);
console.log(rounded); // 3.140625 (Float16 precision)
`);

// ============================================
// JSON Modules (ES2025)
// - Import JSON files directly as modules
console.log("\n=== JSON Modules (ES2025) ===");

console.log("Import JSON as module:");
console.log("- import data from './config.json' with { type: 'json' }");
console.log("- Type-safe JSON imports");
console.log("- No need for fetch() or require()");

console.log("\nExample:");
console.log(`
// config.json: { "apiUrl": "https://api.example.com" }
import config from './config.json' with { type: 'json' };
console.log(config.apiUrl); // "https://api.example.com"
`);

// ============================================
// RegExp Modifiers (ES2025)
// - Inline flag changes within regex patterns
console.log("\n=== RegExp Modifiers (ES2025) ===");

console.log("Inline modifiers:");
console.log("- (?i) case insensitive");
console.log("- (?m) multiline");
console.log("- (?s) dotAll");
console.log("- (?U) unicode");
console.log("- (?-flag) to turn off a flag");

console.log("\nExample:");
console.log(`
// Case-insensitive for part of pattern only
const regex = /(?i:hello) WORLD/;
regex.test("HELLO world"); // true for 'hello' part, false overall

// Turn off case-insensitivity
const mixed = /(?i:hello) (?-i:WORLD)/;
mixed.test("hello World"); // false - WORLD must be uppercase
`);

/*
 * verification:
 *   feature: RegExp Modifiers
 *   status: ES2025
 *   stage4Date: 2024-03
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Duplicate Named Capture Groups (ES2025)
// - Allow same name for different capture groups
console.log("\n=== Duplicate Named Capture Groups (ES2025) ===");

console.log("Duplicate named captures:");
console.log("- Same name in different alternatives");
console.log("- Useful for matching multiple formats");

console.log("\nExample:");
console.log(`
// Match date in YYYY-MM-DD or DD/MM/YYYY format
const dateRegex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})|(?<day>\\d{2})\\/(?<month>\\d{2})\\/(?<year>\\d{4})/;
const match1 = dateRegex.exec("2024-06-15");
const match2 = dateRegex.exec("15/06/2024");
console.log(match1.groups); // { year: "2024", month: "06", day: "15" }
console.log(match2.groups); // { year: "2024", month: "06", day: "15" }
`);

/*
 * verification:
 *   feature: Duplicate Named Capture Groups
 *   status: ES2025
 *   stage4Date: 2024-03
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

/*
 * verification:
 *   feature: using (Explicit Resource Management)
 *   status: ES2027
 *   stage4Date: 2025-05
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Resource Management (ES2027)
// - Automatic resource cleanup using Symbol.dispose
// - Similar to try-with-resources in Java or using in C#
// ES2027: Explicit Resource Management reached Stage 4 in May 2025.
console.log("\n=== Resource Management (ES2027) ===");

// ⚠️ BROWSER/RUNTIME SUPPORT:
// - Chrome: 122+ (July 2023), 130+ (Sept 2024) shipping by default
// - Firefox: 120+ (Dec 2023), 134+ (June 2025) shipping by default
// - Safari: 17.4+ (May 2023), 18.2+ (Oct 2024) shipping by default
// - Node.js: 20.4+ (June 2023) with --harmony-explicit-resource-management flag
// - Node.js: 22.0+ (April 2024) enabled by default
// - Edge: 122+ (July 2023), 130+ (Sept 2024) shipping by default
// - TypeScript: 5.2+ (August 2023) support for using declarations

// Define a disposable resource
class FileHandle {
  constructor(filename) {
    this.filename = filename;
    console.log(`Opening file: ${filename}`);
  }

  write(data) {
    console.log(`Writing to ${this.filename}: ${data}`);
  }

  [Symbol.dispose]() {
    console.log(`Closing file: ${this.filename}`);
  }
}

// Note: using declarations reached Stage 4 (ES2027, May 2025)
// They require runtime support (Node.js 22.0+, modern browsers)
// Check browser support (caniuse.com) before production use

// Using declaration - automatically calls Symbol.dispose
// {
//   using file = new FileHandle("data.txt");
//   file.write("Hello, World!");
//   // file is automatically disposed at end of block
// }
// console.log("File closed automatically");

console.log("Using declaration syntax:");
console.log("- using resource = new Resource()");
console.log("- Automatically calls Symbol.dispose at end of block");
console.log("- Similar to try-with-resources in Java");

// Async disposal with Symbol.asyncDispose
class DatabaseConnection {
  constructor(url) {
    this.url = url;
    console.log(`Connecting to: ${url}`);
  }

  async query(sql) {
    console.log(`Executing: ${sql}`);
    return [];
  }

  async [Symbol.asyncDispose]() {
    console.log(`Disconnecting from: ${this.url}`);
    // Async cleanup logic
  }
}

// Await using for async resources
// async function queryDatabase() {
//   await using db = new DatabaseConnection("localhost:5432");
//   await db.query("SELECT * FROM users");
//   // db is automatically disposed (async) at end of block
// }

console.log("\nAsync using declaration:");
console.log("- await using resource = new AsyncResource()");
console.log("- Automatically calls Symbol.asyncDispose");
console.log("- Waits for async cleanup to complete");

// DisposableStack for managing multiple resources
console.log("\nDisposableStack:");
console.log("- Manage multiple disposable resources");
console.log("- stack.use(resource) - Add resource");
console.log("- stack.defer(fn) - Add cleanup function");
console.log("- stack.dispose() - Dispose all in reverse order");

// const stack = new DisposableStack();
// stack.use(new FileHandle("file1.txt"));
// stack.use(new FileHandle("file2.txt"));
// stack.defer(() => console.log("Custom cleanup"));
// stack.dispose(); // Disposes all resources in reverse order

// Use cases:
console.log("\nUse cases:");
console.log("- File handles");
console.log("- Database connections");
console.log("- Locks and semaphores");
console.log("- Network sockets");
console.log("- Temporary resources");

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Using features without checking browser support
console.log("\nPitfall 1: Browser/runtime compatibility");
console.log("  ES2024/ES2025 + Stage 3 proposals may not be available");
console.log("  Check: https://caniuse.com or Node.js version");
console.log("  Fix: Use transpilation (Babel, TypeScript) or polyfills");

// Pitfall 2: Set methods modify original (no, they don't - but confusion)
console.log("\nPitfall 2: Set method confusion");
console.log("  setA.union(setB) returns NEW Set");
console.log("  setA is NOT modified");
console.log("  Similar to toSorted(), toReversed()");

// Pitfall 3: Iterator helpers are lazy
console.log("\nPitfall 3: Iterator helpers are lazy");
console.log("  Operations only execute when consumed");
console.log("  .map().filter() without .toArray() does nothing");
console.log("  Fix: Always consume with .toArray() or .forEach()");

// Pitfall 4: Object.groupBy key types
console.log("\nPitfall 4: Object.groupBy keys are strings");
console.log("  Object.groupBy returns Record<string, T[]>");
console.log("  Number keys become string keys");
console.log("  Use Map.groupBy for non-string keys");

// Pitfall 5: Promise.withResolvers timing
console.log("\nPitfall 5: Promise.withResolvers timing");
console.log("  resolve/reject work immediately");
console.log("  Promise may be resolved before you expect");
console.log("  Fix: Control timing with careful placement");

// Pitfall 6: using declaration scope
console.log("\nPitfall 6: using declaration scope");
console.log("  Disposed at end of block scope");
console.log("  Not at end of function if nested in block");
console.log("  Fix: Be aware of block boundaries");

// Pitfall 7: RegExp /v flag complexity
console.log("\nPitfall 7: RegExp /v flag syntax");
console.log("  [A&&B] is intersection, not 'and'");
console.log("  [A--B] is subtraction, not 'minus'");
console.log("  Fix: Read spec carefully, test patterns");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Check browser/runtime support before using new features");
console.log("2. Use transpilation for production code");
console.log("3. Prefer Set methods over manual implementations");
console.log("4. Use Object.groupBy for string keys, Map.groupBy for other keys");
console.log("5. Use Iterator helpers for memory-efficient processing");
console.log("6. Use using/await using for resource cleanup");
console.log("7. Add polyfills for critical missing features");
console.log("8. Use Promise.withResolvers for external control");
console.log("9. Test RegExp /v patterns thoroughly");
console.log("10. Keep tsconfig.json lib updated for TypeScript");

console.log("\n❌ DON'T:");
console.log("1. Don't assume new features are available everywhere");
console.log("2. Don't use features without fallbacks in production");
console.log("3. Don't forget to consume iterator chains (toArray/forEach)");
console.log("4. Don't mix Object.groupBy with number keys expecting numbers");
console.log("5. Don't forget to implement Symbol.dispose for using");
console.log("6. Don't use complex RegExp /v patterns without testing");
console.log("7. Don't rely on lazy iterators without consuming them");
console.log("8. Don't skip version checks in package.json");
console.log("9. Don't use experimental features without transpilation");
console.log("10. Don't forget to update TypeScript for new features");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Browser compatibility tables (caniuse.com)");
console.log("2. Node.js version requirements");
console.log("3. TypeScript lib settings in tsconfig.json");
console.log("4. Polyfill availability and quality");
console.log("5. Transpilation output size");
console.log("6. Iterator helper memory efficiency vs array methods");
console.log("7. Set method return types (new Set, not original)");
console.log("8. using declaration disposal timing");

// ============================================
// ES2025 Features (continued) & ES2027
// ============================================

/*
 * verification:
 *   feature: Temporal
 *   status: ES2027
 *   stage4Date: 2025-09
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Temporal API (ES2027)
// - Modern date/time API to replace Date object
// - Immutable, timezone-aware, easier to use
console.log("\n=== Temporal API (ES2027) ===");

console.log("NOTE: Temporal reached Stage 4 in Nov 2023 and is targeted for ES2027.");
console.log("Browser/runtime support varies by engine. Check caniuse.com for current status.");
console.log("Polyfill (for older environments): @js-temporal/polyfill (npm)");
console.log("Spec: https://github.com/tc39/proposal-temporal");

console.log("\nTemporal object types:");
console.log("- Temporal.Now: Current time methods");
console.log("- Temporal.PlainDate: Date without time (e.g., 2024-01-15)");
console.log("- Temporal.PlainTime: Time without date (e.g., 14:30:00)");
console.log("- Temporal.PlainDateTime: Date and time without timezone");
console.log("- Temporal.ZonedDateTime: Date, time, and timezone");
console.log("- Temporal.Duration: Duration of time (e.g., 2 hours, 30 minutes)");
console.log("- Temporal.Instant: Exact point in time (UTC)");

console.log("\nExample syntax:");
console.log(`
// Get current date
const today = Temporal.Now.plainDateISO();
console.log("Today:", today.toString()); // "2024-01-15"

// Create specific date
const birthday = Temporal.PlainDate.from("1990-06-20");
console.log("Birthday:", birthday.year, birthday.month, birthday.day);

// Date arithmetic
const nextWeek = today.add({ days: 7 });
console.log("Next week:", nextWeek.toString());

// Duration calculation
const age = today.since(birthday);
console.log("Age:", age.years, "years");

// Timezone-aware datetime
const meeting = Temporal.ZonedDateTime.from({
  year: 2024,
  month: 3,
  day: 15,
  hour: 14,
  timeZone: "America/New_York"
});
console.log("Meeting:", meeting.toString());
`);

console.log("\nAdvantages over Date object:");
console.log("1. Immutable (no mutation methods)");
console.log("2. No month index confusion (January = 1, not 0)");
console.log("3. Proper timezone handling");
console.log("4. Clear separation of date/time/datetime/instant");
console.log("5. Simple arithmetic (add, subtract, since, until)");
console.log("6. Precision control (nanoseconds support)");
console.log("7. Internationalization built-in");
console.log("8. No 1970 epoch dependency");

console.log("\nUse cases:");
console.log("- Calendar applications");
console.log("- Scheduling systems");
console.log("- Financial date calculations");
console.log("- Timezone-aware event coordination");
console.log("- Age/duration calculations");

/*
 * verification:
 *   feature: Math.sumPrecise
 *   status: ES2026
 *   stage4Date: 2025-07
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Math.sumPrecise (ES2026)
// - High-precision summation avoiding floating-point errors
// - Uses Kahan-Babuška algorithm internally
// - Reached Stage 4 in 2025-07, part of ES2026
console.log("\n=== Math.sumPrecise (ES2026) ===");

console.log("NOTE: Math.sumPrecise reached Stage 4 in July 2025 and is part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nMath.sumPrecise solves floating-point precision issues:");
console.log(`
// Standard addition accumulates floating-point errors
const numbers = [0.1, 0.2, 0.3, 0.4, 0.5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log(sum); // 1.5 (correct in this case, but not always)

const large = [1e16, 1, 1, 1];
const badSum = large.reduce((a, b) => a + b, 0);
console.log(badSum); // 10000000000000003 (precision loss!)

// Math.sumPrecise handles this correctly
const goodSum = Math.sumPrecise(large);
console.log(goodSum); // 10000000000000003 (correct)
`);

console.log("\nUse cases:");
console.log("- Financial calculations");
console.log("- Scientific data processing");
console.log("- Statistical aggregations");
console.log("- Any scenario sensitive to floating-point error accumulation");

/*
 * verification:
 *   feature: Error.isError
 *   status: ES2026
 *   stage4Date: 2025-05
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Error.isError (ES2026)
// - Reliable Error type checking across realms
// - Replaces instanceof Error which fails across iframes/realms
// ES2026: Error.isError is part of the ECMAScript 2026 specification.
console.log("\n=== Error.isError (ES2026) ===");

console.log("NOTE: Error.isError reached Stage 4 in May 2025 and is part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nError.isError solves cross-realm type checking:");
console.log(`
// Traditional instanceof fails across realms (iframes, workers)
// try { ... } catch (e) { if (e instanceof Error) { ... } }
// This can fail when the Error constructor differs between realms!

// Error.isError provides reliable checking
// if (Error.isError(e)) { console.log("Definitely an Error"); }

// Works with all Error subtypes
// Error.isError(new Error("test"));     // true
// Error.isError(new TypeError("test")); // true
// Error.isError(new RangeError("test"));// true
// Error.isError("not an error");        // false
// Error.isError({ message: "fake" });   // false
`);

console.log("\nUse cases:");
console.log("- Error handling in libraries used across realms");
console.log("- Validating error objects in iframe/postMessage scenarios");
console.log("- Type narrowing in try/catch blocks");

/*
 * verification:
 *   feature: Uint8Array Base64
 *   status: ES2026
 *   stage4Date: 2025-07
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Uint8Array Base64 (ES2026)
// - Native base64 encoding/decoding for binary data
// - Uint8Array.toBase64() and Uint8Array.fromBase64()
// ES2026: Uint8Array Base64 methods are part of the ECMAScript 2026 specification.
console.log("\n=== Uint8Array Base64 (ES2026) ===");

console.log("NOTE: Uint8Array Base64 methods reached Stage 4 in July 2025 and are part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nUint8Array Base64 methods:");
console.log(`
// Encode binary data to Base64
// const data = new Uint8Array([72, 101, 108, 108, 111]);
// const encoded = data.toBase64();
// console.log(encoded); // "SGVsbG8="

// Decode Base64 to binary data
// const decoded = Uint8Array.fromBase64("SGVsbG8=");
// console.log(decoded); // Uint8Array [72, 101, 108, 108, 111]

// Standard and URL-safe variants
// data.toBase64({ alphabet: "base64url" });
`);

console.log("\nUse cases:");
console.log("- Encoding binary data for JSON/API transport");
console.log("- Data URIs and inline resources");
console.log("- Cryptographic key exchange formats");
console.log("- WebSocket binary-to-text protocol adapters");

/*
 * verification:
 *   feature: Upsert
 *   status: ES2026
 *   stage4Date: 2026-01
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Map.prototype.upsert (ES2026)
// - Conditionally insert or update a Map entry
// - Reached Stage 4 in 2026-01, part of ES2026
console.log("\n=== Map.prototype.upsert (ES2026) ===");

console.log("NOTE: Map.prototype.upsert reached Stage 4 in January 2026 and is part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nMap.prototype.upsert syntax:");
console.log(`
// map.upsert(key, onInsert, onUpdate)
// - onInsert: Called when key doesn't exist (returns value to insert)
// - onUpdate: Called when key exists (receives existing value, returns new value)

const counter = new Map();

counter.upsert("requests", () => 1, (existing) => existing + 1);
// First call: onInsert -> 1
console.log(counter.get("requests")); // 1

counter.upsert("requests", () => 1, (existing) => existing + 1);
// Second call: onUpdate(1) -> 2
console.log(counter.get("requests")); // 2
`);

console.log("\nUse cases:");
console.log("- Counters and accumulators");
console.log("- Conditional updates based on existing value");
console.log("  - Cache hit/miss logic");
console.log("  - Conditional inserts");
console.log("- Idempotent operations");

/*
 * verification:
 *   feature: JSON.parse source text access
 *   status: ES2026
 *   stage4Date: 2025-11
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// JSON.parse source text access (ES2026)
// - Access original JSON source text via 'source' property
// - Reached Stage 4 in 2025-11, part of ES2026
console.log("\n=== JSON.parse source text access (ES2026) ===");

console.log("NOTE: JSON.parse source text access reached Stage 4 in November 2025 and is part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nSource text access:");
console.log(`
// Access original JSON string from parsed objects
const jsonString = '{"name":"Alice","age":30}';

// Parse with source tracking
const data = JSON.parse(jsonString);
// const source = data.source; // '{"name":"Alice","age":30"}'

// Useful for error reporting, validation, debugging
`);

console.log("\nUse cases:");
console.log("- Error messages with source context");
console.log("- Custom validation with original text");
console.log("- Debugging and logging");
console.log("- JSON to source round-tripping");

/*
 * verification:
 *   feature: Iterator Sequencing
 *   status: ES2026
 *   stage4Date: 2025-11
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Iterator Sequencing (ES2026)
// - Concatenate iterators using + operator
// - Reached Stage 4 in 2025-11, part of ES2026
console.log("\n=== Iterator Sequencing (ES2026) ===");

console.log("NOTE: Iterator Sequencing reached Stage 4 in November 2025 and is part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nIterator concatenation with +:");
console.log(`
// Concatenate multiple iterators
const iter1 = [1, 2, 3][Symbol.iterator]();
const iter2 = [4, 5][Symbol.iterator]();
const iter3 = [6][Symbol.iterator]();

// Using + operator to concatenate
const combined = iter1 + iter2 + iter3;
console.log([...combined]); // [1, 2, 3, 4, 5, 6]
`);

console.log("\nUse cases:");
console.log("- Combining data sources");
console.log("- Iterator composition");
console.log("- Lazy concatenation of collections");

/*
 * verification:
 *   feature: RegExp.escape
 *   status: ES2025
 *   stage4Date: 2025-02
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// RegExp.escape (ES2025)
// - Escape special regex characters in a string
// - Useful for building dynamic regex patterns safely
// ES2025: RegExp.escape is part of the ECMAScript 2025 specification.
console.log("\n=== RegExp.escape (ES2025) ===");

console.log("NOTE: RegExp.escape is standardized in ES2025.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nRegExp.escape syntax:");
console.log(`
// Escape special characters for use in regex
const userInput = "Hello (world)? [test]";
const escaped = RegExp.escape(userInput);
console.log(escaped); // "Hello \\\\(world\\\\)\\\\? \\\\[test\\\\]"

const regex = new RegExp(\`^\${escaped}$\`);
console.log(regex.test(userInput)); // true

// Without escaping, special characters would be interpreted as regex syntax
const unescapedRegex = new RegExp(\`^\${userInput}$\`);
// Throws SyntaxError or matches incorrectly
`);

console.log("\nUse cases:");
console.log("- Safe search/replace with user input");
console.log("- Building dynamic regex patterns");
console.log("- Input validation with user-provided patterns");
console.log("- Preventing ReDoS attacks from user-controlled regex");

// ============================================
// ES2027 Proposals (Explicit Resource Management & Concurrency)
// ============================================

/*
 * verification:
 *   feature: DisposableStack
 *   status: ES2027
 *   stage4Date: 2025-05
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// DisposableStack (ES2027)
// - Manage multiple disposable resources together
// - Automatic cleanup in reverse order
// Part of Explicit Resource Management (Stage 4 May 2025, ES2027)
console.log("\n=== DisposableStack (ES2027) ===");

console.log("NOTE: DisposableStack reached Stage 4 (ES2027, May 2025).");
console.log("Requires Node.js 22.0+ or modern browsers.");
console.log("Polyfill: @ungap/disposable-stack (npm)");

// DisposableStack example (simplified - commented out for compatibility)
console.log("\nDisposableStack syntax:");
console.log(`
// Manage multiple resources together
const stack = new DisposableStack();

// Add disposable resources
const file1 = stack.use(new FileHandle("file1.txt"));
const file2 = stack.use(new FileHandle("file2.txt"));

// Add custom cleanup functions
stack.defer(() => console.log("Custom cleanup logic"));

// Use the resources
file1.write("Hello 1");
file2.write("Hello 2");

// Dispose all at once (reverse order)
stack.dispose();
// Output:
// Closing file: file2.txt
// Closing file: file1.txt
// Custom cleanup logic
`);

/*
 * verification:
 *   feature: Atomics.pause
 *   status: ES2027
 *   stage4Date: 2024-10
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Atomics.pause (ES2027)
// - Pause execution for spin-wait loops
// - Improves performance of busy-waiting synchronization
// - Reached Stage 4 in October 2024, part of ES2027
console.log("\n=== Atomics.pause (ES2027) ===");

console.log("NOTE: Atomics.pause reached Stage 4 in October 2024 and is part of ES2027.");
console.log("Requires Node.js 22.0+ or modern browsers.");

console.log("\nAtomics.pause purpose:");
console.log(`
// Atomics.pause() is used in spin-wait loops
// It hints to the CPU that the thread is waiting
// Reduces CPU usage compared to tight loops

// Example: Busy-wait spinlock
// const lock = new Int32Array(new SharedArrayBuffer(4));
//
// function acquireLock() {
//   while (Atomics.compareExchange(lock, 0, 0, 1) !== 0) {
//     Atomics.pause(); // Hint: we're waiting
//   }
// }
//
// function releaseLock() {
//   Atomics.store(lock, 0, 0);
// }
`);

console.log("\nUse cases:");
console.log("- Custom mutex implementations");
console.log("- Busy-wait synchronization");
console.log("- Lock-free data structures");
console.log("- Worker coordination");

/*
 * verification:
 *   feature: Joint Iteration
 *   status: ES2027
 *   stage4Date: 2025-11
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Joint Iteration (ES2027)
// - Iterate over multiple iterables simultaneously
// - Reached Stage 4 in November 2025, part of ES2027
console.log("\n=== Joint Iteration (ES2027) ===");

console.log("NOTE: Joint Iteration reached Stage 4 in November 2025 and is part of ES2027.");
console.log("Requires Node.js 22.0+ or modern browsers.");

console.log("\nJoint iteration syntax:");
console.log(`
// Iterate over multiple iterables at once
const names = ["Alice", "Bob", "Charlie"];
const ages = [25, 30, 35];
const cities = ["NYC", "LA", "SF"];

// for...of with destructuring
for (const [[, name], [, age], [, city]] of zip(names, ages, cities)) {
  console.log(\`\${name}, \${age}, \${city}\`);
}
// Output:
// Alice, 25, NYC
// Bob, 30, LA
// Charlie, 35, SF

// zip() creates a joint iterator
// Each iteration yields arrays of [index, value] tuples
`);

console.log("\nUse cases:");
console.log("- Parallel array processing");
console.log("- Combining related data structures");
console.log("- Matrix operations");
console.log("- Paired iteration");

/*
 * verification:
 *   feature: Array.fromAsync
 *   status: ES2026
 *   stage4Date: 2025-05
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Array.fromAsync (ES2026)
// - Create arrays from async iterables
// - Similar to Array.from but for async
// - Reached Stage 4 in 2025-05, part of ES2026
console.log("\n=== Array.fromAsync (ES2026) ===");

console.log("NOTE: Array.fromAsync reached Stage 4 in May 2025 and is part of ES2026.");
console.log("Browser/runtime support is emerging. Check caniuse.com for current status.");

console.log("\nArray.fromAsync syntax:");
console.log(`
// Convert async iterator to array
async function* asyncNumbers() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

const arr = await Array.fromAsync(asyncNumbers());
console.log("From async iterator:", arr); // [1, 2, 3, 4, 5]

// Also works with sync iterables, promises, etc.
const withPromises = await Array.fromAsync([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]);
console.log("With promises:", withPromises); // [1, 2, 3]
`);

/*
 * verification:
 *   feature: Promise.try
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-05-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// ============================================
// Promise.try (ES2025)
// - Normalize sync/async exceptions
// - Similar to try/catch but for functions
console.log("\n=== Promise.try (ES2025) ===");

console.log("NOTE: Promise.try is standardized in ES2025.");
console.log("Check caniuse.com for browser/runtime support status.");

console.log("\nPromise.try syntax:");
console.log(`
// Normalize sync/async errors
function mayThrow() {
  if (Math.random() < 0.5) {
    throw new Error("Sync error");
  }
  return Promise.reject(new Error("Async error"));
}

// Both sync and async errors are caught
Promise.try(() => mayThrow())
  .then(result => console.log("Success:", result))
  .catch(error => console.log("Caught:", error.message));
  // Catches both sync and async errors!
`);

console.log("\nWhy Promise.try?");
console.log("- Catches both sync and async exceptions");
console.log("- No need for separate try/catch and .catch()");
console.log("- Better error handling in promise chains");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. USING DECLARATIONS
   TS 5.2+: Full support for using / await using
   TS:  Requires Disposable / AsyncDisposable interfaces
   TS:  interface Disposable { [Symbol.dispose](): void }
   TS:  interface AsyncDisposable { [Symbol.asyncDispose](): Promise<void> }

2. SATISFIES OPERATOR (TS 4.9)
   TS:  const config = { port: 8080 } satisfies Config;
   TS:  Type-checks without widening literal types
   TS:  Preserves autocomplete for object properties

3. CONST TYPE PARAMETERS (TS 5.0)
   TS:  function identity<const T>(value: T): T { return value; }
   TS:  Preserves literal types in generic functions

4. GROUPBY TYPING
   TS:  Object.groupBy<T, K>(items: T[], fn: (item: T) => K): Record<K, T[]>
   TS:  Map.groupBy<T, K>(items: T[], fn: (item: T) => K): Map<K, T[]>

5. ITERATOR HELPERS TYPING
   TS:  Iterator<T> has full type support for helper methods
   TS:  Type inference works through chained operations

⚠️ BROWSER/RUNTIME SUPPORT:
- ES2024/ES2025 + Stage 3 proposals may require polyfills or transpilation
- Check compatibility: https://caniuse.com
- Node.js: Check version support for each feature
- TypeScript: May need lib updates in tsconfig.json

📘 See related:
- 02-data-structures/06-arrays.js (ES2023 array methods)
- 03-core-concepts/16-classes.js (ES2022 class features)
- 27-memory-management.js (Resource management patterns)
*/
