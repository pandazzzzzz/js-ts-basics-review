// Function Patterns - Advanced Demo
// 📘 For TypeScript comparison, see: 24-function-patterns-advanced-ts-comparison.ts
//
// 📌 NOTE: This file is the consolidated "all-in-one" version of Advanced Function
// Patterns. It has been split into focused sub-files for easier learning. Either
// version can be studied independently; the sub-files are the recommended path,
// and some sections here go beyond the sub-files' scope:
//   24-1-function-composition.js   → Compose/pipe, currying, partial application
//   24-2-debounce-throttle.js      → Debounce/throttle implementations and variants
//   24-3-memoization-cache.js      → Memoization, LRU cache, trampolines
// The sub-files have their own -ts-comparison.ts counterparts.
// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning Goals
// ============================================
// Master advanced function patterns in functional JavaScript:
// - Handle deep recursion safely with trampolines
// - Apply recursion patterns (linear, tail, tree, reducer)
// - Compose functions with point-free style
//
// In-depth sections live in the split files:
//   24-1-function-composition.js   → Currying, Compose/Pipe, Partial Application, Factories, Higher-Order
//   24-2-debounce-throttle.js      → Debounce & Throttle
//   24-3-memoization-cache.js      → Memoization & caching

// ============================================
// Table of Contents
// ============================================
// 1. Trampolines - Tail Recursion Optimization
// 2. Recursion Patterns
// 3. Point-Free Style
// 4. Common Pitfalls
// 5. Best Practices
// 6. Cross-references

console.log("=== Function Patterns - Advanced Demo ===\n");
console.log("📘 For Currying/Compose/Pipe → 24-1-function-composition.js");
console.log("📘 For Debounce/Throttle   → 24-2-debounce-throttle.js");
console.log("📘 For Memoization/Cache   → 24-3-memoization-cache.js");

// ============================================
// 1. TRAMPOLINES - TAIL RECURSION OPTIMIZATION
// ============================================
/**
 * Trampolines - Handling deep recursion without stack overflow (ES6)
 *
 * Characteristics:
 * - Converts recursion to iteration
 * - Enables "infinite" recursion patterns
 * - Prevents stack overflow
 * - Uses thunks (functions that return functions)
 *
 * Use Cases:
 * - Deep recursive algorithms
 * - State machines
 * - Infinite generators
 * - Tail-recursive optimization in non-TCO environments
 *
 * Common Pitfalls:
 * - More complex than simple recursion
 * - Harder to understand
 * - Performance overhead
 */

console.log("\n=== 1. Trampolines Demo ===");

// 1.1 Trampoline pattern
function trampoline(fn) {
  let result = fn();

  while (typeof result === "function") {
    result = result();
  }

  return result;
}

// 1.2 Thunk creator
function thunk(fn, ...args) {
  return () => fn(...args);
}

// 1.3 Recursive factorial with trampoline
function factorial(n, acc = 1) {
  if (n <= 1) {
    return acc;
  }
  return thunk(factorial, n - 1, n * acc);
}

console.log("Trampoline factorial:");
console.log(
  "trampoline(() => factorial(10)):",
  trampoline(() => factorial(10))
); // 3628800

// 1.4 Even/odd with mutual recursion
function even(n) {
  if (n === 0) return true;
  return thunk(odd, n - 1);
}

function odd(n) {
  if (n === 0) return false;
  return thunk(even, n - 1);
}

console.log("\nMutual recursion:");
console.log(
  "trampoline(() => even(10)):",
  trampoline(() => even(10))
); // true
console.log(
  "trampoline(() => even(9)):",
  trampoline(() => even(9))
); // false

// ============================================
// 2. RECURSION PATTERNS
// ============================================
/**
 * Recursion Patterns - Functional approaches to iterative problems (ES6)
 *
 * Characteristics:
 * - Function calls itself
 * - Base case(s) to terminate
 * - Recursive case(s) to break down problem
 * - Elegant for tree/graph traversal
 *
 * Use Cases:
 * - Tree traversals
 * - Divide and conquer algorithms
 * - Mathematical sequences
 * - Graph algorithms
 *
 * Common Pitfalls:
 * - Stack overflow on deep recursion
 * - Forgetting base cases
 * - Inefficient without memoization
 */

