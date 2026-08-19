// Functions - Advanced Demo
// 📘 For TypeScript comparison, see: 07.2-functions-advanced-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file introduces advanced JavaScript function concepts:
// 1. Higher-order functions
// 2. Closures and lexical scope
// 3. Asynchronous functions (async/await)
// 4. Generator functions
// 5. Currying basics

// ============================================
// Table of Contents
// ============================================

// 1. Higher-Order Functions
// 2. Closures
// 3. Async Functions
// 4. Generator Functions
// 5. Currying

// ============================================

console.log("=== Functions - Advanced Demo ===\n");

// ============================================
// 1. Higher-Order Functions
// ============================================
/**
 * Higher-Order Functions - Functions that accept or return functions (ES3)
 *
 * Characteristics:
 * - Functions are first-class citizens
 * - Supports functional programming paradigm
 * - Can create closures
 *
 * Use Cases:
 * - Callback functions
 * - Function composition
 * - Currying
 * - Decorator pattern
 */

console.log("=== 1. Higher-Order Functions Demo ===");

// Accept function as parameter
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, (i) => console.log(`Iteration ${i}`));

// Return function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log("double(5):", double(5)); // 10
console.log("triple(5):", triple(5)); // 15

// Function composition
const compose = (f, g) => (x) => f(g(x));
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const addOneThenDouble = compose(multiplyByTwo, addOne);
console.log("addOneThenDouble(5):", addOneThenDouble(5)); // 12

// ============================================
// 2. Closures
// ============================================
/**
 * Closures - Functions can access variables from outer scope (ES3)
 *
 * Characteristics:
 * - Inner function can access outer function's variables
 * - Variables persist even after outer function returns
 * - Can create private variables
 *
 * Use Cases:
 * - Data encapsulation and private variables
 * - Factory functions
 * - Module pattern
 *
 * Common Pitfalls:
 * - Closure trap in loops
 * - Memory leak risk
 */

console.log("\n=== 2. Closures Demo ===");

function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function() {
      return ++count;
    },
    decrement: function() {
      return --count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log("counter.increment():", counter.increment()); // 1
console.log("counter.increment():", counter.increment()); // 2
console.log("counter.getCount():", counter.getCount()); // 2
console.log("counter.decrement():", counter.decrement()); // 1

// Closure trap in loops
console.log("\nClosure trap with var:");
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log("var i:", i); // All print 3
  }, 0);
}

console.log("Fixed with let:");
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log("let j:", j); // Prints 0, 1, 2
  }, 0);
}

// Fix var issue with IIFE
console.log("Fixed with IIFE:");
for (var k = 0; k < 3; k++) {
  (function(index) {
    setTimeout(function() {
      console.log("IIFE k:", index); // Prints 0, 1, 2
    }, 0);
  })(k);
}

// ============================================
// 3. Async Functions
// ============================================
/**
 * Async Functions - Handle asynchronous operations with async/await (ES2017)
 *
 * Characteristics:
 * - async function always returns a Promise
 * - await can only be used inside async functions
 * - Makes asynchronous code look synchronous
 *
 * Use Cases:
 * - Handling Promises
 * - Sequential asynchronous operations
 * - Error handling
 *
 * Common Pitfalls:
 * - Forgetting await results in Promise instead of value
 * - Parallel operations become sequential
 * - Error handling requires try-catch
 */

console.log("\n=== 3. Async Functions Demo ===");

// Simulate async operation
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData() {
  console.log('Fetching data...');
  await delay(10);
  return { data: 'Sample data' };
}

