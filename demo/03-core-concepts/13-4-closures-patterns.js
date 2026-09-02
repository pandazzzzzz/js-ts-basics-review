// Closure Patterns Demo
// 📘 For TypeScript comparison, see: 13-4-closures-patterns-ts-comparison.ts

// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// This file covers advanced closure patterns:
// 1. Function factories - creating specialized functions
// 2. Partial application - pre-filling function arguments
// 3. Memoization - caching function results
// 4. Module pattern - encapsulation with IIFE
// 5. IIFE patterns - immediate execution and initialization

// ============================================
// Table of Contents
// ============================================

// 1. Function Factories
// 2. Partial Application
// 3. Memoization
// 4. Module Pattern
// 5. IIFE (Immediately Invoked Function Expressions)

// ============================================

console.log("=== Closure Patterns Demo ===\n");

// ============================================
// 1. FUNCTION FACTORIES
// ============================================
// Function Factories - Functions that create customized functions
// via closures:
// 1. Factory takes configuration parameters
// 2. Returns inner function closing over those parameters
// 3. Result: specialized function with preset behavior
// Use Cases: specialized functions, configuration injection,
// API client creation, validator factories

console.log("=== 1. Function Factories ===");

// 1.1 Math operations factory
function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log("Math operations:");
console.log("  double(5):", double(5)); // 10
console.log("  triple(5):", triple(5)); // 15

