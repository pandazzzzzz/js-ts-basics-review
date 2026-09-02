// Scope - TDZ and Strict Mode Demo
// 📘 For TypeScript comparison, see: 13-2-scope-tdz-strict-ts-comparison.ts

// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file covers advanced scope concepts:
// 1. Temporal Dead Zone (TDZ) behavior
// 2. Strict mode effects on scope
// 3. eval() and with statement (deprecated, avoid in production)
// 4. Dynamic scope implications

// ============================================
// Table of Contents
// ============================================

// 1. Temporal Dead Zone (TDZ)
// 2. Strict Mode Impact on Scope
// 3. eval() - Dynamic Code Execution (Avoid!)
// 4. with Statement - Deprecated Scope Extension (Avoid!)

// ============================================

console.log("=== Scope - TDZ and Strict Mode Demo ===\n");

// ============================================
// 1. TEMPORAL DEAD ZONE (TDZ)
// ============================================
/**
 * TDZ (Temporal Dead Zone) - Period between scope start and variable declaration
 * (introduced in ES6/ES2015)
 *
 * Characteristics:
 * - Applies to let and const (not var)
 * - Variable exists but cannot be accessed before declaration
 * - ReferenceError if accessed in TDZ
 * - Prevents use-before-declaration bugs
 * - Also applies to class declarations and default parameters
 *
 * Use Cases:
 * - Enforcing declaration-before-use
 * - Catching initialization errors early
 *
 * Common Pitfalls:
 * - Confusing with hoisting
 * - typeof doesn't work in TDZ (throws ReferenceError)
 * - Default parameters with temporal dependencies
 */

console.log("=== 1. Temporal Dead Zone (TDZ) ===");

function tdzExample() {
  // TDZ starts here for 'tdzVariable'

  try {
    console.log(tdzVariable); // ReferenceError
  } catch (error) {
    console.log("TDZ error:", error.message);
  }

  // TDZ ends here
  let tdzVariable = "Now accessible";
  console.log("After declaration:", tdzVariable); // Works
}

tdzExample();

// var does NOT have TDZ (hoisted with undefined)
function noTdzWithVar() {
  console.log("var before declaration:", varVariable); // undefined (not ReferenceError)
  var varVariable = "var is hoisted";
  console.log("var after declaration:", varVariable); // "var is hoisted"
}

noTdzWithVar();

// typeof in TDZ
function typeofTdz() {
  // console.log(typeof letVar); // ReferenceError in TDZ
  let letVar = 42;

  console.log("typeof declared variable:", typeof letVar); // "number"
  console.log("typeof undeclared:", typeof undeclaredVar); // "undefined" (no TDZ)
}

typeofTdz();

// TDZ in default parameters
function defaultParamTdz(a = b, b = 2) {
  // 'b' is in TDZ when evaluating 'a = b'
  return [a, b];
}

try {
  defaultParamTdz(); // ReferenceError: Cannot access 'b' before initialization
} catch (error) {
  console.log("Default param TDZ error:", error.message);
}

// Correct default param order
function correctDefaultParams(a = 1, b = a) {
  return [a, b];
}
console.log("Correct default params:", correctDefaultParams()); // [1, 1]

// TDZ in function default expressions
const calculate = (x = 5, y = x * 2) => x + y;
console.log("TDZ in default expressions:", calculate()); // 15

// Class declaration TDZ
function classTdz() {
  // const instance = new MyClass(); // ReferenceError
  class MyClass {
    constructor() {
      this.value = 42;
    }
  }
  const instance = new MyClass();
  console.log("Class TDZ resolved, instance.value:", instance.value);
}
classTdz();

// ============================================
// 2. STRICT MODE IMPACT ON SCOPE
// ============================================
/**
 * Strict Mode - Stricter parsing and error handling (ES5/ES2009)
 *
 * Characteristics:
 * - "use strict" must be first statement in file or function body
 * - Disallows implicit globals (assignment to undeclared variables)
 * - Disallows duplicate parameter names
 * - Disallows with statement
 * - Disallows octal literals (except in strict mode prefix 0o)
 * - Makes eval() create its own scope (doesn't affect outer)
 * - 'this' is undefined in functions, not global object
 *
 * Scope-Specific Effects:
 * - Prevents accidental global variable creation
 * - Throws on assignment to read-only properties
 * - Requires explicit declaration before use
 *
 * Use Cases:
 * - Catching common mistakes early
 * - Better optimization opportunities for engines
 *
 * Common Pitfalls:
 * - Must be first statement (top of file/function)
 * - Cannot be combined with non-strict code in same scope
 */

