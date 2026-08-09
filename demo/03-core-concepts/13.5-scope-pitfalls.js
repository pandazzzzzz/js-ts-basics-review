// Scope & Closures - Pitfalls and Best Practices Demo
// 📘 For TypeScript comparison, see: 13.5-scope-pitfalls-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers common pitfalls and best practices:
// 1. Classic scope-related mistakes
// 2. Closure-related issues
// 3. Memory management considerations
// 4. Performance optimizations
// 5. Comprehensive best practices guide

// ============================================
// Table of Contents
// ============================================

// 1. Common Pitfalls
// 2. Memory Management Issues
// 3. Performance Considerations
// 4. Best Practices
// 5. Summary Table

// ============================================

console.log("=== Scope & Closures - Pitfalls & Best Practices ===\n");

// ============================================
// 1. COMMON PITFALLS
// ============================================

console.log("=== 1. Common Pitfalls ===");

// Pitfall 1.1: Closure in loops with var (historical problem)
console.log("\nPitfall 1.1: Closure in loops with var");
console.log("Problem: All closures capture same var variable");

// Demonstrate the problem (simplified for immediate execution)
console.log("var in loop (problem):");
console.log("  When using var, all closures capture the same variable reference");
console.log("  Result: All would print final value 3");

// Solution 1: Use let (modern, recommended)
console.log("\nlet in loop (solution):");
console.log("  When using let, each iteration gets new binding");
const functionsLet = [];
for (let i = 0; i < 3; i++) {
  functionsLet.push(() => i);
}
console.log("  functionsLet[0]():", functionsLet[0]()); // 0
console.log("  functionsLet[1]():", functionsLet[1]()); // 1
console.log("  functionsLet[2]():", functionsLet[2]()); // 2

// Solution 2: Use IIFE with var (historical solution)
console.log("\nIIFE with var (historical solution):");
console.log("  IIFE captures current value at each iteration");

// Pitfall 1.2: Accidental global variables
console.log("\nPitfall 1.2: Accidental global variables");

// Note: ES modules enforce strict mode, so implicit globals throw
console.log("Note: ES modules prevent implicit globals (strict mode)");

// Fix: Always declare variables
function noAccidentalGlobal() {
  const localVariable = "Safe!"; // Properly scoped
  console.log("Local variable:", localVariable);
}
noAccidentalGlobal();

// Strict mode prevents accidental globals (already in ES modules)
console.log("Strict mode error: Assignment to undeclared variable fails in strict mode");

// Pitfall 1.3: Memory leaks with closures
console.log("\nPitfall 1.3: Memory leaks with closures");

function createLeak() {
  const largeData = new Array(1000).fill("data");

  return function() {
    // This closure keeps largeData in memory
    console.log("Large data length:", largeData.length);
  };
}

const leak = createLeak();
console.log("⚠️  'largeData' stays in memory as long as 'leak' exists");

// Solution: Only capture what you need
function noLeak() {
  const largeData = new Array(1000).fill("data");
  const length = largeData.length; // Capture only needed value

  return function() {
    console.log("Cached length:", length);
  };
}

const efficient = noLeak();
console.log("✅ Captured only length, not entire array");

// Pitfall 1.4: Modifying loop variable in closure
console.log("\nPitfall 1.4: Modifying loop variable");

const functions = [];
for (let i = 0; i < 3; i++) {
  functions.push(function() {
    return i;
  });
}

console.log("Each function has its own 'i' with let:");
console.log("  functions[0]():", functions[0]()); // 0
console.log("  functions[1]():", functions[1]()); // 1
console.log("  functions[2]():", functions[2]()); // 2

// Pitfall 1.5: Variable shadowing confusion
console.log("\nPitfall 1.5: Variable shadowing");

const globalName = "Global";

function shadowingDemo() {
  const globalName = "Function scope"; // Shadows global
  console.log("Function scope sees:", globalName);

  if (true) {
    const globalName = "Block scope"; // Shadows function
    console.log("Block scope sees:", globalName);
  }

  console.log("After block:", globalName); // Back to function scope
}
shadowingDemo();
console.log("Global still:", globalName);

// Pitfall 1.6: eval() security risk
console.log("\nPitfall 1.6: eval() security risk");

console.log("❌ Never eval user input in production!");
console.log("   Risk: Code injection, XSS attacks");
console.log("   Example: eval(userInput) could execute malicious code");

// Alternative: JSON.parse for data
const safeData = '{"name": "Alice"}';
const parsed = JSON.parse(safeData);
console.log("✅ Safe alternative: JSON.parse:", parsed);

// Pitfall 1.7: TDZ confusion
console.log("\nPitfall 1.7: Temporal Dead Zone (TDZ) confusion");

try {
  console.log(myVar); // ReferenceError (not undefined!)
  let myVar = 42;
} catch (error) {
  console.log("TDZ error:", error.message);
}

// Unlike var which hoists with undefined
console.log("var hoisting (not TDZ):", varHoisted); // undefined
var varHoisted = 10;

// ============================================
// 2. MEMORY MANAGEMENT ISSUES
// ============================================

