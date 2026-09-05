// ES2025 Features Demo
// 📘 For TypeScript comparison, see: 39-5-es2025-features-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2025 features:
// 1. Set methods (intersection, union, difference, symmetricDifference, isSubsetOf, isSupersetOf, isDisjointFrom)
// 2. Iterator helpers (map, filter, take, drop, flatMap, toArray, forEach, reduce, etc.)
// 3. RegExp.escape()
// 4. Promise.try()
// 5. Float16Array
// 6. JSON Modules
// 7. Import Attributes
// 8. RegExp Modifiers (inline flags)
// 9. Duplicate Named Capture Groups
// 10. Redeclarable global eval vars
// 11. Intl.DurationFormat

// ============================================
// Table of Contents
// ============================================
// 1. Set Methods
// 2. Iterator Helpers
// 3. RegExp.escape()
// 4. Promise.try()
// 5. Float16Array
// 6. JSON Modules
// 7. Import Attributes
// 8. RegExp Modifiers
// 9. Duplicate Named Capture Groups
// 10. Redeclarable Global eval Vars
// 11. Intl.DurationFormat
// 12. Common Pitfalls
// 13. Best Practices
// 14. Cross-references

console.log("\n=== ES2025 Features ===\n");

// ============================================
// 1. Set Methods
// ============================================
console.log("\n--- 1. Set Methods ---\n");

// 📘 Official MDN examples (Set.prototype.intersection):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection
// MDN's canonical opener:
const odds = new Set([1, 3, 5, 7, 9]);
const squares = new Set([1, 4, 9]);
console.log("MDN odds ∩ squares:", [...odds.intersection(squares)]); // Set(2) { 1, 9 }

const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([4, 5, 6, 7, 8]);
const setC = new Set([1, 2]);

console.log("Set A:", [...setA]);
console.log("Set B:", [...setB]);
console.log("Set C:", [...setC]);

// 1.1 intersection() - Elements present in both sets
const intersection = setA.intersection(setB);
console.log("\nintersection(A, B):", [...intersection]); // [4, 5]

// 1.2 union() - Elements present in either set
const union = setA.union(setB);
console.log("union(A, B):", [...union]); // [1, 2, 3, 4, 5, 6, 7, 8]

// 1.3 difference() - Elements in A not in B
const differenceAB = setA.difference(setB);
console.log("difference(A, B):", [...differenceAB]); // [1, 2, 3]
const differenceBA = setB.difference(setA);
console.log("difference(B, A):", [...differenceBA]); // [6, 7, 8]

// 1.4 symmetricDifference() - Elements in either set but not both
const symmetricDiff = setA.symmetricDifference(setB);
console.log("symmetricDifference(A, B):", [...symmetricDiff]); // [1, 2, 3, 6, 7, 8]

// 1.5 isSubsetOf() - All elements in A are in B
console.log("\nisSubsetOf(C, A):", setC.isSubsetOf(setA)); // true (C is subset of A)
console.log("isSubsetOf(A, B):", setA.isSubsetOf(setB)); // false

// 1.6 isSupersetOf() - All elements in B are in A
console.log("isSupersetOf(A, C):", setA.isSupersetOf(setC)); // true (A is superset of C)
console.log("isSupersetOf(B, A):", setB.isSupersetOf(setA)); // false

// 1.7 isDisjointFrom() - No elements in common
const setD = new Set([9, 10]);
console.log("isDisjointFrom(A, D):", setA.isDisjointFrom(setD)); // true (no overlap)
console.log("isDisjointFrom(A, B):", setA.isDisjointFrom(setB)); // false (have 4,5 in common)

// Use case: Filtering users by multiple criteria
const adminUsers = new Set(["alice", "bob", "charlie"]);
const activeUsers = new Set(["alice", "david", "charlie", "eve"]);
const bannedUsers = new Set(["eve"]);

// Active admins not banned
const activeAdmins = adminUsers.intersection(activeUsers).difference(bannedUsers);
console.log("\nActive admins not banned:", [...activeAdmins]); // ["alice", "charlie"]

// ============================================
// 2. Iterator Helpers
// ============================================
console.log("\n--- 2. Iterator Helpers ---");

// 📘 Official MDN examples (Iterator.prototype.take / drop):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/take
// The file's own fibonacci() below mirrors MDN's canonical lazy-helpers example.
// MDN also shows drop() and the error case:
try {
  [1, 2, 3].values().take(-1); // ❌ RangeError: -1 must be positive
} catch (e) {
  console.log("MDN take(-1) throws:", e.message);
}

