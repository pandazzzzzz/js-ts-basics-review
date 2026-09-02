// Function Patterns - Composition Demo
// 📘 For TypeScript comparison, see: 24-1-function-composition-ts-comparison.ts

// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// This file covers function composition patterns:
// 1. Currying - transforming n-ary functions to unary sequence
// 2. Function composition - compose/pipe
// 3. Advanced partial application
// 4. Function factories
// 5. Higher-order function transformers

// ============================================
// Table of Contents
// ============================================

// 1. Currying - Function Transformation
// 2. Function Composition - Compose & Pipe
// 3. Advanced Partial Application
// 4. Function Factories
// 5. Higher-Order Functions - Function Transformers

// ============================================

console.log("=== Function Patterns - Composition Demo ===\n");

// ============================================
// 1. Currying - Function Transformation
// ============================================
/**
 * Currying - Transforming n-ary function into sequence of unary functions (ES6)
 *
 * Characteristics:
 * - Converts f(a, b, c) to f(a)(b)(c)
 * - Each function call returns a new function
 * - Enables partial application naturally
 * - Facilitates function composition
 *
 * Use Cases:
 * - Function composition pipelines
 * - Creating specialized functions
 * - Configurable APIs
 * - Functional programming patterns
 *
 * Common Pitfalls:
 * - Can make call stacks deeper (performance concern)
 * - Harder to debug with nested functions
 * - May confuse developers unfamiliar with pattern
 */

console.log("=== 1. Currying Demo ===");

// 1.1 Manual currying example
function addThree(a, b, c) {
  return a + b + c;
}

// Manually curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log("Manual currying:");
console.log("curriedAdd(1)(2)(3):", curriedAdd(1)(2)(3)); // 6

// 1.2 Generic curry function for n-ary functions
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...more) {
      return curried.apply(this, args.concat(more));
    };
  };
}

const curriedAdd2 = curry(addThree);
console.log("\nGeneric curry function:");
console.log("curriedAdd2(1)(2)(3):", curriedAdd2(1)(2)(3)); // 6
console.log("curriedAdd2(1, 2)(3):", curriedAdd2(1, 2)(3)); // 6

// 1.3 Practical use case - configurable API
function calculatePrice(price, tax, discount) {
  return price * (1 + tax) * (1 - discount);
}

const calculateWithTax = curry(calculatePrice)(0.08); // 8% tax
const calculateFinal = calculateWithTax(0.1); // 10% discount

console.log("\nPractical use case:");
console.log("calculateFinal(100):", calculateFinal(100)); // 100 * 1.08 * 0.9 = 97.2

// 1.4 Partial application through currying
const add5 = curriedAdd2(5);
const add5and3 = add5(3);

console.log("\nPartial application:");
console.log("add5(2)(3):", add5(2)(3)); // 10
console.log("add5and3(10):", add5and3(10)); // 18

// ============================================
// 2. Function Composition - Compose & Pipe
// ============================================
/**
 * Function Composition - Combining functions to create new functions (ES6)
 *
 * Characteristics:
 * - compose: f ∘ g → f(g(x)) - right-to-left (mathematical)
 * - pipe: f |> g → g(f(x)) - left-to-right (data flow)
 * - Output of one function becomes input to next
 * - Creates declarative, readable code
 *
 * Use Cases:
 * - Data transformation pipelines
 * - Building reusable operations
 * - Functional programming
 * - Middleware composition
 *
 * Common Pitfalls:
 * - Mismatched types between functions
 * - Harder to debug intermediate values
 * - Performance overhead from function calls
 */

console.log("\n=== 2. Function Composition Demo ===");

// 2.1 Basic functions for composition
function double(x) {
  return x * 2;
}

function square(x) {
  return x * x;
}

function increment(x) {
  return x + 1;
}

