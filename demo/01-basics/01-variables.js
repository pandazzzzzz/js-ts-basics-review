// Variables and Data Types Demo
// 📘 For TypeScript comparison, see: 01-variables-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
export {};

// ============================================
// Learning Goals
// ============================================
// Master variables, data types, and type coercion:
// - Understand var/let/const scoping and hoisting differences
// - Recognize all 7 primitive types (incl. Symbol and BigInt)
// - Apply type conversion rules and coercion pitfalls
// - Use globalThis for cross-environment global access

// ============================================
// Table of Contents
// ============================================
// 1. JavaScript in HTML (JS.info 2.1)
// 2. Code Structure (JS.info 2.2)
// 3. "use strict" - Modern Mode (JS.info 2.3)
// 4. Variable Declarations
// 5. Primitive Data Types (7 types in ES2020+)
// 6. globalThis - Cross-Environment Global (ES2020)
// 7. Type Conversions (JS.info 2.7)
// 8. Browser Interaction (JS.info 2.6)
// 9. Common Pitfalls & Best Practices

// ============================================
// 1. JavaScript in HTML (JS.info 2.1)
// ============================================

// JavaScript can be included in HTML via <script> tags:
// <script src="script.js"></script>  -- External file (preferred)
// <script>console.log("inline");</script>  -- Inline code
//
// Modern script loading attributes:
// - <script defer src="...">  -- Download in parallel, execute after HTML parsed
// - <script async src="...">  -- Download in parallel, execute as soon as ready
// - <script type="module">    -- ES module, deferred by default
//
// ES6 modules (import/export) are covered in: 32-modules.js

// ============================================
// 2. Code Structure (JS.info 2.2)
// ============================================

// Statements end with semicolons (;)
// Semicolons are technically optional due to ASI (Automatic Semicolon Insertion),
// but omitting them can cause subtle bugs. Best practice: always use semicolons.

// Single-line comments use //
// Multi-line comments use /* ... */

// ============================================
// 3. "use strict" - Modern Mode (JS.info 2.3)
// ============================================

// "use strict" enables strict mode which catches common mistakes:
// - Assignment to undeclared variable → ReferenceError (instead of creating global)
// - Assigning to read-only property → TypeError
// - Deleting variables/functions → SyntaxError
// - Duplicate parameter names → SyntaxError
// - Octal numeric literals (0123) → SyntaxError
// - `this` in regular functions is `undefined` (not `window`)

// Modern JavaScript: ES6 modules and classes are strict by default.
// "use strict" can be applied file-wide or per-function:
//   "use strict";           // File-wide (must be first statement)
//   function f() { "use strict"; ... }  // Per-function

console.log("\n=== Strict Mode Demo ===");

// In strict mode, assigning to an undeclared variable throws a ReferenceError.
// Run the throwing code via Function so the surrounding file still parses.
(function strictDemo() {
  "use strict";
  try {
    new Function("undeclaredVar = 5")();
  } catch (e) {
    console.log("Strict mode prevents accidental globals:", e.name + ":", e.message);
  }
})();

// In sloppy (non-strict) mode, the same assignment silently creates a global.
(function sloppyMode() {
  console.log("Sloppy mode typeof global:", typeof globalThis.__sloppyLeak); // "undefined"
})();

console.log("ES6 modules and classes are strict by default — no 'use strict' needed.");

// ============================================
// 4. Variable Declarations
// ============================================

// var — function- or globally-scoped (ES5)
// Hoisted to the top of its scope; can be redeclared; no block scope.
var oldStyle = "var is function-scoped";

// let — block-scoped (ES2015)
// Temporal Dead Zone: cannot be accessed before declaration.
// Preferred for variables that will change.
let modernStyle = "let is block-scoped";

// const — block-scoped constant (ES2015)
// Must be initialized at declaration; cannot be reassigned
// (though object/array contents can still be modified).
// Best practice: use const by default, let only when reassignment is needed.
const constant = "const cannot be reassigned";

// ============================================
// 5. Primitive Data Types (7 types in ES2020+)
// ============================================

// 1. String — immutable text; single/double quotes or backticks.
//    typeof "hello" → "string"
const stringType = "Hello World";

// 2. Number — 64-bit float (IEEE 754); includes Infinity and NaN.
//    typeof 42 → "number"
const numberType = 42;

// 3. Boolean — true or false.
//    Falsy values: false, 0, "", null, undefined, NaN.
//    typeof true → "boolean"
const booleanType = true;

// 4. Null — intentional absence of a value.
//    typeof null === "object" (a historical bug, kept for compatibility).
const nullType = null;

// 5. Undefined — default value for uninitialized variables.
const undefinedType = undefined;

// 6. Symbol — unique identifier (ES2015); useful for non-colliding property keys.
const symbolType = Symbol("unique");

// 7. BigInt — arbitrary-precision integer (ES2020); append n or use BigInt().
const bigIntType = 9007199254740991n;

console.log("Variables Demo:");
console.log({ stringType, numberType, booleanType });
console.log({ nullType, undefinedType, symbolType, bigIntType });

// ============================================
// 6. globalThis - Cross-Environment Global (ES2020)
// ============================================