// Iterator helpers work on any iterable (arrays, sets, maps, generators, etc.)
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].values(); // Get iterator

// 2.1 map() - Transform elements
const doubled = numbers.map(n => n * 2);
console.log("\nDoubled iterator:", [...doubled]); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// 2.2 filter() - Keep elements matching predicate
const evenNumbers = [1, 2, 3, 4, 5].values().filter(n => n % 2 === 0);
console.log("Even numbers:", [...evenNumbers]); // [2, 4]

// 2.3 take() - Take first N elements
const firstThree = [1, 2, 3, 4, 5].values().take(3);
console.log("First 3 elements:", [...firstThree]); // [1, 2, 3]

// 2.4 drop() - Skip first N elements
const dropFirstTwo = [1, 2, 3, 4, 5].values().drop(2);
console.log("Drop first 2:", [...dropFirstTwo]); // [3, 4, 5]

// 2.5 flatMap() - Map and flatten
const words = ["hello world", "iterator helpers"].values();
const flatMapped = words.flatMap(str => str.split(" "));
console.log("Flat mapped words:", [...flatMapped]); // ["hello", "world", "iterator", "helpers"]

// 2.6 reduce() - Reduce to single value
const sum = [1, 2, 3, 4].values().reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum); // 10

// 2.7 toArray() - Convert iterator to array
const arr = [1, 2, 3].values().toArray();
console.log("toArray():", arr); // [1, 2, 3]

// 2.8 forEach() - Iterate with side effects
console.log("forEach:");
[1, 2, 3].values().forEach(n => console.log("  ", n));

// 2.9 Chaining helpers
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .values()
  .filter(n => n % 2 === 0) // Even numbers: [2,4,6,8,10]
  .map(n => n * 2) // Double: [4,8,12,16,20]
  .drop(2) // Skip first 2: [12,16,20]
  .take(2); // Take first 2: [12,16]
console.log("\nChained result:", [...result]); // [12, 16]

