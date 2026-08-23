// Scope Basics Demo
// 📘 For TypeScript comparison, see: 13.1-scope-basics-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers the fundamental scope concepts in JavaScript:
// 1. Global scope behavior and namespace considerations
// 2. Function (local) scope characteristics
// 3. Block scope with let/const
// 4. Lexical (static) scope principles
// 5. Scope chain and variable lookup
// 6. Variable shadowing behavior

// ============================================
// Table of Contents
// ============================================

// 1. Global Scope
// 2. Function (Local) Scope
// 3. Block Scope
// 4. Lexical Scope (Static Scope)
// 5. Scope Chain
// 6. Variable Shadowing

// ============================================

console.log("=== Scope Basics Demo ===\n");

// ============================================
// 1. GLOBAL SCOPE
// ============================================
/**
 * Global Scope - Variables accessible everywhere in program (ES1)
 *
 * Characteristics:
 * - Variables declared outside any function or block
 * - Accessible from anywhere in code
 * - In browsers: attached to window object (module scope in Node.js)
 * - In Node.js: attached to global object when not in module
 * - var, let, const at top level create module-scoped variables
 *
 * Use Cases:
 * - Configuration constants
 * - Utility functions
 * - Application-wide state (use sparingly)
 *
 * Common Pitfalls:
 * - Global namespace pollution
 * - Name collisions
 * - Hard to track dependencies
 * - Memory leaks (never garbage collected)
 */

console.log("=== 1. Global Scope ===");

// Global variables
var globalVar = "I am global (var)";
let globalLet = "I am global (let)";
const globalConst = "I am global (const)";

function accessGlobal() {
  console.log(globalVar); // Accessible
  console.log(globalLet); // Accessible
  console.log(globalConst); // Accessible
}

accessGlobal();

// Implicit global (without declaration keyword) - BAD PRACTICE
// Note: ES modules enforce strict mode, so this throws ReferenceError
console.log("Implicit global creation:");
try {
  function createImplicitGlobal() {
    implicitGlobal = "I am implicitly global"; // No var/let/const
  }
  createImplicitGlobal();
  console.log("Implicit global (non-strict mode):", implicitGlobal);
} catch (error) {
  console.log("ES modules prevent implicit globals:", error.message);
}

// In non-strict mode, this would create a global. Now showing strict mode:
console.log("\nStrict mode prevents implicit globals:");
try {
  strictGlobal = "This will fail";
} catch (error) {
  console.log("Strict mode error:", error.message);
}

// ============================================
// 2. FUNCTION (LOCAL) SCOPE
// ============================================
/**
 * Function Scope (also called Local Scope) - Variables accessible only within function (ES1)
 *
 * Characteristics:
 * - Variables declared with var inside function
 * - Not accessible outside function
 * - Each function call creates new scope
 * - Inner functions can access outer function variables
 *
 * Use Cases:
 * - Encapsulation
 * - Private variables
 * - Temporary calculations
 *
 * Common Pitfalls:
 * - var is function-scoped, not block-scoped
 * - Hoisting can cause confusion
 */

console.log("\n=== 2. Function (Local) Scope ===");

function outerFunction() {
  var functionScoped = "I am function-scoped";

  if (true) {
    var alsoFunctionScoped = "var ignores blocks";
  }

  console.log(functionScoped); // Accessible
  console.log(alsoFunctionScoped); // Accessible (var is function-scoped)
}

outerFunction();

try {
  console.log(functionScoped); // ReferenceError
} catch (error) {
  console.log("Cannot access function-scoped variable:", error.message);
}

// Function scope with parameters
function greet(name) {
  // 'name' is function-scoped
  var greeting = "Hello";
  return `${greeting}, ${name}!`;
}

console.log("Greeting function:", greet("Alice"));
// console.log(name); // ReferenceError

// ============================================
// 3. BLOCK SCOPE
// ============================================
/**
 * Block Scope - Variables accessible only within block {} (ES6/ES2015)
 *
 * Characteristics:
 * - Variables declared with let or const inside {}
 * - Not accessible outside the block
 * - Includes if, for, while, switch blocks
 * - More predictable than function scope
 *
 * Use Cases:
 * - Loop variables
 * - Conditional variables
 * - Limiting variable lifetime
 *
 * Common Pitfalls:
 * - var does NOT respect block scope
 * - Temporal Dead Zone (TDZ) with let/const
 */

console.log("\n=== 3. Block Scope ===");

if (true) {
  var varVariable = "var is function-scoped";
  let letVariable = "let is block-scoped";
  const constVariable = "const is block-scoped";

  console.log("Inside block:");
  console.log("  varVariable:", varVariable); // Accessible
  console.log("  letVariable:", letVariable); // Accessible
  console.log("  constVariable:", constVariable); // Accessible
}