console.log("\n=== 2. Memory Management Issues ===");

// Issue 2.1: Long-lived closures
console.log("\nIssue 2.1: Long-lived closures keep references alive");

function createLongLivedClosure() {
  const data = { important: "data" };
  const events = [];

  return {
    addEventListener(handler) {
      events.push(handler); // Handler may capture 'data'
    },
    trigger() {
      events.forEach(handler => handler(data));
    }
  };
}

const longLived = createLongLivedClosure();
console.log("⚠️  Event handlers can prevent garbage collection of 'data'");

// Solution: Remove listeners when done
function createCleanClosure() {
  const data = { important: "data" };
  const handlers = [];

  return {
    addHandler(handler) {
      handlers.push(handler);
      // Return unsubscribe function
      return function removeHandler() {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      };
    },
    trigger() {
      handlers.forEach(handler => handler(data));
    }
  };
}

const cleanClosure = createCleanClosure();
const unsubscribe = cleanClosure.addHandler(() => console.log("Handler called"));
console.log("✅ Provide unsubscribe function to release references");

// Issue 2.2: Circular references in closures
console.log("\nIssue 2.2: Circular references");

function createCircularReference() {
  const objA = {};
  const objB = {};

  objA.ref = objB;
  objB.ref = objA; // Circular reference

  return function() {
    return objA;
  };
}

const circularClosure = createCircularReference();
console.log("⚠️  Circular references can complicate garbage collection");
console.log("   (Modern GC handles this, but can cause issues in older engines)");

// ============================================
// 3. PERFORMANCE CONSIDERATIONS
// ============================================

console.log("\n=== 3. Performance Considerations ===");

// Consideration 3.1: Scope chain depth impacts performance
console.log("\nConsideration 3.1: Deep nesting affects performance");

function level1() {
  const a = 1;

  function level2() {
    const b = 2;

    function level3() {
      const c = 3;

      function level4() {
        const d = 4;

        function level5() {
          const e = 5;

          // Deep scope chain lookup
          return a + b + c + d + e;
        }
        return level5();
      }
      return level4();
    }
    return level3();
  }
  return level2();
}

console.log("Deep nesting result:", level1());
console.log("⚠️  Deep nesting has lookup cost (though modern engines optimize)");

// Consideration 3.2: Closure creation overhead
console.log("\nConsideration 3.2: Closure creation has runtime cost");