async function processData() {
  try {
    const result = await fetchData();
    console.log('Data received:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

processData();

// Parallel execution of multiple async operations
async function fetchMultiple() {
  const [result1, result2, result3] = await Promise.all([
    delay(10).then(() => 'Data 1'),
    delay(5).then(() => 'Data 2'),
    delay(8).then(() => 'Data 3')
  ]);
  console.log('All data:', result1, result2, result3);
}

fetchMultiple();

// ============================================
// 4. Generator Functions
// ============================================
/**
 * Generator Functions - Functions that can pause and resume execution (ES6)
 *
 * Characteristics:
 * - Uses function* syntax
 * - Uses yield keyword to pause execution
 * - Returns iterator object
 * - Enables lazy evaluation
 *
 * Use Cases:
 * - Implementing iterators
 * - Lazy sequences
 * - State machines
 * - Async flow control (replaced by async/await)
 *
 * Common Pitfalls:
 * - Must call next() to execute
 * - yield can only be used inside generator functions
 */

console.log("\n=== 4. Generator Functions Demo ===");

function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log("gen.next():", gen.next()); // { value: 1, done: false }
console.log("gen.next():", gen.next()); // { value: 2, done: false }
console.log("gen.next():", gen.next()); // { value: 3, done: false }
console.log("gen.next():", gen.next()); // { value: undefined, done: true }

// Infinite sequence
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const seq = infiniteSequence();
console.log("seq.next().value:", seq.next().value); // 0
console.log("seq.next().value:", seq.next().value); // 1
console.log("seq.next().value:", seq.next().value); // 2

// Fibonacci generator
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacci();
console.log("Fibonacci:", fib.next().value); // 1
console.log("Fibonacci:", fib.next().value); // 1
console.log("Fibonacci:", fib.next().value); // 2
console.log("Fibonacci:", fib.next().value); // 3
console.log("Fibonacci:", fib.next().value); // 5

// yield* - Delegating to another generator (ES6)
function* innerGenerator() {
  yield 1;
  yield 2;
}

function* outerGenerator() {
  yield 0;
  yield* innerGenerator(); // Delegate to inner generator
  yield 3;
}

console.log("\nyield* - Generator Delegation:");
console.log("Result:", [...outerGenerator()]); // [0, 1, 2, 3]

// yield* with string (strings are iterable)
function* stringGenerator() {
  yield* 'hello';
}
console.log("yield* string:", [...stringGenerator()]); // ['h', 'e', 'l', 'l', 'o']

// yield* for tree traversal
function* treeWalk(node) {
  if (Array.isArray(node)) {
    for (const item of node) {
      yield* treeWalk(item);
    }
  } else {
    yield node;
  }
}
const nestedTree = [1, [2, [3, 4], 5], 6];
console.log("yield* tree walk:", [...treeWalk(nestedTree)]); // [1, 2, 3, 4, 5, 6]

// Async Generator Functions (ES2018)
console.log("\nAsync Generator Functions (ES2018):");

async function* asyncNumberGenerator() {
  for (let i = 1; i <= 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 5)); // Simulate async
    yield i;
  }
}

// Consuming async generator
(async () => {
  console.log('Async generator results:');
  for await (const num of asyncNumberGenerator()) {
    console.log(`  Received: ${num}`);
  }
})();

// ============================================
// 5. Currying
// ============================================
/**
 * Currying - Transform multi-parameter function into sequence of single-parameter functions
 *
 * Characteristics:
 * - Functional programming technique
 * - Parameter reuse
 * - Delayed execution
 *
 * Use Cases:
 * - Parameter reuse
 * - Function composition
 * - Configuration functions
 */

console.log("\n=== 5. Currying Demo ===");

// Manual currying
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log("curriedAdd(1)(2)(3):", curriedAdd(1)(2)(3)); // 6

// Generic curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

function sumThree(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sumThree);
console.log("curriedSum(1)(2)(3):", curriedSum(1)(2)(3)); // 6
console.log("curriedSum(1, 2)(3):", curriedSum(1, 2)(3)); // 6
console.log("curriedSum(1)(2, 3):", curriedSum(1)(2, 3)); // 6

// Practical use case - configurable API
// Reorder args so tax/discount (config) come first, price (data) last — currying pre-fills config
function calculatePrice(tax, discount, price) {
  return price * (1 + tax) * (1 - discount);
}

const calculateWithTax = curry(calculatePrice)(0.08); // 8% tax
const calculateFinal = calculateWithTax(0.10); // 10% discount
console.log("\ncalculateFinal(100):", calculateFinal(100)); // 100 * 1.08 * 0.9 = 97.2

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Forgetting await on async functions
async function badAsync() {
  const data = fetchData(); // ❌ Missing await
  console.log('Data without await:', data); // Promise { ... }
}
badAsync();

async function goodAsync() {
  const data = await fetchData(); // ✅ With await
  console.log('Data with await:', data); // { data: 'Sample data' }
}
goodAsync();

// Pitfall 2: Confusing generator.next() value vs done
console.log("\nGenerator pitfall:");
function* g() { yield 1; }
const it = g();
console.log('First next():', it.next()); // { value: 1, done: false }
console.log('Second next():', it.next()); // { value: undefined, done: true }

// Pitfall 3: Closures retaining references to loop variables (already covered earlier)

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use async/await for asynchronous code instead of raw Promises");
console.log("✅ Always handle errors with try-catch in async functions");
console.log("✅ Use closures for private state encapsulation");
console.log("✅ Use generators for lazy evaluation of sequences");
console.log("✅ Consider currying for reusable partially-applied functions");
console.log("⚠️  Avoid unnecessary currying when simple function calls suffice");
console.log("⚠️  Be mindful of memory leaks with long-lived closures");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 07.1-functions-basics.js - Function basics: declarations, expressions, parameters");
console.log("📘 07.3-functions-patterns.js - Advanced function patterns");
console.log("📘 24-function-patterns-advanced.js - Advanced patterns (currying, composition)");
console.log("📘 31-async-await.js - Async/await in depth");
console.log("📘 13-scope-closures.js - Closures and scope in depth");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 07.2-functions-advanced-ts-comparison.ts
*/