// ES2022 Features Demo
// 📘 For TypeScript comparison, see: 39-2-es2022-features-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2022 features:
// 1. Class private fields (# syntax)
// 2. Class static blocks
// 3. .at() method for indexing
// 4. Object.hasOwn() as replacement for hasOwnProperty
// 5. Error.cause for chained errors
// 6. Top-level await
// 7. RegExp Match Indices (/d flag)
// 8. Ergonomic brand checks for private fields

// ============================================
// Table of Contents
// ============================================
// 1. Class Private Fields
// 2. Class Static Blocks
// 3. .at() Method (Indexing)
// 4. Object.hasOwn()
// 5. Error.cause
// 6. Top-level await
// 7. RegExp Match Indices (/d flag)
// 8. Ergonomic Brand Checks
// 9. Common Pitfalls
// 10. Best Practices
// 11. Cross-references

console.log("\n=== ES2022 Features ===\n");

// ============================================
// 1. Class Private Fields
// ============================================
console.log("\n--- 1. Class Private Fields ---\n");

// ES2022 introduces true private class fields with # syntax
class User {
  // Private field (only accessible inside the class)
  #password;

  constructor(name, password) {
    this.name = name; // Public field
    this.#password = password; // Private field
  }

  verifyPassword(input) {
    return this.#password === input;
  }
}

const user = new User("Alice", "secret123");
console.log("Public field user.name:", user.name); // "Alice"
console.log("verifyPassword('secret123'):", user.verifyPassword("secret123")); // true

// Trying to access private field from outside throws SyntaxError at parse time
// In a real environment:
// try {
//   console.log(user.#password); // ❌ SyntaxError: Private field '#password' must be declared in an enclosing class
// } catch (e) {
//   console.log("Accessing private field from outside:", e.message);
// }
console.log(
  "Note: Accessing #password from outside the class is a SyntaxError (caught at parse time)"
);

// Private fields are truly private, not just "hidden"
console.log("\nObject.keys(user):", Object.keys(user)); // ["name"] - #password not included
console.log("user.hasOwnProperty('#password'):", user.hasOwnProperty("#password")); // false

// Private methods (ES2022 also supports private methods)
class Calculator {
  #add(a, b) {
    return a + b;
  }

  sum(arr) {
    return arr.reduce((total, num) => this.#add(total, num), 0);
  }
}

const calc = new Calculator();
console.log("\nCalculator sum([1,2,3]):", calc.sum([1, 2, 3])); // 6
// calc.#add(1,2); // ❌ Private method, can't access from outside (SyntaxError)

// ============================================
// 2. Class Static Blocks
// ============================================
console.log("\n--- 2. Class Static Blocks ---\n");

// Static blocks run once when the class is first loaded
class Config {
  static apiUrl;
  static apiKey;

  // Static initialization block
  static {
    // Run complex initialization logic
    // ⚠️ Optional chaining does NOT guard an undeclared identifier: in a
    // browser `process?.env` would still throw ReferenceError. Guard with
    // typeof (or use a bundler-injected define) for cross-environment code.
    const env = (typeof process !== "undefined" && process.env?.NODE_ENV) || "development";
    if (env === "production") {
      this.apiUrl = "https://api.prod.com";
    } else {
      this.apiUrl = "http://localhost:3000";
    }
    this.apiKey = "default-key";
    console.log("Config class initialized for environment:", env);
  }
}

console.log("Config.apiUrl:", Config.apiUrl); // "http://localhost:3000" (if not in prod)
console.log("Config.apiKey:", Config.apiKey); // "default-key"

// Multiple static blocks run in order
class MultiBlock {
  static value = 0;

  static {
    this.value += 10;
  }

  static {
    this.value *= 2;
  }
}

console.log("\nMultiBlock.value:", MultiBlock.value); // 20

// ============================================
// 3. .at() Method (Indexing)
// ============================================
console.log("\n--- 3. .at() Method ---\n");

