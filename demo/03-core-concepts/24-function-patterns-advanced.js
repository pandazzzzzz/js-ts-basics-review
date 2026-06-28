// ============================================================================
// FUNCTION PATTERNS - ADVANCED COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. CURRYING - FUNCTION TRANSFORMATION
// ============================================================================
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
  return function(b) {
    return function(c) {
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
    return function(...more) {
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
const calculateFinal = calculateWithTax(0.10); // 10% discount

console.log("\nPractical use case:");
console.log("calculateFinal(100):", calculateFinal(100)); // 100 * 1.08 * 0.9 = 97.2

// 1.4 Partial application through currying
const add5 = curriedAdd2(5);
const add5and3 = add5(3);

console.log("\nPartial application:");
console.log("add5(2)(3):", add5(2)(3)); // 10
console.log("add5and3(10):", add5and3(10)); // 18


// ============================================================================
// 2. FUNCTION COMPOSITION - COMPOSE & PIPE
// ============================================================================
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
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const composed = compose(square, double, increment);
console.log("Compose (right to left):");
console.log("compose(square, double, increment)(3):", composed(3));
// 3 → increment → 4 → double → 8 → square → 64

// 2.3 Pipe - left to right
function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

const piped = pipe(increment, double, square);
console.log("\nPipe (left to right):");
console.log("pipe(increment, double, square)(3):", piped(3));
// 3 → increment → 4 → double → 8 → square → 64

// 2.4 Practical use case - data validation pipeline
function validateEmail(email) {
  return email.includes('@') ? { valid: true, email } : { valid: false, error: 'Invalid email' };
}

function toLower(data) {
  return data.email.toLowerCase();
}

function sanitize(data) {
  return data.trim();
}

const processEmail = pipe(validateEmail, toLower, sanitize);
console.log("\nData processing pipeline:");
console.log("processEmail(' USER@EXAMPLE.COM '):", processEmail(' USER@EXAMPLE.COM '));

// 2.5 Composition with multiple arguments
function composeN(...fns) {
  return function(...args) {
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
console.log("\nComposition with multiple args:");
console.log("composedMath(2, 3):", composedMath(2, 3)); // NaN — addTwo(2,3)=5, then multiplyTwo(5)=NaN (missing 2nd arg)


// ============================================================================
// 3. ADVANCED PARTIAL APPLICATION
// ============================================================================
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
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const greet = (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`;
const sayHello = bind(greet, 'Hello');

console.log("Basic partial application:");
console.log("sayHello('World', '!'):", sayHello('World', '!')); // "Hello, World!"

// 3.2 Partial application from right
function partialRight(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...remainingArgs, ...fixedArgs);
  };
}

const log = (level, message, timestamp) => `[${timestamp}] ${level}: ${message}`;
const logError = partialRight(log, 'ERROR', new Date().toISOString());

console.log("\nPartial application from right:");
console.log("logError('Something went wrong'):", logError('Something went wrong'));

// 3.3 Partial application with placeholders
const _ = Symbol('placeholder');

function partialWithPlaceholders(fn, ...args) {
  return function(...newArgs) {
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


// ============================================================================
// 4. FUNCTION FACTORIES
// ============================================================================
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
  return function(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  };
}

const info = createLogger('INFO');
const warn = createLogger('WARN');
const error = createLogger('ERROR');

console.log("\nLogger factory:");
info("Application started");
warn("Configuration not found");
error("Failed to connect");

// 4.2 Validator factory
function createValidator(predicate, errorMessage) {
  return function(value) {
    if (predicate(value)) {
      return { valid: true, value };
    }
    return { valid: false, error: errorMessage };
  };
}

const isNotEmpty = createValidator(
  (str) => str && str.length > 0,
  'Value cannot be empty'
);

const isEmail = createValidator(
  (str) => str.includes('@'),
  'Invalid email format'
);

console.log("\nValidator factory:");
console.log("isNotEmpty('hello'):", isNotEmpty('hello'));
console.log("isNotEmpty(''):", isNotEmpty(''));
console.log("isEmail('test@example.com'):", isEmail('test@example.com'));

// 4.3 API client factory
function createAPIClient(baseURL, defaultHeaders) {
  return async function(endpoint, options = {}) {
    const url = `${baseURL}${endpoint}`;
    const headers = { ...defaultHeaders, ...options.headers };

    console.log(`Making request to: ${url}`);
    console.log('Headers:', headers);

    // Simulated fetch
    return { status: 200, data: `Response from ${url}` };
  };
}

const apiClient = createAPIClient(
  'https://api.example.com',
  { 'Content-Type': 'application/json' }
);

console.log("\nAPI client factory:");
apiClient('/users');


// ============================================================================
// 5. HIGHER-ORDER FUNCTIONS - FUNCTION TRANSFORMERS
// ============================================================================
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
  return function(...args) {
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
  return function(...args) {
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

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Cache hit for:', args);
      return cache.get(key);
    }
    console.log('Cache miss for:', args);
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


// ============================================================================
// 6. DEBOUNCING & THROTTLING
// ============================================================================
/**
 * Debounce & Throttle - Rate limiting function execution (ES6)
 *
 * Debounce Characteristics:
 * - Delays execution until after pause
 * - Useful for waiting until user finishes typing
 * - Last call wins
 *
 * Throttle Characteristics:
 * - Limits execution frequency
 * - Ensures function runs at most once per period
 * - First call wins
 *
 * Use Cases:
 * - Search input handling (debounce)
 * - Scroll events (throttle)
 * - Resize events (throttle)
 * - API rate limiting (throttle)
 *
 * Common Pitfalls:
 * - Incorrect timing values
 * - Memory leaks with old timers
 * - Lost context (this)
 */

console.log("\n=== 6. Debouncing & Throttling Demo ===");

// 6.1 Debounce implementation
function debounce(fn, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 6.2 Throttle implementation
function throttle(fn, delay) {
  let lastCall = 0;
  let timeoutId;

  return function(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      fn.apply(this, args);
      lastCall = now;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
        lastCall = Date.now();
      }, delay - timeSinceLastCall);
    }
  };
}

// 6.3 Demo debounce
let debounceCount = 0;
const debouncedLog = debounce(() => {
  debounceCount++;
  console.log(`Debounced call #${debounceCount}`);
}, 100);

console.log("Debounce demo (rapid calls):");
debouncedLog();
debouncedLog();
debouncedLog();

setTimeout(() => {
  // 100ms - should see one call
  console.log("(waiting for debounce...)");
}, 50);

// 6.4 Demo throttle
let throttleCount = 0;
const throttledLog = throttle(() => {
  throttleCount++;
  console.log(`Throttled call #${throttleCount}`);
}, 100);

console.log("\nThrottle demo (rapid calls):");
throttledLog(); // Executes
throttledLog(); // Throttled
throttledLog(); // Throttled


// ============================================================================
// 7. TRAMPOLINES - TAIL RECURSION OPTIMIZATION
// ============================================================================
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

console.log("\n=== 7. Trampolines Demo ===");

// 7.1 Trampoline pattern
function trampoline(fn) {
  let result = fn();

  while (typeof result === 'function') {
    result = result();
  }

  return result;
}

// 7.2 Thunk creator
function thunk(fn, ...args) {
  return () => fn(...args);
}

// 7.3 Recursive factorial with trampoline
function factorial(n, acc = 1) {
  if (n <= 1) {
    return acc;
  }
  return thunk(factorial, n - 1, n * acc);
}

console.log("Trampoline factorial:");
console.log("trampoline(() => factorial(10)):", trampoline(() => factorial(10))); // 3628800

// 7.4 Even/odd with mutual recursion
function even(n) {
  if (n === 0) return true;
  return thunk(odd, n - 1);
}

function odd(n) {
  if (n === 0) return false;
  return thunk(even, n - 1);
}

console.log("\nMutual recursion:");
console.log("trampoline(() => even(10)):", trampoline(() => even(10))); // true
console.log("trampoline(() => even(9)):", trampoline(() => even(9))); // false


// ============================================================================
// 8. RECURSION PATTERNS
// ============================================================================
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

console.log("\n=== 8. Recursion Patterns Demo ===");

// 8.1 Linear recursion
function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}

console.log("Linear recursion:");
console.log("sumArray([1, 2, 3, 4, 5]):", sumArray([1, 2, 3, 4, 5])); // 15

// 8.2 Tail recursion
function tailSumArray(arr, index = 0, acc = 0) {
  if (index >= arr.length) return acc;
  return tailSumArray(arr, index + 1, acc + arr[index]);
}

console.log("\nTail recursion:");
console.log("tailSumArray([1, 2, 3, 4, 5]):", tailSumArray([1, 2, 3, 4, 5])); // 15

// 8.3 Tree traversal
const tree = {
  value: 1,
  left: {
    value: 2,
    left: { value: 4 },
    right: { value: 5 }
  },
  right: {
    value: 3,
    left: { value: 6 },
    right: { value: 7 }
  }
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

// 8.4 Recursive reducer
function deepReduce(obj, fn, acc) {
  acc = fn(acc, obj);

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      acc = deepReduce(obj[key], fn, acc);
    }
  }

  return acc;
}

const nestedObject = {
  a: 1,
  b: { c: 2, d: { e: 3 } },
  f: 4
};

const sum = deepReduce(nestedObject, (acc, val) => {
  return typeof val === 'number' ? acc + val : acc;
}, 0);

console.log("\nRecursive reducer:");
console.log("Sum of nested values:", sum); // 10


// ============================================================================
// 9. POINT-FREE STYLE
// ============================================================================
/**
 * Point-Free Style - Omitting explicit arguments (ES6)
 *
 * Characteristics:
 * - Also called "tacit programming"
 * - Functions composed without naming arguments
 * - Relies on function composition
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

console.log("\n=== 9. Point-Free Style Demo ===");

// 9.1 Regular style
const add1 = (x) => x + 1;
const multiply2 = (x) => x * 2;
const regularTransform = (x) => multiply2(add1(x));

console.log("Regular style:");
console.log("regularTransform(5):", regularTransform(5)); // 12

// 9.2 Point-free style
const pointFreeTransform = pipe(add1, multiply2);

console.log("\nPoint-free style:");
console.log("pointFreeTransform(5):", pointFreeTransform(5)); // 12

// 9.3 Practical example - array processing
const isEven = (x) => x % 2 === 0;
const doubleValue = (x) => x * 2;

const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter(isEven)
  .map(doubleValue);

console.log("\nArray processing:");
console.log("result:", result); // [4, 8]


// ============================================================================
// 10. PERFORMANCE CONSIDERATIONS
// ============================================================================
/**
 * Function Pattern Performance Considerations (ES6)
 *
 * Key Concerns:
 * - Stack depth (recursion, currying)
 * - Memory leaks (closures, caches)
 * - Function call overhead
 * - Garbage collection impact
 *
 * Best Practices:
 * - Use iteration for simple loops
 * - Limit function composition depth
 * - Clear caches when appropriate
 * - Consider lazy evaluation
 */

console.log("\n=== 10. Performance Considerations Demo ===");

// 10.1 Function call overhead
function sumLoop(n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += i;
  }
  return total;
}

function sumReduce(n) {
  return Array.from({ length: n }, (_, i) => i)
    .reduce((acc, val) => acc + val, 0);
}

console.log("Performance comparison:");
console.time('sumLoop');
sumLoop(100000);
console.timeEnd('sumLoop');

console.time('sumReduce');
sumReduce(100000);
console.timeEnd('sumReduce');

// 10.2 Cache size management
function memoizeWithMaxSize(fn, maxSize = 100) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);

    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