// globalThis - Standard global object reference (ES2020)
// - Points to the global object in every JavaScript environment:
//     Browser → window (or self in workers)
//     Node.js → global
//     Web Workers → self
// - Before ES2020, code had to feature-detect: window / global / self
// - Use case: writing portable code that needs the real global object
// - typeof globalThis is always "object"
console.log("\n=== globalThis (ES2020) ===");
console.log("typeof globalThis:", typeof globalThis); // "object"
console.log("globalThis === global (Node):", globalThis === global); // true in Node.js
// In a browser this would be: globalThis === window // true
// In a Web Worker: globalThis === self // true

// Portable pattern (pre-ES2020 fallback looked like this):
// const globals = (typeof window !== 'undefined') ? window
//               : (typeof global !== 'undefined') ? global : this;

// Setting a global variable through globalThis (works everywhere)
globalThis.__myTempGlobal = "set via globalThis";
console.log("__myTempGlobal:", __myTempGlobal); // "set via globalThis"

// ============================================
// 7. Type Conversions (JS.info 2.7)
// ============================================

console.log("\n=== Type Conversions ===");

// String conversion — String() or .toString()
console.log("String(42):", String(42)); // "42"
console.log("String(true):", String(true)); // "true"
console.log("String(null):", String(null)); // "null"
console.log("String(undefined):", String(undefined)); // "undefined"
console.log("(42).toString():", (42).toString()); // "42"

// Numeric conversion — Number() or unary +
console.log("\nNumeric conversion:");
console.log("Number('42'):", Number("42")); // 42
console.log("Number('42px'):", Number("42px")); // NaN
console.log("Number(true):", Number(true)); // 1
console.log("Number(false):", Number(false)); // 0
console.log("Number(null):", Number(null)); // 0
console.log("Number(undefined):", Number(undefined)); // NaN
console.log("+'42':", +"42"); // 42 (unary plus shortcut)
console.log("parseInt('42px'):", parseInt("42px")); // 42 (tolerates non-numeric)
console.log("parseFloat('3.14px'):", parseFloat("3.14px")); // 3.14

// Boolean conversion — Boolean() or double negation !!
console.log("\nBoolean conversion:");
console.log("Boolean(1):", Boolean(1)); // true
console.log("Boolean(0):", Boolean(0)); // false
console.log("Boolean('hello'):", Boolean("hello")); // true
console.log("Boolean(''):", Boolean("")); // false
console.log("Boolean(null):", Boolean(null)); // false
console.log("Boolean(undefined):", Boolean(undefined)); // false
console.log("Boolean(NaN):", Boolean(NaN)); // false
console.log("!!42:", !!42); // true (double negation shortcut)

// Falsy values summary: false, 0, "", null, undefined, NaN
// Everything else is truthy (including "0", "false", [], {})

// Loose equality (==) performs type coercion, strict equality (===) does not
console.log("\nEquality with coercion:");
console.log("0 == false:", 0 == false); // true (both coerced to 0)
console.log("0 === false:", 0 === false); // false (different types)
console.log("'' == false:", "" == false); // true
console.log("null == undefined:", null == undefined); // true (special case)
console.log("null === undefined:", null === undefined); // false

// ============================================
// 8. Browser Interaction (JS.info 2.6)
// ============================================

// alert() — shows a modal dialog with a message
// alert("Hello World!");

// prompt() — shows a modal dialog with an input field
// const name = prompt("Enter your name:", "default");
// Returns the input string, or null if cancelled

// confirm() — shows a modal dialog with OK/Cancel
// const ok = confirm("Are you sure?");
// Returns true (OK) or false (Cancel)

// Note: alert/prompt/confirm are browser-only APIs.
// They do not work in Node.js or server-side environments.
// For Node.js, use console.log() and readline module instead.

console.log("\nNote: alert/prompt/confirm are browser-only APIs.");
console.log("In Node.js, use console.log() and process.stdin for I/O.");

// ============================================
// 9. Common Pitfalls & Best Practices
// ============================================

// Pitfall 1: typeof null returns "object" (historical bug)
console.log("\nCommon Pitfalls:");
console.log("typeof null:", typeof nullType); // "object" (not "null"!)

// Pitfall 2: NaN is a number type
console.log("typeof NaN:", typeof NaN); // "number"
console.log("NaN === NaN:", NaN === NaN); // false (use Number.isNaN() instead)

// Pitfall 3: var hoisting
console.log("\nVar Hoisting:");
console.log("Before declaration:", typeof hoistedVar); // "undefined" (not error!)
var hoistedVar = "I'm hoisted";
console.log("After declaration:", hoistedVar);

// Pitfall 4: Temporal Dead Zone with let/const
// Uncommenting below will cause ReferenceError:
// console.log(temporalDeadZone); // ReferenceError!
// let temporalDeadZone = "Cannot access before initialization";

// Best Practice 1: Use const by default
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

// Best Practice 2: Use let for variables that change
let counter = 0;
counter++; // OK

// Best Practice 3: Avoid var in modern JavaScript
// Use let/const for better scoping and fewer bugs

// Best Practice 4: Check for null/undefined safely
const value = null;
console.log("\nSafe null checks:");
console.log("value == null:", value == null); // true (checks both null and undefined)
console.log("value === null:", value === null); // true (strict check)
console.log("value === undefined:", value === undefined); // false

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross References ===");
console.log("📘 02-operators.js - Operators and expressions");
console.log("📘 03-control-flow.js - Control flow and conditionals");
console.log("📘 13.1-scope-basics.js - Scope fundamentals");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 01-variables-ts-comparison.ts
*/
