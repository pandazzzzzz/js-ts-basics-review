// Functions - Patterns Demo
// 📘 For TypeScript comparison, see: 07-3-functions-patterns-ts-comparison.ts

// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces JavaScript function patterns:
// 1. Method definitions (ES6 shorthand)
// 2. Function binding (call, apply, bind)
// 3. Function properties (name, length, prototype)
// 4. IIFE patterns and module pattern
// 5. Tail call optimization
// 6. Pure functions and functional programming

// ============================================
// Table of Contents
// ============================================

// 1. Method Definitions
// 2. Function Binding
// 3. Function Properties and Methods
// 4. IIFE Patterns and Use Cases
// 5. Tail Call Optimization (TCO)
// 6. Pure Functions and Functional Programming

// ============================================

console.log("=== Functions - Patterns Demo ===\n");

// ============================================
// 1. Method Definitions
// ============================================
/**
 * Method Definitions - ES6 shorthand syntax for object methods (ES6)
 *
 * Characteristics:
 * - More concise syntax
 * - Can use super keyword
 * - Cannot be used as constructor
 *
 * Use Cases:
 * - Object methods
 * - Class methods
 */

console.log("=== 1. Method Definitions Demo ===");

const calculator = {
  value: 0,

  // ES6 method shorthand
  add(n) {
    this.value += n;
    return this;
  },

  subtract(n) {
    this.value -= n;
    return this;
  },

  // Getter
  get result() {
    return this.value;
  },

  // Setter
  set reset(val) {
    this.value = val;
  },
};

calculator.add(10).subtract(3);
console.log("Calculator result:", calculator.result); // 7
calculator.reset = 0;
console.log("After reset:", calculator.result); // 0

// Class method definitions
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    // Method definition in class
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

const c = new Counter();
c.increment();
c.increment();
console.log("Class counter:", c.count); // 2

// ============================================
// 2. Function Binding
// ============================================
/**
 * Function Binding - Control function's 'this' value (ES5)
 *
 * Methods:
 * - call: Invoke immediately with argument list
 * - apply: Invoke immediately with argument array
 * - bind: Return new function with preset 'this' and arguments
 *
 * Use Cases:
 * - Change 'this' context
 * - Partial application (partial functions)
 * - Event handlers
 */

console.log("\n=== 2. Function Binding Demo ===");

const user = {
  name: "David",
  greet: function (greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  },
};

console.log("user.greet('Hello', '!'):", user.greet("Hello", "!")); // 'Hello, David!'

// call
console.log(
  "user.greet.call({ name: 'Eve' }, 'Hi', '.'):",
  user.greet.call({ name: "Eve" }, "Hi", ".")
); // 'Hi, Eve.'

// apply
console.log(
  "user.greet.apply({ name: 'Frank' }, ['Hey', '?']):",
  user.greet.apply({ name: "Frank" }, ["Hey", "?"])
); // 'Hey, Frank?'

// bind
const greetEve = user.greet.bind({ name: "Eve" });
console.log("greetEve('Good morning', '!'):", greetEve("Good morning", "!")); // 'Good morning, Eve!'

// Partial application
const sayHello = user.greet.bind(user, "Hello");
console.log("sayHello('!'):", sayHello("!")); // 'Hello, David!'

// ============================================
// 3. Function Properties and Methods
// ============================================
/**
 * Function Properties - Every function has built-in properties and methods
 *
 * Properties:
 * - name: Function name as string
 * - length: Number of parameters (excluding rest parameters and defaults)
 * - prototype: Object used when function is called with 'new'
 *
 * Methods:
 * - toString(): Returns function source code as string
 * - call(): Invoke with specific 'this' and arguments (covered above)
 * - apply(): Invoke with specific 'this' and array of arguments (covered above)
 * - bind(): Create new function with bound 'this' and arguments (covered above)
 */

console.log("\n=== 3. Function Properties and Methods ===");