console.log("\n=== 2. Strict Mode Impact on Scope ===");

// Strict mode in function scope
function strictScopeDemo() {
  "use strict";

  // Implicit global throws error in strict mode
  try {
    implicitStrict = "This fails";
  } catch (error) {
    console.log("Strict mode error (implicit global):", error.message);
  }

  // Duplicate parameters throw error in strict mode (SyntaxError at parse time)
  // function duplicateParams(a, a, b) {
  //   // This line would fail at parse time in strict mode
  //   return a + b;
  // }
  // The demo above would throw: "Duplicate parameter name not allowed in this context"
  console.log("Duplicate parameters prevented in strict mode");
  console.log("(SyntaxError occurs at parse time, cannot be caught with try-catch)");
}

strictScopeDemo();

// Octal literals not allowed in strict mode
function octalStrict() {
  "use strict";

  // const x = 0123; // SyntaxError in strict mode
  const octal = 0o123; // ES6 octal literal (OK)
  console.log("ES6 octal literal 0o123 =", octal); // 83
}

octalStrict();

// Assignment to non-writable property
function nonWritable() {
  "use strict";

  const frozen = Object.freeze({ x: 1 });
  try {
    frozen.x = 2; // TypeError in strict mode
  } catch (error) {
    console.log("Strict mode catches non-writable assignment:", error.message);
  }
}

nonWritable();

// this in strict mode vs non-strict
function thisStrict() {
  "use strict";
  console.log("'this' in strict mode function:", this); // undefined
}

function thisNonStrict() {
  console.log("'this' in non-strict function:", this); // [object global] or window
}

console.log("\n'this' binding:");
thisStrict();
thisNonStrict();

// ============================================
// 3. eval() - DYNAMIC CODE EXECUTION (AVOID!)
// ============================================
/**
 * eval() - Execute arbitrary code as string (ES1)
 *
 * Why to AVOID in production:
 * - MAJOR SECURITY RISK (code injection)
 * - Prevents JIT optimization (performance degradation)
 * - Hard to debug and maintain
 * - Makes code unpredictable
 *
 * Scope Behavior:
 * - Non-strict: Can create/modify variables in calling scope
 * - Strict mode: Creates its own scope (safer)
 *
 * Safer Alternatives:
 * - Function constructor (still careful with security)
 * - JSON.parse for data parsing
 * - Computed property access
 * - Template literals
 */

console.log("\n=== 3. eval() (Avoid in Production!) ===");

// 3.1 eval() basics (DEMO ONLY - NOT FOR PRODUCTION!)
var evalX = 10;
console.log("eval('evalX + 5'):", eval("evalX + 5")); // 15

// 3.2 Security risk demonstration
console.log("\nSecurity warning:");
console.log("❌ Never eval user input!");
console.log("   Malicious example: eval('alert(\"XSS\")')");
console.log("   Or worse: eval('document.cookie = \"stolen\"')");

// 3.3 eval() scope behavior
function evalStrictScope() {
  "use strict";
  eval("var evalScoped = 42;"); // In strict mode, creates own scope
  try {
    console.log(evalScoped); // ReferenceError
  } catch (error) {
    console.log("Strict mode eval creates own scope:", error.message);
  }
}

// Note: In ES modules, all code is strict mode, so eval always creates own scope
// In non-strict mode (CommonJS without 'use strict'), eval would affect outer scope:
// eval("var evalScoped = 42;"); // Would leak evalScoped to outer scope

console.log("\neval() scope behavior:");
evalStrictScope();
console.log("Note: ES modules are always strict, so eval creates own scope");

// 3.4 Safer alternatives
console.log("\nSafer alternatives to eval:");

// Function constructor (still requires caution)
const add = new Function("a", "b", "return a + b");
console.log("Function constructor: add(2, 3) =", add(2, 3)); // 5

// JSON.parse for data
const jsonString = '{"name": "Alice", "age": 30}';
console.log("JSON.parse:", JSON.parse(jsonString));

// Computed property access
const obj = { foo: 1, bar: 2 };
const prop = "foo";
console.log("Computed property access: obj[prop] =", obj[prop]); // 1