console.log("Outside block:");
console.log("  varVariable (accessible):", varVariable); // var ignores block

try {
  console.log(letVariable); // ReferenceError
} catch (error) {
  console.log("  let is block-scoped:", error.message);
}

try {
  console.log(constVariable); // ReferenceError
} catch (error) {
  console.log("  const is block-scoped:", error.message);
}

// Block scope in loops
console.log("\nBlock scope in loops:");
console.log("var in loop (problem - all share same variable):");
console.log("  When using var, all closures reference the same j");
console.log("  Result: All callbacks would print the final value of j (3)");

console.log("\nlet in loop (solution - each iteration has own variable):");
// Demonstrate by collecting functions
const fnsLet = [];
for (let i = 0; i < 3; i++) {
  fnsLet.push(() => i);
}
console.log("  fnsLet[0]():", fnsLet[0]()); // 0
console.log("  fnsLet[1]():", fnsLet[1]()); // 1
console.log("  fnsLet[2]():", fnsLet[2]()); // 2

// Block scope in switch
switch (true) {
  case true: {
    let caseVariable = "block-scoped in case";
    console.log("Switch case variable:", caseVariable);
    break;
  }
  default: {
    // caseVariable not accessible here
  }
}

// ============================================
// 4. LEXICAL SCOPE (STATIC SCOPE)
// ============================================
/**
 * Lexical Scope - Scope determined by code structure, not runtime (ES1)
 *
 * Characteristics:
 * - Inner functions can access outer function variables
 * - Scope determined at write-time, not call-time
 * - Forms the basis of closures
 * - Scope chain follows nesting structure
 *
 * Use Cases:
 * - Closures (see 13.3-closures-basics.js)
 * - Private variables
 * - Function factories (see 13.4-closures-patterns.js)
 *
 * Common Pitfalls:
 * - Can be confused with dynamic scope (not in JavaScript)
 * - Nested functions can shadow outer variables
 */

console.log("\n=== 4. Lexical (Static) Scope ===");

function outer() {
  const outerVar = "I am from outer";

  function inner() {
    const innerVar = "I am from inner";
    console.log("Inner can access outerVar:", outerVar);
    console.log("Inner can access innerVar:", innerVar);
  }

  inner();
  // console.log(innerVar); // ReferenceError - cannot access inner variable
}

outer();

// Lexical scope is static, not dynamic
const x = "global x";

function showX() {
  console.log("showX sees:", x); // Looks up scope chain at definition time
}

function callShowX() {
  const x = "local x";
  showX(); // Prints "global x", not "local x"
}

console.log("\nLexical scope example:");
console.log("Global x:", x);
callShowX();

// Nested lexical scopes
console.log("\nNested lexical scopes:");
function level1() {
  const a = 1;

  function level2() {
    const b = 2;

    function level3() {
      const c = 3;
      console.log("Level 3 can access:", a, b, c);
    }

    level3();
    console.log("Level 2 can access:", a, b);
    // console.log(c); // ReferenceError
  }

  level2();
  console.log("Level 1 can access:", a);
  // console.log(b); // ReferenceError
}

level1();

// ============================================
// 5. SCOPE CHAIN
// ============================================
/**
 * Scope Chain - Mechanism for variable lookup through nested scopes (ES1)
 *
 * Characteristics:
 * - JavaScript looks for variables from inner to outer scope
 * - Stops at first match
 * - Continues to global scope if not found
 * - ReferenceError if not found anywhere
 *
 * Use Cases:
 * - Understanding variable resolution
 * - Debugging scope issues
 *
 * Common Pitfalls:
 * - Performance impact with deep nesting
 * - Variable shadowing can hide outer variables
 */

console.log("\n=== 5. Scope Chain ===");

const global = "global";

function first() {
  const firstVar = "first";

  function second() {
    const secondVar = "second";

    function third() {
      const thirdVar = "third";

      // Scope chain: third -> second -> first -> global
      console.log("Scope chain lookup:");
      console.log("  thirdVar:", thirdVar); // Found in third
      console.log("  secondVar:", secondVar); // Found in second
      console.log("  firstVar:", firstVar); // Found in first
      console.log("  global:", global); // Found in global
    }

    third();
  }

  second();
}

first();

// Scope chain stops at first match (shadowing example)
console.log("\nScope chain with shadowing:");
function shadowExample() {
  const value = "outer";

  function inner() {
    const value = "inner"; // Shadows outer 'value'
    console.log("Inner sees:", value); // "inner"
  }

  inner();
  console.log("Outer sees:", value); // "outer"
}

shadowExample();

