// Variables and Data Types Demo
// 📘 For TypeScript comparison, see: 01-variables-ts-comparison.ts
// 📘 javascript.info Part 1 > "JavaScript Fundamentals" (2.1-2.7)
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types

// ============================================
// Learning goals
// ============================================
// This file introduces the basic building blocks of JavaScript.
// Read the sections in order to see how variables, values, and simple syntax work together.

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

// Without strict mode, assignment to undeclared variable creates a global
// In strict mode, this would throw ReferenceError:
(function sloppyMode() {
  // accidentallyGlobal = "oops"; // ReferenceError in strict mode!
})();

// In strict mode, `this` is undefined in regular functions (not window/global)
(function strictDemo() {
  "use strict";
  try {
    // In strict mode, assigning to undeclared variable throws:
    // undeclaredVar = 5; // ReferenceError!
  } catch (e) {
    console.log("Strict mode prevents accidental globals:", e.message);
  }
})();

console.log("ES6 modules and classes are strict by default — no 'use strict' needed.");


// ============================================
// 4. Variable Declarations
// ============================================

// var - Function-scoped or globally-scoped (ES5)
// - Hoisted to the top of function/global scope
// - Can be redeclared and updated
// - No block scope (ignores if, for, while blocks)
// - Common pitfall: accessible before declaration (undefined)
var oldStyle = "var is function-scoped";

// let - Block-scoped (ES6/ES2015)
// - Only accessible within the block {...} where it's defined
// - Cannot be redeclared in the same scope
// - Temporal Dead Zone: cannot access before declaration (ReferenceError)
// - Preferred for variables that will change
let modernStyle = "let is block-scoped";

// const - Block-scoped constant (ES6/ES2015)
// - Must be initialized at declaration
// - Cannot be reassigned (but object properties can be modified)
// - Use for values that shouldn't change
// - Best practice: use const by default, let when needed
const constant = "const cannot be reassigned";

// ============================================
// 5. Primitive Data Types (7 types in ES2020+)
// ============================================

// 1. String - Text data (ES1)
// - Immutable sequence of characters
// - Can use single quotes, double quotes, or backticks
// - typeof returns "string"
const stringType = "Hello World";

// 2. Number - Numeric data (ES1)
// - 64-bit floating point (IEEE 754)
// - Range: ±(2^-1074 to 2^1024)
// - Special values: Infinity, -Infinity, NaN
// - Pitfall: 0.1 + 0.2 !== 0.3 (floating point precision)
// - typeof returns "number"
const numberType = 42;

// 3. Boolean - Logical data (ES1)
// - Only two values: true or false
// - Used in conditional statements
// - Falsy values: false, 0, "", null, undefined, NaN
// - typeof returns "boolean"
const booleanType = true;

// 4. Null - Intentional absence of value (ES1)
// - Represents "nothing" or "empty"
// - Must be assigned explicitly
// - typeof returns "object" (historical bug in JavaScript)
// - Use for: explicitly setting "no value"
const nullType = null;

// 5. Undefined - Uninitialized variable (ES1)
// - Default value for uninitialized variables
// - Function returns undefined if no return statement
// - typeof returns "undefined"
// - Difference from null: undefined = not assigned, null = intentionally empty
const undefinedType = undefined;

// 6. Symbol - Unique identifier (ES6/ES2015)
// - Always unique, even with same description
// - Used for object property keys to avoid name collisions
// - Not enumerable in for...in loops
// - typeof returns "symbol"
// - Use case: private object properties, unique constants
const symbolType = Symbol("unique");

// 7. BigInt - Large integers (ES2020)
// - Can represent integers larger than 2^53 - 1
// - Created by appending 'n' to integer or BigInt() constructor
// - Cannot mix with regular numbers in operations
// - typeof returns "bigint"
// - Use case: cryptography, precise large number calculations
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
console.log("String(42):", String(42));           // "42"
console.log("String(true):", String(true));       // "true"
console.log("String(null):", String(null));       // "null"
console.log("String(undefined):", String(undefined)); // "undefined"
console.log("(42).toString():", (42).toString()); // "42"

// Numeric conversion — Number() or unary +
console.log("\nNumeric conversion:");
console.log("Number('42'):", Number("42"));       // 42
console.log("Number('42px'):", Number("42px"));   // NaN
console.log("Number(true):", Number(true));       // 1
console.log("Number(false):", Number(false));     // 0
console.log("Number(null):", Number(null));       // 0
console.log("Number(undefined):", Number(undefined)); // NaN
console.log("+'42':", +"42");                     // 42 (unary plus shortcut)
console.log("parseInt('42px'):", parseInt("42px")); // 42 (tolerates non-numeric)
console.log("parseFloat('3.14px'):", parseFloat("3.14px")); // 3.14

// Boolean conversion — Boolean() or double negation !!
console.log("\nBoolean conversion:");
console.log("Boolean(1):", Boolean(1));           // true
console.log("Boolean(0):", Boolean(0));           // false
console.log("Boolean('hello'):", Boolean("hello")); // true
console.log("Boolean(''):", Boolean(""));         // false
console.log("Boolean(null):", Boolean(null));     // false
console.log("Boolean(undefined):", Boolean(undefined)); // false
console.log("Boolean(NaN):", Boolean(NaN));       // false
console.log("!!42:", !!42);                       // true (double negation shortcut)

// Falsy values summary: false, 0, "", null, undefined, NaN
// Everything else is truthy (including "0", "false", [], {})

// Loose equality (==) performs type coercion, strict equality (===) does not
console.log("\nEquality with coercion:");
console.log("0 == false:", 0 == false);           // true (both coerced to 0)
console.log("0 === false:", 0 === false);         // false (different types)
console.log("'' == false:", "" == false);         // true
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
// Common Pitfalls & Best Practices
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
// See TypeScript Comparison
// ============================================

/*
🔍 See 01-variables-ts-comparison.ts for:
   - Type annotations and type inference
   - strictNullChecks behavior
   - Special types: any, unknown, never
   - Type assertions and type guards
   - Literal types and type widening

📘 Key differences: TypeScript adds compile-time type checking while
   maintaining the same runtime behavior as JavaScript.
*/