// 2.2 Compose - right to left
function compose(...fns) {
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const composed = compose(square, double, increment);
console.log("Compose (right to left):");
console.log("compose(square, double, increment)(3):", composed(3));
// 3 → increment → 4 → double → 8 → square → 64

// 2.3 Pipe - left to right
function pipe(...fns) {
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

const piped = pipe(increment, double, square);
console.log("\nPipe (left to right):");
console.log("pipe(increment, double, square)(3):", piped(3));
// 3 → increment → 4 → double → 8 → square → 64

// 2.4 Practical use case - data validation pipeline
function validateEmail(email) {
  return email.includes("@") ? { valid: true, email } : { valid: false, error: "Invalid email" };
}

function toLower(data) {
  return data.email.toLowerCase();
}

function sanitize(data) {
  return data.trim();
}

const processEmail = pipe(validateEmail, toLower, sanitize);
console.log("\nData processing pipeline:");
console.log("processEmail(' USER@EXAMPLE.COM '):", processEmail(" USER@EXAMPLE.COM "));

// 2.5 Composition with multiple arguments
function composeN(...fns) {
  return function (...args) {
    return fns.reduceRight((acc, fn) => {
      return Array.isArray(acc) ? fn(...acc) : fn(acc);
    }, args);
  };
}

function addTwo(a, b) {
  return a + b;
}

function multiplyTwo(a, b) {
  return a * b;
}

const composedMath = composeN(multiplyTwo, addTwo);
console.log("\nComposition note:");
console.log("(Multiple arg composition requires careful pipeline design)");

// ============================================
// 3. Advanced Partial Application
// ============================================
/**
 * Partial Application - Fixing some arguments of a function (ES6)
 *
 * Characteristics:
 * - Creates new function with some arguments pre-filled
 * - Different from currying (doesn't always unary)
 * - Enables function reuse with different configurations
 * - Can be left, right, or at specific positions
 *
 * Use Cases:
 * - Creating specialized functions
 * - Reducing arity of functions
 * - API configuration
 * - Event handler binding
 *
 * Common Pitfalls:
 * - Argument order matters
 * - Can lose context (this) if not careful
 * - May create unnecessary closures
 */

console.log("\n=== 3. Advanced Partial Application Demo ===");

// 3.1 Basic partial application
function bind(fn, ...fixedArgs) {
  return function (...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const greet = (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`;
const sayHello = bind(greet, "Hello");

console.log("Basic partial application:");
console.log("sayHello('World', '!'):", sayHello("World", "!")); // 'Hello, World!'

// 3.2 Partial application from right
function partialRight(fn, ...fixedArgs) {
  return function (...remainingArgs) {
    return fn(...remainingArgs, ...fixedArgs);
  };
}

const log = (level, message, timestamp) => `[${timestamp}] ${level}: ${message}`;
// partialRight pins the TRAILING argument(s): here just the timestamp.
// Pinning "ERROR" and the date together would shift them into message/level —
// middle positions need placeholders (see 3.3 below).
const logWithDate = partialRight(log, new Date().toISOString().split("T")[0]);

console.log("\nPartial application from right:");
console.log(
  "logWithDate('ERROR', 'Something went wrong'):",
  logWithDate("ERROR", "Something went wrong")
); // '[2026-09-03] ERROR: Something went wrong'

// 3.3 Partial application with placeholders
const _ = Symbol("placeholder");

function partialWithPlaceholders(fn, ...args) {
  return function (...newArgs) {
    let argIndex = 0;
    const finalArgs = args.map(arg => {
      if (arg === _) {
        return newArgs[argIndex++];
      }
      return arg;
    });
    return fn(...finalArgs, ...newArgs.slice(argIndex));
  };
}

const subtract = (a, b) => a - b;
const subtractFrom10 = partialWithPlaceholders(subtract, 10, _);

console.log("\nPartial with placeholders:");
console.log("subtractFrom10(3):", subtractFrom10(3)); // 10 - 3 = 7

// ============================================
// 4. Function Factories
// ============================================
/**
 * Function Factories - Functions that create and return new functions (ES6)
 *
 * Characteristics:
 * - Higher-order functions that generate functions
 * - Can configure behavior through closures
 * - Enable dynamic function creation
 * - Support encapsulation
 *
 * Use Cases:
 * - Creating reusable configurators
 * - Event handler generators
 * - API client builders
 * - Middleware factories
 *
 * Common Pitfalls:
 * - Memory leaks if not careful with closures
 * - Harder to debug generated functions
 * - Over-engineering simple cases
 */

console.log("\n=== 4. Function Factories Demo ===");

// 4.1 Logger factory
function createLogger(level) {
  return function (message) {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    console.log(`[${timestamp}] [${level}] ${message}`);
  };
}

const info = createLogger("INFO");
const warn = createLogger("WARN");
const error = createLogger("ERROR");

console.log("\nLogger factory:");
info("Application started");
warn("Configuration not found");
error("Failed to connect");

// 4.2 Validator factory
function createValidator(predicate, errorMessage) {
  return function (value) {
    if (predicate(value)) {
      return { valid: true, value };
    }
    return { valid: false, error: errorMessage };
  };
}

const isNotEmpty = createValidator(str => str && str.length > 0, "Value cannot be empty");

const isEmail = createValidator(str => str.includes("@"), "Invalid email format");

console.log("\nValidator factory:");
console.log("isNotEmpty('hello'):", isNotEmpty("hello"));
console.log("isNotEmpty(''):", isNotEmpty(""));
console.log("isEmail('test@example.com'):", isEmail("test@example.com"));

// 4.3 API client factory
function createAPIClient(baseURL, defaultHeaders) {
  return async function (endpoint, options = {}) {
    const url = `${baseURL}${endpoint}`;
    const headers = { ...defaultHeaders, ...options.headers };

    console.log(`Making request to: ${url}`);
    console.log("Headers:", headers);

    // Simulated fetch
    return { status: 200, data: `Response from ${url}` };
  };
}

const apiClient = createAPIClient("https://api.example.com", {
  "Content-Type": "application/json",
});

console.log("\nAPI client factory:");
apiClient("/users");

// ============================================
// 5. Higher-Order Functions - Function Transformers
// ============================================
/**
 * Higher-Order Functions - Functions that take/return functions (ES6)
 *
 * Characteristics:
 * - Accept functions as arguments
 * - Return functions as results
 * - Enable function transformation
 * - Core of functional programming
 *
 * Use Cases:
 * - Function decorators
 * - Middleware
 * - Aspect-oriented programming
 * - Data processing
 *
 * Common Pitfalls:
 * - Hard to trace execution flow
 * - Performance overhead
 * - Potential stack depth issues
 */

console.log("\n=== 5. Higher-Order Functions Demo ===");

// 5.1 Function decorators
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling ${fn.name} with args:`, args);
    const result = fn.apply(this, args);
    console.log(`${fn.name} returned:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = withLogging(add);
console.log("\nFunction decorator:");
loggedAdd(5, 3);

// 5.2 Timing decorator
function withTiming(fn) {
  return function (...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`${fn.name} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

function slowFunction() {
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }
}

console.log("\nTiming decorator:");
withTiming(slowFunction)();

// 5.3 Memoization decorator (basic)
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit for:", args);
      return cache.get(key);
    }
    console.log("Cache miss for:", args);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = memoize(fibonacci);

console.log("\nMemoization decorator:");
memoizedFibonacci(10);
memoizedFibonacci(10); // Cache hit

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Over-composing functions makes debugging hard
console.log("\nPitfall 1 - Over-composition:");
console.log("❌ Bad: Too many composed functions hard to debug");
const badTransform = pipe(
  x => x + 1,
  x => x * 2,
  x => x - 3,
  x => x / 4
);
console.log("badTransform(5):", badTransform(5));

console.log("✅ Good: Keep composition chains small and named");
const inc = x => x + 1;
const doubleV = x => x * 2;
const goodTransform = pipe(inc, doubleV);
console.log("goodTransform(5):", goodTransform(5));

// Pitfall 2: Forgetting this context in partially applied methods
console.log("\nPitfall 2 - Context loss:");
const counterObj = {
  count: 0,
  inc: function () {
    return ++this.count;
  },
};
const unboundInc = counterObj.inc;
try {
  unboundInc(); // ❌ this is global/undefined
} catch (e) {
  console.log("Unbound call failed:", e.message);
}
const boundInc = counterObj.inc.bind(counterObj);
console.log("Bound call:", boundInc()); // ✅ 1

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use currying for composition pipelines");
console.log("✅ Use pipe for left-to-right data flow (intuitive)");
console.log("✅ Use compose for mathematical-style composition");
console.log("✅ Use factories for configurable function generation");
console.log("✅ Use decorators for cross-cutting concerns (logging, timing)");
console.log("⚠️  Keep composition chains short and readable");
console.log("⚠️  Be mindful of 'this' context when partially applying methods");
console.log("⚠️  Consider performance for deeply nested currying");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 24-2-debounce-throttle.js - Debounce and throttle patterns");
console.log("📘 24-3-memoization-cache.js - Memoization and caching patterns");
console.log("📘 07-3-functions-patterns.js - Function pattern basics");
console.log("📘 13-scope-closures.js - Closures and lexical scope");
console.log("📘 ../06-advanced/architecture/44-design-patterns.js - Design patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 24-1-function-composition-ts-comparison.ts
*/