// ============================================
// 6. VARIABLE SHADOWING
// ============================================
/**
 * Variable Shadowing - Inner variable hides outer variable with same name (ES1)
 *
 * Characteristics:
 * - Inner scope variable "shadows" outer scope variable
 * - Outer variable still exists, just not accessible
 * - Can shadow at any scope level
 * - Parameters can shadow outer variables
 *
 * Use Cases:
 * - Reusing common variable names
 * - Avoiding naming conflicts
 *
 * Common Pitfalls:
 * - Can cause confusion and bugs
 * - Hard to access shadowed variable
 * - ESLint warns about shadowing
 */

console.log("\n=== 6. Variable Shadowing ===");

const name = "Global Name";

function shadowingExample() {
  const name = "Function Name"; // Shadows global 'name'

  console.log("In function:", name); // "Function Name"

  if (true) {
    const name = "Block Name"; // Shadows function 'name'
    console.log("In block:", name); // "Block Name"
  }

  console.log("After block:", name); // "Function Name"
}

shadowingExample();
console.log("In global:", name); // "Global Name"

// Parameter shadowing
const value = 100;

function useParameter(value) {
  // Parameter shadows global 'value'
  console.log("Parameter value:", value);
}

console.log("\nParameter shadowing:");
console.log("Global value:", value);
useParameter(42); // 42, not 100

// Shadowing with let in same scope is error
function noReDeclare() {
  let x = 1;
  // let x = 2; // SyntaxError: Identifier 'x' has already been declared
  console.log("x:", x);
}
noReDeclare();

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log(`
Pitfall 1: Implicit globals (non-strict mode)
❌ function foo() { x = 10; }  // Creates global x
✅ function foo() { let x = 10; }  // Properly scoped

Pitfall 2: var doesn't respect block scope
❌ for (var i = 0; i < 10; i++) { ... }
   // 'i' is accessible outside the loop!
✅ for (let i = 0; i < 10; i++) { ... }
   // 'i' is block-scoped to the loop

Pitfall 3: Variable shadowing confusion
❌ const name = "Alice";
   function greet(name) { console.log(name); }
   // Shadowed: 'name' parameter hides global
✅ function greet(personName) { console.log(personName); }
   // Use different names to avoid confusion
`);

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log(`
✅ Use 'let' and 'const' instead of 'var'
   - Block-scoped behavior is more predictable
   - Prevents hoisting confusion
   - TDZ catches use-before-declaration errors

✅ Minimize global variables
   - Prefer modules (ES6) to encapsulate code
   - Use constants instead of mutable globals
   - Avoid namespace pollution

✅ Understand the scope chain
   - Know where variables are defined
   - Variable lookup: inner → outer → global
   - Deep nesting can impact performance

✅ Be aware of variable shadowing
   - Use descriptive, unique names
   - ESLint can detect shadowing issues
   - Consider shadowing intentional when needed

✅ Use strict mode
   - Prevents accidental globals
   - Catches common mistakes early
   - Better error messages

✅ Prefer function scope for encapsulation
   - Functions create isolated scope
   - Private variables prevent external access
   - Closures enable data privacy (see 13.3)
`);

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌──────────────────┬─────────────┬──────────────┬─────────────┬──────────────┐
│ Scope Type       │ Introduced  │ Keyword      │ Accessible  │ Hoisted      │
├──────────────────┼─────────────┼──────────────┼─────────────┼──────────────┤
│ Global           │ ES1 (1997)  │ var/let/const│ Everywhere  │ var: yes     │
│                  │             │              │             │ let/const: no│
├──────────────────┼─────────────┼──────────────┼─────────────┼──────────────┤
│ Function (Local) │ ES1 (1997)  │ var          │ In function │ Yes          │
├──────────────────┼─────────────┼──────────────┼─────────────┼──────────────┤
│ Block            │ ES6 (2015)  │ let/const    │ In block {} │ No (TDZ)     │
├──────────────────┼─────────────┼──────────────┼─────────────┼──────────────┤
│ Lexical          │ ES1 (1997)  │ All          │ Nested      │ Depends      │
└──────────────────┴─────────────┴──────────────┴─────────────┴──────────────┘

KEY CONCEPTS:
• Scope Chain: Inner → Outer → Global
• Shadowing: Inner variable hides outer variable
• TDZ: Cannot access let/const before declaration (see 13.2)
• Lexical Scope: Scope determined at write-time, not call-time
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 13.2-scope-tdz-strict.js - TDZ and strict mode details");
console.log("📘 13.3-closures-basics.js - Closures and data privacy");
console.log("📘 13.4-closures-patterns.js - Function factories and advanced patterns");
console.log("📘 13.5-scope-pitfalls.js - Common pitfalls and best practices");
console.log("📘 14-this-keyword.js - this binding in different contexts");
console.log("📘 15-prototypes-inheritance.js - Prototype chain and inheritance");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 13.1-scope-basics-ts-comparison.ts
*/