// name property
function namedFunction() {}
const anonymousFunc = function () {};
const namedExpr = function myName() {};
const arrowFunc = () => {};

console.log("Function names:");
console.log("namedFunction.name:", namedFunction.name); // 'namedFunction'
console.log("anonymousFunc.name:", anonymousFunc.name); // 'anonymousFunc'
console.log("namedExpr.name:", namedExpr.name); // 'myName'
console.log("arrowFunc.name:", arrowFunc.name); // 'arrowFunc'

// length property - counts parameters before first default or rest
function noParams() {}
function twoParams(a, b) {}
function withDefault(a, b = 5) {}
function withRest(a, ...rest) {}
function mixed(a, b, c = 1, d) {} // Only counts a, b

console.log("\nFunction length:");
console.log("noParams.length:", noParams.length); // 0
console.log("twoParams.length:", twoParams.length); // 2
console.log("withDefault.length:", withDefault.length); // 1 (b has default)
console.log("withRest.length:", withRest.length); // 1 (rest not counted)
console.log("mixed.length:", mixed.length); // 2 (stops at first default)

// toString() method
function exampleFunc(x, y) {
  return x + y;
}

console.log("\nFunction toString:");
console.log(exampleFunc.toString());

// prototype property (only on regular functions, not arrows)
function Constructor() {}
console.log("\nFunction prototype:");
console.log("Constructor.prototype:", Constructor.prototype); // {}
console.log(
  "Constructor.prototype.constructor === Constructor:",
  Constructor.prototype.constructor === Constructor
); // true

// Arrow functions don't have prototype
const arrowConstructor = () => {};
console.log("arrowConstructor.prototype:", arrowConstructor.prototype); // undefined

// ============================================
// 4. IIFE Patterns and Use Cases
// ============================================
/**
 * IIFE (Immediately Invoked Function Expression) - Advanced patterns
 *
 * Use Cases:
 * - Module pattern for encapsulation
 * - Avoiding global namespace pollution
 * - Creating private variables
 * - Initialization code
 *
 * Patterns:
 * - Classic IIFE: (function() {})()
 * - Arrow IIFE: (() => {})()
 * - Async IIFE: (async () => {})()
 * - Named IIFE for recursion
 */

console.log("\n=== 4. IIFE Patterns ===");

// Module Pattern with IIFE
const CounterModule = (function () {
  // Private variables
  let count = 0;
  const maxCount = 100;

  // Private function
  function validateCount(value) {
    return value >= 0 && value <= maxCount;
  }

  // Public API
  return {
    increment() {
      if (count < maxCount) count++;
      return count;
    },
    decrement() {
      if (count > 0) count--;
      return count;
    },
    getCount() {
      return count;
    },
    setCount(value) {
      if (validateCount(value)) {
        count = value;
        return true;
      }
      return false;
    },
  };
})();

console.log("Module pattern:");
console.log("CounterModule.increment():", CounterModule.increment()); // 1
console.log("CounterModule.increment():", CounterModule.increment()); // 2
console.log("CounterModule.getCount():", CounterModule.getCount()); // 2
console.log("CounterModule.setCount(50):", CounterModule.setCount(50)); // true
console.log("CounterModule.getCount():", CounterModule.getCount()); // 50

// Namespace Pattern
let MyApp = {};

(function (namespace) {
  // Private utilities
  const version = "1.0.0";

  function log(message) {
    console.log(`[MyApp v${version}] ${message}`);
  }

  // Public API
  namespace.utils = {
    greet(name) {
      log(`Hello, ${name}!`);
    },
    getVersion() {
      return version;
    },
  };
})(MyApp);

console.log("\nNamespace pattern:");
MyApp.utils.greet("World");
console.log("Version:", MyApp.utils.getVersion());

// Async IIFE for top-level await alternative
(async function () {
  console.log("\nAsync IIFE executed!");
})();

// Arrow IIFE
(() => {
  const privateVar = "I'm private";
  console.log("\nArrow IIFE executed!");
})();