console.log("\n=== 2. Recursion Patterns Demo ===");

// 2.1 Linear recursion
function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}

console.log("Linear recursion:");
console.log("sumArray([1, 2, 3, 4, 5]):", sumArray([1, 2, 3, 4, 5])); // 15

// 2.2 Tail recursion
function tailSumArray(arr, index = 0, acc = 0) {
  if (index >= arr.length) return acc;
  return tailSumArray(arr, index + 1, acc + arr[index]);
}

console.log("\nTail recursion:");
console.log("tailSumArray([1, 2, 3, 4, 5]):", tailSumArray([1, 2, 3, 4, 5])); // 15

// 2.3 Tree traversal
const tree = {
  value: 1,
  left: {
    value: 2,
    left: { value: 4 },
    right: { value: 5 },
  },
  right: {
    value: 3,
    left: { value: 6 },
    right: { value: 7 },
  },
};

function traverseTree(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  traverseTree(node.left, result);
  traverseTree(node.right, result);
  return result;
}

console.log("\nTree traversal:");
console.log("traverseTree(tree):", traverseTree(tree)); // [1, 2, 4, 5, 3, 6, 7]

// 2.4 Recursive reducer
function deepReduce(obj, fn, acc) {
  acc = fn(acc, obj);

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      acc = deepReduce(obj[key], fn, acc);
    } else {
      acc = fn(acc, obj[key]); // Apply fn to leaf values
    }
  }

  return acc;
}

const nestedObject = {
  a: 1,
  b: { c: 2, d: { e: 3 } },
  f: 4,
};

const sum = deepReduce(
  nestedObject,
  (acc, val) => {
    return typeof val === "number" ? acc + val : acc;
  },
  0
);

console.log("\nRecursive reducer:");
console.log("Sum of nested values:", sum); // 10

// ============================================
// 3. POINT-FREE STYLE
// ============================================
/**
 * Point-Free Style - Omitting explicit arguments (ES6)
 *
 * Characteristics:
 * - Also called "tacit programming"
 * - Functions composed without naming arguments
 * - Relies on function composition (see 24-1)
 * - More declarative, less verbose
 *
 * Use Cases:
 * - Data transformation pipelines
 * - Functional programming
 * - Reducing boilerplate
 *
 * Common Pitfalls:
 * - Can be hard to read/debug
 * - Less flexible
 * - May confuse developers
 */

console.log("\n=== 3. Point-Free Style Demo ===");