// 1.2 String formatting factory
function createGreeter(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");
console.log("\nString formatting:");
console.log("  sayHello('Alice'):", sayHello("Alice"));
console.log("  sayHi('Bob'):", sayHi("Bob"));

// 1.3 Validation factory
function createValidator(min, max) {
  return function (value) {
    if (value < min || value > max) {
      throw new Error(`Value ${value} not in range [${min}, ${max}]`);
    }
    return true;
  };
}

const isValidAge = createValidator(0, 120);
const isValidScore = createValidator(0, 100);
console.log("\nValidation factories:");
console.log("  isValidAge(25):", isValidAge(25));
console.log("  isValidScore(85):", isValidScore(85));

// 1.4 API client factory (practical)
function createApiClient(baseUrl) {
  return function (endpoint) {
    return `${baseUrl}/${endpoint}`;
  };
}

const apiV1 = createApiClient("https://api.example.com/v1");
const apiV2 = createApiClient("https://api.example.com/v2");
console.log("\nAPI client factory:");
console.log("  v1 users:", apiV1("users"));
console.log("  v2 users:", apiV2("users"));

// 1.5 Event handler factory
function createClickHandler(buttonId) {
  return function (event) {
    console.log(`Button ${buttonId} clicked`);
    console.log("Event details:", event.type);
  };
}

const handleSave = createClickHandler("save");
const handleCancel = createClickHandler("cancel");
console.log("\nEvent handler factory created:");
console.log("  handleSave: closure with buttonId = 'save'");
console.log("  handleCancel: closure with buttonId = 'cancel'");

// ============================================
// 2. PARTIAL APPLICATION
// ============================================
// Partial Application - Pre-filling function arguments
// Creates new function with some arguments preset (reduces arity):
// - Preset args captured in closure
// - On call, combine preset + later args
// Use Cases: specialized functions, reducing repetition, composition

console.log("\n=== 2. Partial Application ===");

// 2.1 Manual partial implementation
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function add(a, b, c) {
  return a + b + c;
}

const add5 = partial(add, 5);
const add5And10 = partial(add, 5, 10);

console.log("Manual partial implementation:");
console.log("  add(1, 2, 3):):", add(1, 2, 3)); // 6
console.log("  add5(10, 15):", add5(10, 15)); // 30 (5 + 10 + 15)
console.log("  add5And10(15):", add5And10(15)); // 30 (5 + 10 + 15)

// 2.2 Practical example: logging with preset prefix
function log(level, timestamp, message) {
  console.log(`[${level}] ${timestamp}: ${message}`);
}

const errorLog = partial(log, "ERROR");
const infoLog = partial(log, "INFO");
const debugLog = partial(log, "DEBUG");

console.log("\nPartial application for logging:");
errorLog(new Date().toISOString(), "Something went wrong");
infoLog(new Date().toISOString(), "Operation completed");

// 2.3 Partial with spread for remaining args
function multiply(a, b, c, d) {
  return a * b * c * d;
}

const doubleAll = partial(multiply, 2, 1); // Preset a=2, b=1
console.log("\nPartial with multiple remaining args:");
console.log("  doubleAll(3, 4):", doubleAll(3, 4)); // 2*1*3*4 = 24

// 2.4 Placeholder partial (more flexible)
// Use a shared sentinel symbol as the placeholder
const PLACEHOLDER = Symbol("placeholder");

function partialPlaceholders(fn, ...presetArgs) {
  return function (...laterArgs) {
    const finalArgs = [];
    let laterIndex = 0;

    for (const arg of presetArgs) {
      if (arg === PLACEHOLDER) {
        finalArgs.push(laterArgs[laterIndex++]);
      } else {
        finalArgs.push(arg);
      }
    }

    return fn(...finalArgs);
  };
}

const greetWithDefaults = partialPlaceholders(
  (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`,
  "Hello",
  PLACEHOLDER,
  "!"
);

console.log("\nPartial with placeholders:");
console.log("  greetWithDefaults('World'):", greetWithDefaults("World"));

// ============================================
// 3. MEMOIZATION
// ============================================
// Memoization - Caching function results for performance:
// 1. Wrap function, create cache (object/Map) in closure
// 2. On call, return cached result if key exists; else compute + store
// Benefits: avoids recomputation, speeds recursive functions
// Trade-offs: memory grows with unique inputs; only for pure functions

console.log("\n=== 3. Memoization ===");

// 3.1 Basic memoizer implementation
function memoize(fn) {
  const cache = {}; // Private cache in closure

  return function (...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      console.log("  → Returning cached result");
      return cache[key];
    }

    console.log("  → Computing result");
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

// 3.2 Expensive fibonacci calculation
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci without memoization:");
console.log("fib(10):", fibonacci(10));

const memoizedFib = memoize(fibonacci);
console.log("\nFibonacci with memoization:");
console.log("fib(10):", memoizedFib(10)); // First call computes
console.log("fib(10) again:", memoizedFib(10)); // Returns cached

// 3.3 Memoized factorial
const factorial = memoize(function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
});

console.log("\nMemoized factorial:");
console.log("factorial(5):", factorial(5));
console.log("factorial(5) again:", factorial(5));

// 3.4 Map-based memoizer (better for object keys)
function memoizeMap(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// 3.5 Memoization with cache size limit
function memoizeWithLimit(fn, maxSize = 100) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    // Add to cache
    cache.set(key, result);

    // Remove oldest if over limit
    if (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return result;
  };
}

console.log("\nMemoization with cache limit (100 entries max):");
const limitedMemo = memoizeWithLimit(fibonacci);
console.log("limitedMemo(20):", limitedMemo(20));

// ============================================
// 4. MODULE PATTERN
// ============================================
// Module Pattern - Encapsulation using closures and IIFE (ES3):
// Creates private + public members, returns public API object
// Variants: Standard (explicit return) / Revealing (define then reveal)
// Modern Alternative: ES6 modules (import/export)

console.log("\n=== 4. Module Pattern ===");

// 4.1 Standard module pattern
const Calculator = (function () {
  // Private variables and functions
  let result = 0;

  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }

  // Public API
  return {
    add(n) {
      result += n;
      log("Added", n);
      return this;
    },

    subtract(n) {
      result -= n;
      log("Subtracted", n);
      return this;
    },

    multiply(n) {
      result *= n;
      log("Multiplied by", n);
      return this;
    },

    getResult() {
      return result;
    },

    reset() {
      result = 0;
      log("Reset", result);
      return this;
    },
  };
})();

console.log("Standard module pattern:");
Calculator.add(10).multiply(2).subtract(5);
console.log("  Result:", Calculator.getResult()); // 15
Calculator.reset();

// 4.2 Revealing module pattern
const Counter = (function () {
  // All private
  let count = 0;

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function getCount() {
    return count;
  }

  // Reveal public methods (explicit mapping)
  return {
    increment,
    decrement,
    getCount,
  };
})();

console.log("\nRevealing module pattern:");
Counter.increment();
Counter.increment();
console.log("  Counter:", Counter.getCount()); // 2

// 4.3 Module with configuration
const AppConfig = (function () {
  // Private configuration
  const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
  };

  // Private validation
  function isValid(key, value) {
    if (key === "timeout" && value < 1000) {
      throw new Error("Timeout must be at least 1000ms");
    }
    return true;
  }

  // Public API
  return {
    get(key) {
      return config[key];
    },

    set(key, value) {
      if (isValid(key, value)) {
        config[key] = value;
      }
    },

    getAll() {
      return { ...config }; // Return copy
    },
  };
})();

console.log("\nModule with configuration:");
console.log("  API URL:", AppConfig.get("apiUrl"));
console.log("  Timeout:", AppConfig.get("timeout"));

// ============================================
// 5. IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSIONS)
// ============================================
// IIFE - Functions that run immediately after definition (ES1 pattern, ES5-era staple):
// Syntax: (function(){...})(); (Classic) / (() => {...})(); (ES6 arrow)
// Creates isolated scope, prevents global pollution;
// Modern Alternative: ES6 modules/block scope { let x = ... }

console.log("\n=== 5. IIFE Patterns ===");

// 5.1 Basic IIFE syntax
console.log("Basic IIFE:");
(function () {
  const privateVar = "I'm private to this IIFE";
  console.log("  IIFE executed immediately");
  console.log("  privateVar inside IIFE:", privateVar);
})();

// 5.2 IIFE with arrow function (ES6+)
console.log("\nArrow function IIFE:");
(() => {
  const message = "Arrow function IIFE";
  console.log("  ", message);
})();

// 5.3 IIFE returning value
const result = (function () {
  const privateData = "computed value";
  return privateData.toUpperCase();
})();

console.log("\nIIFE returning value:");
console.log("  ", result); // "COMPUTED VALUE"

// 5.4 IIFE with parameters
console.log("\nIIFE with parameters:");
(function (a, b) {
  console.log("  Sum:", a + b); // 30
})(10, 20);

// 5.5 IIFE for initialization
const APP_CONFIG = (function () {
  // Private initialization logic
  const defaultTimeout = 5000;
  const apiBase = "https://api.example.com";

  // Compute configuration
  const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

  return {
    timeout: defaultTimeout,
    apiUrl: apiBase,
    isProduction: !isDev,
  };
})();

console.log("\nIIFE initialization module:");
console.log("  APP_CONFIG:", APP_CONFIG);

// 5.6 IIFE revealing module pattern
const UserModule = (function () {
  const users = [];

  function add(user) {
    users.push(user);
    console.log("User added:", user.name);
  }

  function getAll() {
    return users.slice(); // Return copy
  }

  function getCount() {
    return users.length;
  }

  // Reveal public API
  return {
    addUser: add,
    getUsers: getAll,
    userCount: getCount,
  };
})();

console.log("\nIIFE revealing module pattern:");
UserModule.addUser({ name: "Alice", id: 1 });
UserModule.addUser({ name: "Bob", id: 2 });
console.log("  Total users:", UserModule.userCount()); // 2

// 5.7 IIFE in loops (solving var closure problem)
console.log("\nIIFE solving closure in loop:");
console.log("  IIFE captures the current value at each iteration");
console.log("  Modern alternative: use let in loops");
console.log("  let creates new binding per iteration");

// Simplified example without delays:
const delayedFunctions = [];
for (var i = 0; i < 3; i++) {
  (function (index) {
    delayedFunctions.push(() => index);
  })(i);
}
console.log("delayedFunctions[0]():", delayedFunctions[0]()); // 0
console.log("delayedFunctions[1]():", delayedFunctions[1]()); // 1
console.log("delayedFunctions[2]():", delayedFunctions[2]()); // 2

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log(`
Pitfall 1: Memoization with impure functions
❌ const memoized = memoize((x) => Math.random());
✅ Use pure functions only

Pitfall 2: IIFE syntax confusion
❌ function() { ... }();  // SyntaxError
✅ (function() { ... })();  // Parentheses required
`);

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log(`
✅ Use function factories for customization
✅ Use partial application for function specialization
✅ Use memoization for expensive operations
✅ Use ES6 modules instead of module pattern
✅ Prefer let over IIFE for loop closures
`);

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────────────┬─────────────────────────────────┐
│ Pattern            │ Purpose                     │
├─────────────────────┼─────────────────────────────────┤
│ Function Factory   │ Create specialized functions    │
│ Partial Application│ Pre-fill function arguments    │
│ Memoization       │ Cache expensive computations   │
│ Module Pattern    │ Encapsulation + API exposure   │
│ IIFE             │ Immediate execution + scope  │
└─────────────────────┴─────────────────────────────────┘
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 13-1-scope-basics.js - Scope fundamentals");
console.log("📘 13-3-closures-basics.js - Closure basics and data privacy");
console.log("📘 13-5-scope-pitfalls.js - Common pitfalls and best practices");
console.log("📘 16-classes.js - ES6 classes and ES2022 # private fields");
console.log("📘 24-function-patterns-advanced.js - Advanced function patterns");
console.log("📘 32-modules.js - ES6 module system");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 13-4-closures-patterns-ts-comparison.ts
*/