// ============================================
// 5. Tail Call Optimization (TCO)
// ============================================
/**
 * Tail Call Optimization - ES6 feature for optimizing recursive functions
 *
 * Characteristics:
 * - Only works in strict mode (and not all engines support it)
 * - Function call must be in tail position (last operation)
 * - Prevents stack overflow for deep recursion
 * - Limited browser support (mainly Safari)
 *
 * Tail Position:
 * - return functionCall(); ✅
 * - return functionCall() + 1; ❌ (not in tail position)
 * - return x ? functionCall() : value; ✅ (both branches in tail position)
 *
 * Common Pitfalls:
 * - Not widely supported yet
 * - Must be in strict mode
 * - Easy to accidentally break tail position
 */

console.log("\n=== 5. Tail Call Optimization ===");

// Non-tail-recursive factorial (can cause stack overflow)
function factorialNonTCO(n) {
  if (n <= 1) return 1;
  return n * factorialNonTCO(n - 1); // ❌ Not tail call (multiplication after)
}

// Tail-recursive factorial (TCO-friendly)
function factorialTCO(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTCO(n - 1, n * accumulator); // ✅ Tail call
}

console.log("factorialNonTCO(5):", factorialNonTCO(5)); // 120
console.log("factorialTCO(5):", factorialTCO(5)); // 120

// Non-tail-recursive sum
function sumToN(n) {
  if (n <= 0) return 0;
  return n + sumToN(n - 1); // ❌ Not tail call
}

// Tail-recursive sum
function sumToNTCO(n, accumulator = 0) {
  if (n <= 0) return accumulator;
  return sumToNTCO(n - 1, accumulator + n); // ✅ Tail call
}

console.log("sumToN(10):", sumToN(10)); // 55
console.log("sumToNTCO(10):", sumToNTCO(10)); // 55

// Trampoline pattern - Alternative to TCO for better compatibility
function trampoline(fn) {
  return function (...args) {
    let result = fn(...args);
    while (typeof result === "function") {
      result = result();
    }
    return result;
  };
}

// Tail-recursive function that returns thunks
function factorialTrampoline(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return () => factorialTrampoline(n - 1, n * accumulator);
}

const trampolinedFactorial = trampoline(factorialTrampoline);
console.log("trampolinedFactorial(5):", trampolinedFactorial(5)); // 120

// ============================================
// 6. Pure Functions and Functional Programming
// ============================================
/**
 * Pure Functions - Functions with no side effects
 *
 * Characteristics:
 * - Same input always produces same output (deterministic)
 * - No side effects (doesn't modify external state)
 * - Doesn't depend on external state
 * - Easier to test and reason about
 *
 * Benefits:
 * - Predictable behavior
 * - Easy to test
 * - Can be memoized
 * - Thread-safe (in multi-threaded environments)
 * - Easier to debug
 *
 * Common Pitfalls:
 * - Mutating input parameters
 * - Accessing/modifying global variables
 * - I/O operations (console.log, fetch, etc.)
 * - Random number generation
 * - Date/time operations
 */

console.log("\n=== 6. Pure Functions ===");

// Impure function - modifies external state
let total = 0;
function addToTotal(value) {
  total += value; // ❌ Side effect: modifies external variable
  return total;
}
console.log("addToTotal(5):", addToTotal(5)); // 5
console.log("addToTotal(3):", addToTotal(3)); // 8 (depends on previous calls)

// Pure function - no side effects
function pureAdd(a, b) {
  return a + b; // ✅ Pure: only depends on inputs
}
console.log("pureAdd(5, 3):", pureAdd(5, 3)); // 8 (always same for same inputs)

// Impure - mutates input
function impureAddProperty(obj) {
  obj.newProp = "value"; // ❌ Mutates input
  return obj;
}

// Pure - creates new object
function pureAddProperty(obj) {
  return { ...obj, newProp: "value" }; // ✅ Returns new object
}