/*
 * verification:
 *   feature: at
 *   status: ES2022
 *   stage4Date: 2021-08
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2021-08/aug-31.md#relative-indexing-at-method-for-stage-4
 */

// .at() allows negative indexing for arrays, strings, and TypedArrays
const arr = [10, 20, 30, 40, 50];
console.log("Array:", arr);
console.log("arr[0]:", arr[0]); // 10
console.log("arr.at(0):", arr.at(0)); // 10
console.log("arr.at(-1):", arr.at(-1)); // 50 (last element)
console.log("arr.at(-2):", arr.at(-2)); // 40 (second last)
console.log("arr.at(5):", arr.at(5)); // undefined (out of bounds)

// 📘 Official MDN example (Array.at):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
const cart = ["apple", "banana", "pear"];
function returnLast(array) {
  return array.at(-1);
}
console.log("MDN returnLast(cart):", returnLast(cart)); // 'pear'
cart.push("orange");
console.log("MDN returnLast(cart) after push:", returnLast(cart)); // 'orange'

// Before ES2022: need to calculate length for negative indices
console.log("\nBefore at(): last element = arr[arr.length - 1]:", arr[arr.length - 1]); // 50

// Works with strings
const str = "hello world";
console.log("\nString:", str);
console.log("str.at(0):", str.at(0)); // "h"
console.log("str.at(-1):", str.at(-1)); // "d"
console.log("str.at(-3):", str.at(-3)); // "r"

// Works with TypedArrays
const uint8 = new Uint8Array([10, 20, 30]);
console.log("\nUint8Array:", uint8);
console.log("uint8.at(-1):", uint8.at(-1)); // 30

// ============================================
// 4. Object.hasOwn()
// ============================================
console.log("\n--- 4. Object.hasOwn() ---\n");

// Replacement for Object.prototype.hasOwnProperty
// Works safely even for objects that have overridden hasOwnProperty
const obj = {
  a: 1,
  hasOwnProperty: () => false, // Malicious override
};

console.log("obj.hasOwnProperty('a'):", obj.hasOwnProperty("a")); // ❌ false (incorrect due to override)
console.log("Object.hasOwn(obj, 'a'):", Object.hasOwn(obj, "a")); // ✅ true (correct)

// 📘 Official MDN example (Object.hasOwn):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
// Direct vs. inherited properties, and handling null/undefined values.
const example = {};
console.log("MDN undefined property:", Object.hasOwn(example, "prop")); // false

example.prop = "exists";
console.log("MDN defined property:", Object.hasOwn(example, "prop")); // true

example.prop = null;
console.log("MDN null value:", Object.hasOwn(example, "prop")); // true (value null still counts)

example.prop = undefined;
console.log("MDN undefined value:", Object.hasOwn(example, "prop")); // true (value undefined still counts)

// Difference from `in` operator (which checks prototype chain too):
console.log("MDN 'prop' in example:", "prop" in example); // true
console.log("MDN 'toString' in example:", "toString" in example); // true (inherited)
console.log("MDN Object.hasOwn(example, 'toString'):", Object.hasOwn(example, "toString")); // false (not own)

// Also works for objects created with `Object.create(null)`
const nullObj = Object.create(null);
nullObj.b = 2;
// nullObj.hasOwnProperty('b'); // ❌ Error: hasOwnProperty is not a function
console.log("\nObject.create(null) object:");
console.log("Object.hasOwn(nullObj, 'b'):", Object.hasOwn(nullObj, "b")); // ✅ true

// Use case: safe property checking
function hasProperty(obj, prop) {
  return Object.hasOwn(obj, prop);
}

console.log("\nhasProperty({x:1}, 'x'):", hasProperty({ x: 1 }, "x")); // true
console.log("hasProperty({x:1}, 'y'):", hasProperty({ x: 1 }, "y")); // false
console.log(
  "hasProperty(Object.create(null), 'toString'):",
  hasProperty(Object.create(null), "toString")
); // false

// ============================================
// 5. Error.cause
// ============================================
console.log("\n--- 5. Error.cause ---\n");