// Pipe helper (full details in 24-1-function-composition.js)
function pipe(...fns) {
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

// 3.1 Regular style
const add1 = x => x + 1;
const multiply2 = x => x * 2;
const regularTransform = x => multiply2(add1(x));

console.log("Regular style:");
console.log("regularTransform(5):", regularTransform(5)); // 12

// 3.2 Point-free style
const pointFreeTransform = pipe(add1, multiply2);

console.log("\nPoint-free style:");
console.log("pointFreeTransform(5):", pointFreeTransform(5)); // 12

// 3.3 Practical example - array processing
const isEven = x => x % 2 === 0;
const doubleValue = x => x * 2;

const numbers = [1, 2, 3, 4, 5];
const result = numbers.filter(isEven).map(doubleValue);

console.log("\nArray processing:");
console.log("result:", result); // [4, 8]

// ============================================
// COMMON PITFALLS
// ============================================
console.log("\n=== Function Patterns Common Pitfalls Demo ===");

// Pitfall 1: Stack overflow with deep recursion
console.log("\nPitfall 1 - Deep recursion:");
console.log("❌ Bad: Unbounded recursion without tail calls");
function recursiveFactorial(n) {
  if (n <= 1) return 1;
  return n * recursiveFactorial(n - 1); // Stack grows with each call
}
// recursiveFactorial(10000); // ❌ RangeError: Maximum call stack size exceeded

console.log("✅ Good: Use trampoline for deep recursion");
function factorialWithTrampoline(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return () => factorialWithTrampoline(n - 1, n * accumulator); // Return thunk, no stack growth
}

function trampolineWrapper(fn) {
  return function (...args) {
    let result = fn(...args);
    while (typeof result === "function") {
      result = result();
    }
    return result;
  };
}

const trampolinedFactorial = trampolineWrapper(factorialWithTrampoline);
console.log(
  "Trampolined factorial(10000) works:",
  trampolinedFactorial(10000).toString().slice(0, 20) + "..."
);

// Pitfall 2: Memory leak with unclosed functions
console.log("\nPitfall 2 - Memory leaks:");
console.log("❌ Bad: Caching without eviction policy (see 24-3-memoization-cache.js for LRU)");
console.log(
  "✅ Good: Use an LRU cache with a size limit — full example in 24-3-memoization-cache.js"
);

// Pitfall 3: Incorrect debounce/throttle timing
console.log("\nPitfall 3 - Wrong timing values:");
console.log("❌ Bad: Debounce too short for API calls");
console.log("✅ Good: Choose delay based on use case — see 24-2-debounce-throttle.js");
console.log("Search: 200-500ms, Resize: 50-150ms, Scroll: 100-300ms");

// Pitfall 4: Over-composing functions
console.log("\nPitfall 4 - Over-composition:");
console.log("❌ Bad: Too many composed functions are hard to debug");
console.log(
  "✅ Good: Keep composition chains short and readable — see 24-1-function-composition.js"
);

// ============================================
// SUMMARY
// ============================================
/**
 * Function Patterns Summary
 *
 * Key Concepts:
 * 1. Currying transforms n-ary to unary functions      → 24-1
 * 2. Composition combines functions declaratively     → 24-1
 * 3. Partial application fixes some arguments         → 24-1
 * 4. Debounce/throttle control execution rate         → 24-2
 * 5. Memoization caches repeated computations         → 24-3
 * 6. Trampolines handle deep recursion                → this file
 * 7. Recursion patterns traverse trees/data           → this file
 * 8. Point-free style removes boilerplate             → this file
 *
 * When to Use:
 * - Functional programming pipelines
 * - Rate limiting events
 * - Deep recursion without stack overflow
 * - Creating configurable APIs
 *
 * When to Avoid:
 * - Simple iteration (use for/while)
 * - Performance-critical code (measure first)
 * - When readability suffers
 */

console.log("\n=== Function Patterns Advanced Demo Complete ===");

// ============================================
// 4. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

console.log("\nPitfall 1: Trampoline adds complexity");
console.log("  Trampolines are harder to read than plain recursion.");
console.log("  Fix: Only use when stack depth is a real risk.");

console.log("\nPitfall 2: Recursion without a base case");
console.log("  Missing or wrong base case causes infinite recursion / stack overflow.");
console.log("  Fix: Always define and verify the terminating condition.");

console.log("\nPitfall 3: Point-free style hurting readability");
console.log("  Over-composing hides the data flow and parameter names.");
console.log("  Fix: Prefer clarity; use point-free only where it improves intent.");

console.log("\nPitfall 4: Deep recursion in non-TCO environments");
console.log("  Most engines lack TCO, so deep recursion still overflows.");
console.log("  Fix: Use trampolines or iteration for large depths.");

// ============================================
// 5. Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Use trampolines for deep/mutual recursion");
console.log("2. Prefer tail recursion when recursion is required");
console.log("3. Use point-free style for simple, self-evident pipelines");
console.log("4. Look to 24-1/24-2/24-3 for composition, rate-limiting, and caching");

console.log("\n❌ DON'T:");
console.log("1. Don't use recursion where iteration is clearer");
console.log("2. Don't over-abstract with point-free style");
console.log("3. Don't assume TCO is available — test your target runtime");

// ============================================
// 6. Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 24-1-function-composition.js - Currying, Compose/Pipe, Factories, HOF");
console.log("📘 24-2-debounce-throttle.js - Debounce & Throttle");
console.log("📘 24-3-memoization-cache.js - Memoization & Cache");
console.log("📘 26-optimization-performance.js - Tail-call optimization, performance");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 24-function-patterns-advanced-ts-comparison.ts
*/