const original = { name: "test" };
const modified = pureAddProperty(original);
console.log("Original unchanged:", original); // { name: 'test' }
console.log("New object:", modified); // { name: 'test', newProp: 'value' }

// Function composition with pure functions
const increment = x => x + 1;
const doubleValue = x => x * 2;
const squareValue = x => x * x;

// Compose functions right-to-left
const composeRight =
  (...fns) =>
  x =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe functions left-to-right
const pipeLeft =
  (...fns) =>
  x =>
    fns.reduce((acc, fn) => fn(acc), x);

const incrementThenDouble = composeRight(doubleValue, increment);
const incrementThenDoubleAlt = pipeLeft(increment, doubleValue);

console.log("\nFunction composition:");
console.log("compose(double, increment)(5):", incrementThenDouble(5)); // 12
console.log("pipe(increment, double)(5):", incrementThenDoubleAlt(5)); // 12

// Memoization - caching results of pure functions
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit for:", key);
      return cache.get(key);
    }
    console.log("Computing for:", key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveComputation = n => {
  let result = 0;
  for (let i = 0; i < n; i++) result += i;
  return result;
};

const memoizedCalc = memoize(expensiveComputation);

console.log("\nMemoization:");
console.log("First call:", memoizedCalc(1000)); // Computing
console.log("Second call:", memoizedCalc(1000)); // Cache hit

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Accidentally mutating arguments
console.log("\nPitfall 1 - Mutating arguments:");
const objA = { a: 1 };
const badMutate = obj => {
  obj.a = 2;
};
badMutate(objA);
console.log("Original objA mutated:", objA); // { a: 2 } ❌

const goodMutate = obj => ({ ...obj, a: 2 });
const objB = { b: 1 };
const newObj = goodMutate(objB);
console.log("Original objB unchanged:", objB); // { b: 1 } ✅
console.log("New object created:", newObj); // { b: 1, a: 2 } ✅

// Pitfall 2: Forgetting bind for event handlers (common in React)
console.log("\nPitfall 2 - Event handler context:");
const handlerObj = {
  name: "Handler",
  handle() {
    console.log("this.name:", this?.name);
  },
};
const unbound = handlerObj.handle;
unbound(); // undefined ❌
const bound = handlerObj.handle.bind(handlerObj);
bound(); // Handler ✅

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Prefer pure functions for predictable behavior");
console.log("✅ Use bind/call/apply to control 'this' when needed");
console.log("✅ Use IIFE/module pattern for encapsulation");
console.log("✅ Use method shorthand syntax for object methods");
console.log("✅ Consider trampolines for deep recursion when TCO unavailable");
console.log("✅ Compose small pure functions for complex behavior");
console.log("⚠️  Beware of arrow functions when you need dynamic 'this'");
console.log("⚠️  Don't overcomplicate with currying when simple calls suffice");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────────┬──────────────────────────────────────┐
│ Pattern         │ Use Case                             │
├─────────────────┼──────────────────────────────────────┤
│ Method Shorthand│ Object/class methods                 │
│ call()/apply()  │ Invoke function with custom 'this'   │
│ bind()          │ Create bound function with preset 'this'│
│ IIFE            │ Encapsulation, module pattern         │
│ TCO/Trampoline  │ Deep recursion without stack overflow│
│ Pure Functions  │ Predictable, testable behavior       │
└─────────────────┴──────────────────────────────────────┘
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 07-1-functions-basics.js - Function basics");
console.log("📘 07-2-functions-advanced.js - Advanced function concepts");
console.log("📘 24-function-patterns-advanced.js - Function pattern deep dive");
console.log("📘 13-scope-closures.js - Closures and scope");
console.log(
  "📘 ../06-advanced/architecture/44-design-patterns.js - Design patterns using functions"
);
console.log("📘 26-optimization-performance.js - Performance optimization");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 07-3-functions-patterns-ts-comparison.ts
*/