/*
 * verification:
 *   feature: Error.cause
 *   status: ES2022
 *   stage4Date: 2021-10
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2021-10/oct-26.md#error-cause-for-stage-4
 */

// Error.cause allows chaining errors with their original cause
function readConfig(path) {
  try {
    // Simulate fs.readFileSync error
    throw new Error(`File not found: ${path}`);
  } catch (e) {
    // Wrap error with cause
    throw new Error("Failed to load configuration", { cause: e });
  }
}

try {
  readConfig("config.json");
} catch (e) {
  console.log("Top-level error:", e.message);
  console.log("Original cause:", e.cause.message);
  console.log("\nFull error stack:");
  console.log(e.stack);
  if (e.cause) {
    console.log("\nCause stack:");
    console.log(e.cause.stack);
  }
}

// Works with all error types
class ValidationError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "ValidationError";
  }
}

try {
  try {
    throw new TypeError("Invalid type: expected string");
  } catch (e) {
    throw new ValidationError("Input validation failed", e);
  }
} catch (e) {
  console.log("\nValidation error:", e.message);
  console.log("Root cause:", e.cause.message);
  console.log("Error name:", e.name);
}

// ============================================
// 6. Top-level await
// ============================================
console.log("\n--- 6. Top-level await ---\n");

// Top-level await allows using await at the module level (no async wrapper needed)
// Note: This only works in ES modules, not in scripts

// Example (will work in module context):
// const config = await import("./config.js");
// const data = await fetch("/api/data").then(res => res.json());
// console.log("Loaded data:", data);

// Use cases:
// 1. Dynamic module loading based on runtime conditions
// 2. Loading initial data for the module
// 3. Initializing dependencies that are async

// Before ES2022: Needed to wrap in async IIFE
// (async () => {
//   const data = await fetchData();
//   console.log(data);
// })();

console.log(
  'Note: Top-level await works in ES modules only (add type="module" in script tag or use .mjs)'
);

// ============================================
// 7. RegExp Match Indices (/d flag)
// ============================================
console.log("\n--- 7. RegExp Match Indices (/d flag) ---\n");

/*
 * verification:
 *   feature: RegExp Match Indices
 *   status: ES2022
 *   stage4Date: 2021-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2021-05/may-25.md#regexp-match-indices-for-stage-4
 */

// The /d flag adds indices array to match results showing start/end positions of each capture group
const text = "Hello world! Hello JavaScript!";
const regex = /Hello (\w+)/dg; // d = indices flag, g = global

let match;
while ((match = regex.exec(text)) !== null) {
  console.log(`\nMatch: "${match[0]}"`);
  console.log("Capture group 1:", match[1]);
  console.log("Indices:", match.indices);
  console.log("Full match position: start", match.indices[0][0], "end", match.indices[0][1]);
  console.log("Group 1 position: start", match.indices[1][0], "end", match.indices[1][1]);
  console.log("Matched substring:", text.slice(match.indices[1][0], match.indices[1][1]));
}

// Output:
// Match: "Hello world"
// Capture group 1: "world"
// Indices: [ [0, 11], [6, 11] ]
// Full match position: start 0 end 11
// Group 1 position: start 6 end 11
// Matched substring: "world"

// Named capture groups also have indices in indices.groups
const namedRegex = /Hello (?<lang>\w+)/d;
const namedMatch = namedRegex.exec("Hello TypeScript");
console.log("\nNamed capture group match:");
console.log("Group 'lang':", namedMatch.groups.lang); // "TypeScript"
console.log("Group 'lang' indices:", namedMatch.indices.groups.lang); // [6, 16]

// ============================================
// 8. Ergonomic Brand Checks
// ============================================
console.log("\n--- 8. Ergonomic Brand Checks ---\n");

// Check if an object has a private field without throwing errors
class User2 {
  #id;

  constructor(id) {
    this.#id = id;
  }

  static isUser(obj) {
    // Check if obj has the #id private field
    return #id in obj;
  }
}