// 10.3 Lazy function evaluation
function lazy(fn) {
  let evaluated = false;
  let result;

  return function() {
    if (!evaluated) {
      result = fn();
      evaluated = true;
    }
    return result;
  };
}

const expensiveComputation = lazy(() => {
  console.log("Computing...");
  return 42 * 42;
});

console.log("\nLazy evaluation:");
console.log("First call:", expensiveComputation()); // Logs "Computing..."
console.log("Second call:", expensiveComputation()); // No log


// ============================================================================
// BEST PRACTICES
// ============================================================================
/**
 * Function Patterns Best Practices
 *
 * 1. USE CURRYING FOR COMPOSITION
 *    - Enable partial application naturally
 *    - Build pipelines with compose/pipe
 *    - Keep function signatures simple
 *
 * 2. DEBOUNCE INPUT, THROTTLE SCROLL
 *    - Debounce: search inputs, form validation
 *    - Throttle: scroll, resize, mousemove
 *    - Choose delay values carefully
 *
 * 3. AVOID DEEP RECURSION
 *    - Use iteration for simple loops
 *    - Consider trampolines for deep recursion
 *    - Use TCO when available
 *
 * 4. MANAGE MEMORY CACHES
 *    - Set max size for memoization
 *    - Clear caches when appropriate
 *    - Use WeakMap for cache keys
 *
 * 5. KEEP FUNCTIONS SMALL
 *    - Single responsibility
 *    - Easy to test and debug
 *    - Compose for complex behavior
 */