// ============================================
// 4. with STATEMENT - DEPRECATED (AVOID!)
// ============================================
/**
 * with Statement - Extends scope chain for object (DEPRECATED, ES5+)
 *
 * Why AVOIDED:
 * - Deprecated in strict mode (SyntaxError)
 * - Performance impact (prevents optimization)
 * - Makes code unpredictable (property access ambiguous)
 * - Disallowed in ES6 strict mode
 *
 * Original Purpose:
 * - Reduce repetitive object property access
 * - Easier work with DOM in old browsers
 *
 * Better Alternatives:
 * - Destructuring assignment
 * - Variable aliasing
 * - Method chaining
 * - Template literals
 */

console.log("\n=== 4. with Statement (Deprecated, Avoid!) ===");

const user = { name: "Alice", age: 30, city: "NYC" };

// Modern alternative: destructuring
const { name: userName, age: userAge, city: userCity } = user;
console.log("Destructuring (preferred):", userName, userAge, userCity);

// with example (cannot run in strict mode/ES modules)
// (function() {
//   with (user) {
//     console.log("Inside with:", name, age, city); // Alice, 30, NYC
//   }
// })();

console.log("\nwith statement is deprecated and prohibited in strict mode");
console.log("It would throw SyntaxError in strict mode/ES modules");

// Alternative patterns without with
console.log("\nModern alternatives to with:");
console.log("1. Destructuring: const { name, age } = user");
console.log("2. Method chaining: user.getName().getAge()");
console.log("3. Template literal: `${user.name} is ${user.age}`");

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log(`
Pitfall 1: Accessing variables in TDZ
❌ console.log(myVar); let myVar = 10;  // ReferenceError
✅ console.log(myVar); // After declaration

Pitfall 2: typeof in TDZ
❌ if (typeof myVar !== 'undefined') { let myVar = 10; }  // Still throws!
✅ if (typeof myVar === 'undefined') { let myVar = 10; }  // OK

Pitfall 3: eval() security
❌ eval(userInput);  // Code injection vulnerability
✅ JSON.parse(userInput);  // Safe for data

Pitfall 4: with statement
❌ with (obj) { console.log(x); }  // Deprecated, unpredictable
✅ const { x } = obj; console.log(x);  // Clear, predictable
`);

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log(`
✅ Always use strict mode
   - Prevents accidental globals
   - Catches errors early
   - Better optimization opportunities

✅ Respect TDZ
   - Declare variables before use
   - Use let/const instead of var
   - Understand hoisting differences

✅ Avoid eval() in production
   - Use JSON.parse for data
   - Use Function constructor only when necessary
   - Never eval user input

✅ Avoid with statement (deprecated)
   - Use destructuring instead
   - Method chaining for fluent APIs
   - Template literals for string building

✅ Understand scope hierarchy
   - Global → Function → Block (inner to outer)
   - Variable lookup follows scope chain
   - Shadows outer variables when names match

✅ Use modules (ES6) instead of IIFE for scope isolation
   - Native support
   - Better tooling
   - Static analysis
`);

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌────────────────────┬─────────────┬──────────────────────┐
│ Concept            │ ES Version  │ Key Behavior         │
├────────────────────┼─────────────┼──────────────────────┤
│ TDZ                │ ES6 (2015)  │ let/const cannot     │
│                    │             │ be accessed before   │
│                    │             │ declaration          │
├────────────────────┼─────────────┼──────────────────────┤
│ Strict Mode        │ ES5 (2009)  │ Prevents implicit    │
│                    │             │ globals, better      │
│                    │             │ error detection      │
├────────────────────┼─────────────┼──────────────────────┤
│ eval()             │ ES1 (1997)  │ Executes code string │
│                    │             │ (SECURITY RISK!)     │
├────────────────────┼─────────────┼──────────────────────┤
│ with statement     │ ES1 (1997)  │ Extends scope chain  │
│                    │             │ (DEPRECATED)         │
└────────────────────┴─────────────┴──────────────────────┘

KEY INSIGHTS:
• TDZ prevents use-before-declaration bugs with let/const
• Strict mode makes code safer and more predictable
• eval() and with are deprecated or discouraged for security/performance
• Always use safer alternatives (JSON.parse, destructuring)
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 13-1-scope-basics.js - Global, function, block, lexical scope");
console.log("📘 13-3-closures-basics.js - Closures and data privacy");
console.log("📘 01-variables.js - Variable declarations and hoisting");
console.log("📘 07-1-functions-basics.js - Function parameters and scope");
console.log(
  "📘 ../06-advanced/architecture/48-security.js - Security implications of eval() and code injection"
);

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 13-2-scope-tdz-strict-ts-comparison.ts
*/