// Works with generators too
// (this fibonacci mirrors the canonical MDN Iterator helpers example)
function* fibonacci() {
  let a = 0,
    b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Get first 5 Fibonacci numbers greater than 10
const fibNumbers = fibonacci()
  .filter(n => n > 10)
  .take(5)
  .toArray();
console.log("\nFirst 5 Fibonacci >10:", fibNumbers); // [13, 21, 34, 55, 89]

// ============================================
// 3. RegExp.escape()
// ============================================
console.log("\n--- 3. RegExp.escape() ---");

/*
 * verification:
 *   feature: RegExp.escape
 *   status: ES2025
 *   stage4Date: 2025-02
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposal-regex-escaping
 */

// Escapes special regex characters in user input
// ⚠️ Note: RegExp.escape also hex-escapes whitespace, '-', and a leading word
// character (per proposal), so the output is NOT just backslash-metacharacters:
const userInput = "Hello. How are you? [123]";
const escaped = RegExp.escape(userInput);
console.log("\nInput:", userInput);
console.log("Escaped:", escaped); // "\\x48ello\\.\\x20How\\x20are\\x20you\\?\\x20\\[123\\]"

// Safe to use in regex
const regex = new RegExp(escaped);
console.log("Regex match:", regex.test("Hello. How are you? [123] more text")); // true

// Before ES2025: Had to manually escape or use a library
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
console.log("\nManual escape equals RegExp.escape:", escapeRegExp(userInput) === escaped); // false!
console.log("  manual escape:", escapeRegExp(userInput)); // "Hello\\. How are you\\? \\[123\\]"
// Both regexes match the same text — they just differ in how characters are encoded.

// Use case: Search user input safely
function search(text, query) {
  const escapedQuery = RegExp.escape(query);
  const regex = new RegExp(escapedQuery, "gi");
  return text.match(regex) || [];
}

// ============================================
// 4. Promise.try()
// ============================================
console.log("\n--- 4. Promise.try() ---");

/*
 * verification:
 *   feature: Promise.try
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposal-promise-try
 */

// Promise.try catches both synchronous and asynchronous errors
function getConfig(path) {
  return Promise.try(() => {
    // May throw synchronously if path is invalid
    if (!path) throw new Error("Path is required");

    // May reject asynchronously
    return fetch(path).then(res => res.json());
  });
}

// Catches both sync and async errors
getConfig("")
  .then(config => console.log("Config:", config))
  .catch(err => console.log("Caught error:", err.message)); // "Path is required" (sync error caught)

getConfig("invalid-path")
  .then(config => console.log("Config:", config))
  .catch(err => console.log("Fetch error caught:", err.message)); // Async error caught

// 📘 Official MDN examples (Promise.try):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/try
// MDN's doSomething shows all four sync/async × success/error paths:
function mdnDoSomething(action) {
  return Promise.try(action)
    .then(result => console.log("MDN Promise.try result:", result))
    .catch(error => console.log("MDN Promise.try caught:", error.message))
    .finally(() => console.log("MDN Promise.try: Done"));
}
mdnDoSomething(() => "sync value");
mdnDoSomething(async () => "async value");
mdnDoSomething(() => {
  throw new Error("Sync error");
});
mdnDoSomething(async () => {
  throw new Error("Async error");
});

// Before ES2025: Had to wrap in new Promise and use try/catch
function getConfigOld(path) {
  return new Promise((resolve, reject) => {
    try {
      if (!path) throw new Error("Path is required");
      resolve(fetch(path).then(res => res.json()));
    } catch (err) {
      reject(err);
    }
  });
}

// Use case: Wrapping functions that may throw or return promises
const safeFunction =
  fn =>
  (...args) =>
    Promise.try(() => fn(...args));

// ============================================
// 5. Float16Array
// ============================================
console.log("\n--- 5. Float16Array ---");

/*
 * verification:
 *   feature: Float16Array
 *   status: ES2025
 *   stage4Date: 2025-02
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2025-02/february-18.md#float16array-for-stage-4
 */

// 16-bit floating point array (half-precision)
// Uses 2 bytes per element instead of 4 (Float32) or 8 (Float64)
const float16 = new Float16Array(3);
float16[0] = 1.5;
float16[1] = Math.PI;
float16[2] = 100000; // Above float16's max (~65504) → overflows to Infinity

console.log("Float16Array:", float16);
console.log("float16[0]:", float16[0]); // 1.5
console.log("float16[1]:", float16[1]); // ~3.140625 (approximate PI)
console.log("float16[2]:", float16[2]); // Infinity (integers up to 2048 are exact, larger values lose precision, >65504 overflows)

// Use case: Graphics, machine learning, and other applications where memory is constrained
// and precision can be traded for smaller memory footprint

// ============================================
// 6. JSON Modules
// ============================================
console.log("\n--- 6. JSON Modules ---");

/*
 * verification:
 *   feature: JSON Modules
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2024-10/october-08.md#import-attributes-and-json-modules-for-stage-4
 */

// Import JSON files directly as modules (with type attribute)
// Example:
// import config from "./config.json" with { type: "json" };
// console.log("Config from JSON module:", config);

// Before: Had to fetch and parse, or use require()
// const config = await fetch("./config.json").then(res => res.json());

console.log("JSON modules allow importing .json files directly with import syntax");
console.log('Use: import data from "./data.json" with { type: "json" }');

// ============================================
// 7. Import Attributes
// ============================================
console.log("\n--- 7. Import Attributes ---");

// Import attributes allow specifying metadata about imports
// The standardized form is the `with` keyword and one attribute key: with { type: "json" }.
// (`assert` was the earlier keyword — deprecated, then removed; CSS/WASM types are not standardized.)

// JSON modules (as above)
// import json from "./data.json" with { type: "json" };

// CSS modules
// import styles from "./styles.css" with { type: "css" };
// document.adoptedStyleSheets.push(styles);

// WebAssembly modules
// import module from "./module.wasm" with { type: "webassembly" };

console.log("Import attributes provide metadata about imported modules");
console.log("Common uses: JSON, CSS, and WebAssembly imports");

// ============================================
// 8. RegExp Modifiers
// ============================================
console.log("\n--- 8. RegExp Modifiers ---");

// Inline regex flags using (?modifiers:pattern) syntax
const text1 = "Hello World HELLO world";

// Case-insensitive match for "hello" only
const caseInsensitive = /(?i:hello)/g;
console.log("Case-insensitive matches:", text1.match(caseInsensitive)); // ["Hello", "HELLO"]

// Case-sensitive match for "Hello"
const caseSensitive = /(?-i:Hello)/g;
console.log("Case-sensitive matches:", text1.match(caseSensitive)); // ["Hello"]

// Multiple modifiers: i = case-insensitive, m = multiline
const multiLine = /(?im:^hello)/g;
const multiLineText = "hello world\nHELLO there";
console.log("Multiline case-insensitive matches:", multiLineText.match(multiLine)); // ["hello", "HELLO"]

// Turn off modifiers: (?i:hello (?-i:WORLD))
const mixed = /(?i:hello (?-i:WORLD))/g;
console.log("Mixed case:", mixed.test("hello WORLD")); // true
console.log("Mixed case:", mixed.test("HELLO world")); // false (WORLD must be uppercase)

// ============================================
// 9. Duplicate Named Capture Groups
// ============================================
console.log("\n--- 9. Duplicate Named Capture Groups ---");

// Allow same named capture groups in different alternatives
const dateRegex = /(?<date>\d{4}-\d{2}-\d{2})|(?<date>\d{2}\/\d{2}\/\d{4})/;
const date1 = "2024-01-01";
const date2 = "01/01/2024";

const match1 = dateRegex.exec(date1);
const match2 = dateRegex.exec(date2);

console.log("ISO date match:", match1?.groups?.date); // "2024-01-01"
console.log("US date match:", match2?.groups?.date); // "01/01/2024"

// Before ES2025: Duplicate named groups caused syntax error

// Use case: Parsing different formats that produce the same logical fields

// ============================================
// 10. Redeclarable Global eval Vars
// ============================================
console.log("\n--- 10. Redeclarable Global eval Vars ---");

/*
 * verification:
 *   feature: Redeclarable global eval vars
 *   status: ES2025
 *   stage4Date: 2025-02
 *   lastVerified: 2026-09-03
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2025-02/february-18.md#redeclarable-global-eval-vars-for-stage-4
 */

// What ES2025 changed: `let`/`const` can now redeclare global vars introduced by
// sloppy eval (those are configurable, deletable properties). Before ES2025 that
// redeclaration threw SyntaxError. Plain var-var redeclaration via eval was always
// legal — the proposal targets the var → let/const case.
//
// Direct eval inside this ESM file is strict (its `var` never leaks to global),
// so vm.runInThisContext is used to reproduce classic-script global semantics:
var globalVar = 10;
eval("var globalVar = 20;"); // strict direct eval: stays scoped to the eval code
console.log("Direct eval in ESM (strict) does not leak:", globalVar); // 10

const vm = await import("node:vm");
vm.runInThisContext('eval("var fromEval = 42");'); // sloppy eval → configurable global var
console.log("eval-introduced global:", globalThis.fromEval); // 42
try {
  vm.runInThisContext('let fromEval = 99; console.log("  in a new script, fromEval =", fromEval);');
  console.log("let redeclaration of eval-introduced var: allowed (ES2025+)");
} catch (e) {
  console.log("Redeclaration error:", e.message);
}

// ============================================
// 11. Intl.DurationFormat
// ============================================
console.log("\n--- 11. Intl.DurationFormat ---");

/*
 * verification:
 *   feature: Intl.DurationFormat
 *   status: ES2025
 *   stage4Date: 2025-07
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposal-intl-duration-format
 */

// Format time durations in a locale-aware way
// 📘 Official MDN examples (Intl.DurationFormat):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat
const mdnDuration = { hours: 1, minutes: 46, seconds: 40 };
console.log(
  "MDN fr-FR long:",
  new Intl.DurationFormat("fr-FR", { style: "long" }).format(mdnDuration)
);
// "1 heure, 46 minutes et 40 secondes"
console.log("MDN en short:", new Intl.DurationFormat("en", { style: "short" }).format(mdnDuration));
// "1 hr, 46 min and 40 sec" (MDN/browser ICU wording; Node 24 prints "1 hr, 46 min, 40 sec")
console.log(
  "MDN pt narrow:",
  new Intl.DurationFormat("pt", { style: "narrow" }).format(mdnDuration)
);
// "1 h 46 min 40 s"

const duration = {
  years: 1,
  months: 2,
  days: 3,
  hours: 4,
  minutes: 5,
  seconds: 6,
};

// English (US)
const enUSFormat = new Intl.DurationFormat("en-US", { style: "long" });
console.log("en-US long format:", enUSFormat.format(duration));
// "1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds"

// English (US) short format
const enUSShort = new Intl.DurationFormat("en-US", { style: "short" });
console.log("en-US short format:", enUSShort.format(duration));
// "1 yr, 2 mths, 3 days, 4 hr, 5 min, 6 sec"

// German
const deFormat = new Intl.DurationFormat("de-DE", { style: "long" });
console.log("de-DE long format:", deFormat.format(duration));
// "1 Jahr, 2 Monate, 3 Tage, 4 Stunden, 5 Minuten und 6 Sekunden"

// Digital format (like HH:MM:SS)
const digitalFormat = new Intl.DurationFormat("en-US", {
  style: "digital",
  hours: "2-digit",
  minutes: "2-digit",
  seconds: "2-digit",
});
console.log("Digital format:", digitalFormat.format({ hours: 2, minutes: 30, seconds: 15 }));
// "02:30:15" (2-digit units are zero-padded)

// ============================================
// 12. Common Pitfalls
// ============================================
console.log("\n--- 12. Common Pitfalls ---");

// Pitfall 1: Set methods return new sets, don't mutate
const set1 = new Set([1, 2, 3]);
const set2 = new Set([3, 4, 5]);
set1.intersection(set2); // Returns new set, set1 remains unchanged
console.log("set1 after intersection:", [...set1]); // [1, 2, 3] unchanged

// Pitfall 2: Iterator helpers consume the iterator
const iter = [1, 2, 3].values();
const firstTwo = iter.take(2).toArray();
const remaining = iter.toArray(); // Only [3], iterator is partially consumed
console.log("\nFirst two:", firstTwo); // [1, 2]
console.log("Remaining:", remaining); // [3]

// Pitfall 3: Float16Array precision limitations
const largeFloat16 = new Float16Array([2049]);
console.log("\nFloat16 2049:", largeFloat16[0]); // 2048 (loses precision above 2048 for integers)

// Pitfall 4: RegExp.escape only escapes regex special chars, not HTML
const htmlInput = "<script>alert('xss')</script>";
const escapedRegex = RegExp.escape(htmlInput);
console.log("\nRegExp.escape for HTML:", escapedRegex); // Escapes regex chars only, not HTML
// Still need separate HTML escaping for user input in HTML context

// ============================================
// 13. Best Practices
// ============================================
console.log("\n--- 13. Best Practices ---");

console.log("✅ Use Set methods for set operations instead of manual implementation");
console.log("✅ Use iterator helpers for lazy processing of large/infinite sequences");
console.log("✅ Always use RegExp.escape() when inserting user input into regular expressions");
console.log(
  "✅ Use Promise.try() to wrap functions that may throw synchronously or return promises"
);
console.log(
  "✅ Use Float16Array for graphics/ML where memory is constrained and lower precision is acceptable"
);
console.log("✅ Use JSON modules with import attributes for type-safe JSON imports");
console.log(
  "✅ Use Intl.DurationFormat for locale-aware duration formatting instead of manual string building"
);
console.log(
  "⚠️  Remember that iterator helpers consume their source iterator, they are not reusable"
);
console.log(
  "⚠️  Set methods create new sets, chain operations when needed to avoid intermediate allocations"
);

// ============================================
// 14. Cross-references
// ============================================
console.log("\n--- 14. Cross-references ---");

console.log("📘 Set/Map: 10-map-set.js");
console.log("📘 Iterators/Generators: 22-iterators-generators.js");
console.log("📘 Regular Expressions: 21-regex.js");
console.log("📘 Promises: 30-promises.js");
console.log("📘 Typed Arrays: ../data-processing/41-typed-arrays.js");
console.log("📘 Modules: 32-modules.js");
console.log("📘 Intl API: ../data-processing/42-intl-api.js");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39-5-es2025-features-ts-comparison.ts
*/

// == verification block ==
// feature: Intl.DurationFormat
// stage4Date: 2025-07
// stage4DateType: milestone
// source: https://tc39.es/proposal-intl-duration-format
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Set methods
// stage4Date: 2024-04
// stage4DateType: exact
// source: https://github.com/tc39/proposal-set-methods
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Iterator helpers
// stage4Date: 2024-10
// stage4DateType: exact
// source: https://github.com/tc39/proposal-iterator-helpers
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: RegExp.escape
// stage4Date: 2025-02
// stage4DateType: exact
// source: https://github.com/tc39/proposal-regex-escaping
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Promise.try
// stage4Date: 2024-10
// stage4DateType: exact
// source: https://github.com/tc39/proposal-promise-try
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Float16Array
// stage4Date: 2025-02
// stage4DateType: exact
// source: https://github.com/tc39/proposal-float16array
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: JSON Modules
// stage4Date: 2024-10
// stage4DateType: exact
// source: https://github.com/tc39/proposal-json-modules
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Import Attributes
// stage4Date: 2024-10
// stage4DateType: exact
// source: https://github.com/tc39/proposal-import-attributes
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: RegExp Modifiers
// stage4Date: 2024-10
// stage4DateType: exact
// source: https://github.com/tc39/proposal-regexp-modifiers
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Duplicate Named Capture Groups
// stage4Date: 2024-04
// stage4DateType: exact
// source: https://github.com/tc39/proposal-duplicate-named-capturing-groups
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Redeclarable global eval vars
// stage4Date: 2025-02
// stage4DateType: exact
// source: https://github.com/tc39/proposal-redeclarable-global-eval-vars
// lastVerified: 2026-09-01
// == end verification block ==