console.log("\n=== Function Patterns Best Practices Demo ===");

// Good: Composable small functions
const trim = (str) => str.trim();
const toUpper = (str) => str.toUpperCase();
const addPrefix = (prefix) => (str) => `${prefix} ${str}`;

const formatName = pipe(trim, toUpper, addPrefix('Dr.'));
console.log("Good composition:", formatName('  alice  ')); // "Dr. ALICE"

// Good: Debounced search
const searchAPI = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

console.log("Debounced search demo:");
searchAPI('a');
searchAPI('ab');
searchAPI('abc');


// ============================================================================
// COMMON PITFALLS
// ============================================================================
console.log("\n=== Function Patterns Common Pitfalls Demo ===");

// Pitfall 1: Stack overflow with deep recursion
console.log("\nPitfall 1 - Deep recursion:");
console.log("Use trampolines or iteration for deep recursion");

// Pitfall 2: Memory leak with unclosed functions
console.log("\nPitfall 2 - Memory leaks:");
console.log("Clear caches and avoid retaining unnecessary references");

// Pitfall 3: Incorrect debounce/throttle timing
console.log("\nPitfall 3 - Wrong timing values:");
console.log("Choose delay values based on use case");

// Pitfall 4: Over-composing functions
console.log("\nPitfall 4 - Over-composition:");
console.log("Too many composed functions are hard to debug");