const alice = new User2(1);
const bob = { name: "Bob" };

console.log("User2.isUser(alice):", User2.isUser(alice)); // true
console.log("User2.isUser(bob):", User2.isUser(bob)); // false
console.log("User2.isUser({}):", User2.isUser({})); // false

// Before ES2022: Had to use try/catch inside the class
// The try/catch approach only works inside the class where #id is in scope
// For external checks, you'd need a static method on the class
console.log(
  "\nNote: Before ES2022, checking for private fields required try/catch inside the class scope"
);
console.log("Brand checks with '#id in obj' are cleaner and more reliable");

// ============================================
// 9. Common Pitfalls
// ============================================
console.log("\n--- 9. Common Pitfalls ---\n");

// Pitfall 1: Trying to use # private fields outside the class
// ❌ SyntaxError, not a runtime error (caught at parse time)
// This is a compile-time error, not a runtime try/catch scenario

// Pitfall 2: Confusing Object.hasOwn with obj.hasOwnProperty
// Always use Object.hasOwn for safety, especially with untrusted objects

// Pitfall 3: Forgetting that .at() returns undefined for out-of-bounds indices
const arr2 = [1, 2, 3];
console.log("arr2.at(10):", arr2.at(10)); // undefined, not error

// Pitfall 4: Using top-level await in non-module scripts
// Will throw "await is only valid in async functions and the top level bodies of modules"

// Pitfall 5: Private fields are not inherited
class Base {
  #privateField = 42;
}

class Derived extends Base {
  // #privateField is not accessible in Derived
  // Trying to access this.#privateField here would be a SyntaxError
}

// ============================================
// 10. Best Practices
// ============================================
console.log("\n--- 10. Best Practices ---\n");

console.log("✅ Use # private fields for true encapsulation in classes");
console.log("✅ Use Object.hasOwn() instead of obj.hasOwnProperty() for safety");
console.log("✅ Use .at() for negative indexing instead of arr[arr.length - n]");
console.log("✅ Use Error.cause to chain errors and preserve original context");
console.log("✅ Use static blocks for complex class initialization logic");
console.log("✅ Use /d flag for regex when you need match positions");
console.log("⚠️  Use top-level await sparingly at module level (can delay module loading)");
console.log("✅ Use '#field in obj' for brand checking instead of try/catch");

// ============================================
// 11. Cross-references
// ============================================
console.log("\n--- 11. Cross-references ---\n");

console.log("📘 Classes: 16-classes.js");
console.log("📘 Error handling: 20-error-handling.js");
console.log("📘 Regular Expressions: 21-regex.js");
console.log("📘 Modules: 32-modules.js");
console.log("📘 Arrays: 06-arrays.js");
console.log("📘 Strings: 04-strings.js");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39-2-es2022-features-ts-comparison.ts
*/

// == verification block ==
// feature: Class Static Block
// stage4Date: 2021-08
// stage4DateType: exact
// source: https://github.com/tc39/proposal-class-static-block
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: at
// stage4Date: 2021-08
// stage4DateType: exact
// source: https://github.com/tc39/proposal-relative-indexing-method
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Object.hasOwn
// stage4Date: 2021-08
// stage4DateType: exact
// source: https://github.com/tc39/proposal-accessible-object-hasownproperty
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Ergonomic brand checks
// stage4Date: 2021-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-private-fields-in-in
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Error.cause
// stage4Date: 2021-10
// stage4DateType: exact
// source: https://github.com/tc39/proposal-error-cause
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Top-level await
// stage4Date: 2021-05
// stage4DateType: exact
// source: https://github.com/tc39/proposal-top-level-await
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Private class fields
// stage4Date: 2021-04
// stage4DateType: exact
// source: https://github.com/tc39/proposal-class-fields
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: RegExp Match Indices
// stage4Date: 2021-05
// stage4DateType: exact
// source: https://github.com/tc39/proposal-regexp-match-indices
// lastVerified: 2026-09-01
// == end verification block ==