function withoutClosure(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function withClosure(arr) {
  return arr.reduce((sum, n) => sum + n, 0);
}

const largeArray = Array.from({ length: 1000 }, (_, i) => i);
console.time("Without closure");
withoutClosure(largeArray);
console.timeEnd("Without closure");

console.time("With closure (reduce)");
withClosure(largeArray);
console.timeEnd("With closure (reduce)");

console.log("✅ Closures have overhead but usually negligible");

// Consideration 3.3: Memoization memory vs speed trade-off
console.log("\nConsideration 3.3: Memoization - memory vs speed");

function memoize(fn) {
  const cache = {};

  return function(...args) {
    const key = JSON.stringify(args);
    return cache[key] || (cache[key] = fn(...args));
  };
}

const expensive = (n) => {
  // Simulate expensive computation
  for (let i = 0; i < 10000; i++) { }
  return n * n;
};

const memoized = memoize(expensive);

console.time("First call (computes)");
memoized(42);
console.timeEnd("First call (computes)");

console.time("Second call (cached)");
memoized(42);
console.timeEnd("Second call (cached)");

console.log("⚠️  Memoization trades memory for speed");
console.log("   Cache grows with unique inputs");

// Consideration 3.4: JIT optimization vs eval
console.log("\nConsideration 3.4: eval() prevents optimization");

function optimizedAdd(a, b) {
  return a + b; // Can be JIT optimized
}

function unoptimizedAdd(a, b) {
  return eval(a + b); // Cannot be optimized
}

console.log("✅ eval() prevents JIT optimization");
console.log("   Use only when absolutely necessary");

// ============================================
// 4. BEST PRACTICES
// ============================================

console.log("\n=== 4. Best Practices ===");

console.log(`
┌─────────────────────────────────────────────────────────────────┐
│                     SCOPE BEST PRACTICES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 1. USE let AND const INSTEAD OF var                              │
│    ✅ let and const are block-scoped                             │
│    ✅ Prevents hoisting confusion                                │
│    ✅ Prevents accidental globals                                │
│    ✅ TDZ catches use-before-declaration                         │
│                                                                  │
│ 2. MINIMIZE GLOBAL VARIABLES                                     │
│    ✅ Use modules (ES6) or IIFE                                  │
│    ✅ Prevents naming conflicts                                  │
│    ✅ Easier to maintain and test                                │
│    ✅ Better for tree-shaking in bundlers                        │
│                                                                  │
│ 3. USE STRICT MODE                                               │
│    ✅ Prevents accidental globals                                │
│    ✅ Catches common mistakes early                              │
│    ✅ Better error messages                                      │
│    ✅ Enables optimizations                                      │
│                                                                  │
│ 4. AVOID DEEP NESTING                                            │
│    ✅ Harder to understand                                       │
│    ✅ Performance impact (scope chain depth)                     │
│    ✅ Refactor into smaller functions                            │
│    ✅ Use early returns                                          │
│                                                                  │
│ 5. USE DESCRIPTIVE VARIABLE NAMES                                 │
│    ✅ Avoid shadowing when possible                               │
│    ✅ Makes code more readable                                   │
│    ✅ Easier to debug                                            │
│    ✅ Reduces accidental shadowing                               │
│                                                                  │
│ 6. UNDERSTAND THE SCOPE CHAIN                                    │
│    ✅ Know where variables are defined                           │
│    ✅ Understand variable lookup order                           │
│    ✅ Avoid unintended shadowing                                 │
│    ✅ Debug scope issues with browser dev tools                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   CLOSURE BEST PRACTICES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 1. USE CLOSURES FOR ENCAPSULATION                               │
│    ✅ Create private variables (pre-ES2022 #)                     │
│    ✅ Expose only necessary API                                  │
│    ✅ Better code organization                                   │
│                                                                  │
│ 2. BE AWARE OF MEMORY IMPLICATIONS                               │
│    ✅ Closures keep variables in memory                          │
│    ✅ Only close over what you need                              │
│    ✅ Consider memory usage in long-lived applications           │
│                                                                  │
│ 3. PREFER let IN LOOPS                                           │
│    ✅ Each iteration gets own binding                            │
│    ✅ Avoids historical var closure problems                     │
│    ✅ More predictable behavior                                  │
│    ✅ Modern, cleaner syntax                                     │
│                                                                  │
│ 4. USE MEMOIZATION JUDICIOUSLY                                   │
│    ✅ Cache only expensive computations                          │
│    ✅ Implement cache size limits                                │
│    ✅ Only for pure functions                                    │
│    ✅ Clear cache when data changes                              │
│                                                                  │
│ 5. PROVIDE CLEANUP MECHANISMS                                    │
│    ✅ Return unsubscribe functions for listeners                │
│    ✅ Release references when done                               │
│    ✅ Avoid circular references                                  │
│    ✅ Help garbage collector                                     │
│                                                                  │
│ 6. DOCUMENT CLOSURE BEHAVIOR                                     │
│    ✅ Explain what is captured                                   │
│    ✅ Note memory implications                                  │
│    ✅ Help maintainers understand lifetime                       │
│    ✅ Document expected lifetime                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                MODERN PRACTICE ALTERNATIVES                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 1. PREFER ES6 MODULES OVER MODULE PATTERN + IIFE                 │
│    ✅ Native language support                                    │
│    ✅ Better tooling (tree-shaking, bundling)                    │
│    ✅ Static analysis                                            │
│    ✅ Standard across ecosystems                                 │
│                                                                  │
│ 2. USE ES2022 # PRIVATE FIELDS WHEN POSSIBLE                     │
│    ✅ Runtime privacy (not just compile-time)                    │
│    ✅ Cleaner syntax than closures                               │
│    ✅ Better IDE support                                         │
│    ✅ Explicit privacy marker                                    │
│                                                                  │
│ 3. USE BLOCK SCOPE { } INSTEAD OF IIFE                          │
│    ✅ Simpler syntax                                             │
│    ✅ Same isolation effect                                      │
│    ✅ More readable                                              │
│                                                                  │
│ 4. USE箭头函数 FOR SIMPLE CLOSURES                               │
│    ✅ Concise syntax                                             │
│    ✅ Lexical this binding                                       │
│    ✅ No arguments object (less confusion)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
`);

// ============================================
// 5. SUMMARY TABLE
// ============================================

console.log("=== 5. Scope Types Comparison ===");
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
• TDZ: Cannot access let/const before declaration
• Closure: Function + its lexical environment
• Hoisting: var declarations moved to top (not initialization)

CLOSURE USE CASES:
• Data Privacy: Hide implementation details
• Function Factories: Create customized functions
• Partial Application: Pre-fill function arguments
• Memoization: Cache expensive computations
• Module Pattern: Organize and encapsulate code

PERFORMANCE CONSIDERATIONS:
• Deep nesting increases scope chain lookup cost
• Closures have creation overhead (usually negligible)
• Memoization trades memory for speed
• eval() prevents JIT optimization
• Long-lived closures prevent GC

MODERN ALTERNATIVES:
• ES6 modules replace module pattern + IIFE
• ES2022 # fields replace closure-based privacy
• Block scope { } replaces IIFE for simple cases
• let/const preferred over var for all scenarios
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 13.1-scope-basics.js - Scope fundamentals");
console.log("📘 13.2-scope-tdz-strict.js - TDZ and strict mode");
console.log("📘 13.3-closures-basics.js - Closure basics");
console.log("📘 13.4-closures-patterns.js - Closure patterns");
console.log("📘 27-memory-management.js - Memory management and garbage collection");
console.log("📘 26-optimization-performance.js - Performance optimization");
console.log("📘 48-security.js - Security best practices");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 13.5-scope-pitfalls-ts-comparison.ts
*/