// ============================================================================
// SUMMARY
// ============================================================================
/**
 * Function Patterns Summary
 *
 * Key Concepts:
 * 1. Currying transforms n-ary to unary functions
 * 2. Composition combines functions declaratively
 * 3. Partial application fixes some arguments
 * 4. Debounce/throttle control execution rate
 * 5. Trampolines handle deep recursion
 * 6. Higher-order functions transform functions
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


// ============================================================================
// TypeScript Comparison Notes
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. FUNCTION TYPE ANNOTATIONS
   TS:  (a: number, b: number) => number

   TypeScript example:
   const add: (a: number, b: number) => number = (a, b) => a + b;

2. CURRY TYPE SIGNATURES
   TS:  <T>(fn: (...args: T[]) => any) => any

   TypeScript example:
   function curry<T extends any[], R>(
     fn: (...args: T) => R
   ): (a: T[0]) => (b: T[1]) => R {
     return (a) => (b) => fn(a, b);
   }

3. COMPOSE TYPE SAFETY
   TS:  <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) => C

   TypeScript example:
   function compose<A, B, C>(
     f: (b: B) => C,
     g: (a: A) => B
   ): (a: A) => C {
     return (a) => f(g(a));
   }

4. GENERIC HIGHER-ORDER FUNCTIONS
   TS:  <T, R>(fn: (x: T) => R) => (x: T) => R

   TypeScript example:
   function withLogging<T, R>(fn: (x: T) => R): (x: T) => R {
     return (x) => {
       console.log('Calling with:', x);
       return fn(x);
     };
   }

5. MEMOIZE WITH TYPE SAFETY
   TS:  <T extends any[], R>(fn: (...args: T) => R) => (...args: T) => R

   TypeScript example:
   function memoize<T extends any[] = any[], R>(
     fn: (...args: T) => R
   ): (...args: T) => R {
     const cache = new Map<string, R>();
     return (...args: T) => {
       const key = JSON.stringify(args);
       if (cache.has(key)) return cache.get(key)!;
       const result = fn(...args);
       cache.set(key, result);
       return result;
     };
   }

📘 See related files:
- 13-scope-closures.js (closures and scope)
- 26-optimization-performance.js (performance)
- 27-memory-management.js (memoization caches)
*/

// ============================================================================
// CROSS-REFERENCES
// ============================================================================
console.log(`
📘 See related files for additional patterns:

Function Patterns:
- 13-scope-closures.js (closures and lexical scope)
- 26-optimization-performance.js (memoization optimization)
- 27-memory-management.js (object pooling)

Design Patterns:
- 25-inheritance-patterns.js (mixins, strategy, observer)
- 34-async-error-handling.js (circuit breakers, retry patterns)
`);
