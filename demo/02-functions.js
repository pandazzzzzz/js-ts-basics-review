// ============================================================================
// JAVASCRIPT FUNCTIONS - COMPREHENSIVE GUIDE
// 📘 For TypeScript comparison, see: 02-functions-ts-comparison.ts
// ============================================================================

// ============================================================================
// 1. FUNCTION DECLARATION (Function Statement)
// ============================================================================
/**
 * Function Declaration - Traditional function definition
 * 
 * ES Specification: ES3 (1999)
 * 
 * Characteristics:
 * - Hoisted to the top of scope (can be called before declaration)
 * - Creates a named function visible in current scope
 * - Has its own 'this' binding (depends on how it's called)
 * - Has 'arguments' object to access all passed parameters
 * - Can be used as constructor with 'new' keyword
 * 
 * Use Cases:
 * - When hoisting is needed
 * - When 'this' binding is required
 * - When used as constructor function
 * - Recursive functions (can call itself by name)
 * 
 * Common Pitfalls:
 * - Hoisting can reduce code readability
 * - 'this' value is determined at runtime, easy to get wrong
 * - In strict mode, 'this' is undefined when called independently
 */

function greet(name) {
  return `Hello, ${name}!`;
}

// Hoisting example
console.log("=== Function Declaration Demo ===");
console.log(hoistedFunction()); // Can be called before declaration

function hoistedFunction() {
  return "I am hoisted!";
}

// 'this' binding example
function showThis() {
  console.log("this in function declaration:", this);
  // In browser (non-strict): this points to window
  // In Node.js: this points to global object
  // In strict mode: this is undefined
}

// 'arguments' object example
function sumAll() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(greet("World")); // Hello, World!
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// Used as constructor
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const person1 = new Person("Alice", 30);
console.log(person1); // Person { name: 'Alice', age: 30 }


// ============================================================================
// 2. FUNCTION EXPRESSION
// ============================================================================
/**
 * Function Expression - Assigning function to a variable
 * 
 * ES Specification: ES3 (1999)
 * 
 * Characteristics:
 * - Not hoisted, can only be called after definition
 * - Can be anonymous or named
 * - Has its own 'this' binding
 * - Has 'arguments' object
 * - Can be used as IIFE (Immediately Invoked Function Expression)
 * 
 * Use Cases:
 * - Passing functions as values
 * - Callback functions
 * - Conditionally creating functions
 * - Creating closures
 * 
 * Common Pitfalls:
 * - Temporal Dead Zone (TDZ) with const/let declarations
 * - Anonymous functions have poor stack traces for debugging
 * - 'this' binding same as function declaration, can be confusing
 */

const add = function(a, b) {
  return a + b;
};

console.log("\n=== Function Expression Demo ===");
console.log(add(5, 3)); // 8

// Named function expression - better for debugging and recursion
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can use function name for recursion
};
console.log(factorial(5)); // 120

// IIFE (Immediately Invoked Function Expression)
(function() {
  console.log("IIFE executed immediately!");
})();

// Conditional function creation
const isDevelopment = true;
const logger = isDevelopment 
  ? function(msg) { console.log("[DEV]", msg); }
  : function(msg) { /* do nothing */ };

logger("Conditional function created");


// ============================================================================
// 3. ARROW FUNCTION
// ============================================================================
/**
 * Arrow Function - ES6 concise function syntax
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - More concise syntax
 * - No own 'this' - inherits from enclosing scope (lexical this)
 * - No 'arguments' object (use rest parameters instead)
 * - Cannot be used as constructor (cannot use 'new')
 * - No 'prototype' property
 * - Cannot be used as Generator (cannot use 'yield')
 * 
 * Use Cases:
 * - Short function logic
 * - Callback functions (especially array methods)
 * - When you need to preserve outer 'this'
 * - Functional programming
 * 
 * Common Pitfalls:
 * - Returning object literals requires parentheses: () => ({ key: value })
 * - Cannot be used as constructor
 * - No 'arguments' object
 * - 'this' binding is static, cannot be changed with call/apply/bind
 */

// Basic syntax
const multiply = (a, b) => a * b;

// Single parameter can omit parentheses
const square = x => x * x;

// No parameters need empty parentheses
const getRandom = () => Math.random();

// Multi-line body needs braces and return
const divide = (a, b) => {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};

console.log("\n=== Arrow Function Demo ===");
console.log(multiply(4, 7)); // 28
console.log(square(5)); // 25
console.log(getRandom());
console.log(divide(10, 2)); // 5

// Returning object literal - needs parentheses
const createUser = (name, age) => ({ name, age });
console.log(createUser("Bob", 25)); // { name: 'Bob', age: 25 }

// 'this' binding example
const obj = {
  name: "Object",
  regularFunction: function() {
    console.log("Regular function this:", this.name); // "Object"
  },
  arrowFunction: () => {
    console.log("Arrow function this:", this); // Inherits outer 'this'
  },
  nestedExample: function() {
    // Arrow function inherits outer 'this' - typical use case
    setTimeout(() => {
      console.log("Nested arrow this:", this.name); // "Object"
    }, 100);
    
    // Compare: regular function needs to save 'this'
    setTimeout(function() {
      console.log("Nested regular this:", this); // undefined or global
    }, 100);
  }
};

obj.regularFunction();
obj.arrowFunction();
obj.nestedExample();

// Rest parameters replace 'arguments'
const sumAllArrow = (...numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};
console.log(sumAllArrow(1, 2, 3, 4, 5)); // 15


// ============================================================================
// 4. DEFAULT PARAMETERS
// ============================================================================
/**
 * Default Parameters - Provide default values for function parameters
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Used when parameter is not passed or is undefined
 * - Default value can be expression or function call
 * - Later parameters can reference earlier parameters
 * 
 * Use Cases:
 * - Optional parameters
 * - Default configuration values
 * 
 * Common Pitfalls:
 * - null does NOT trigger default value
 * - Default parameters not counted in arguments.length
 */

function greetWithDefault(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log("\n=== Default Parameters Demo ===");
console.log(greetWithDefault()); // Hello, Guest!
console.log(greetWithDefault("Alice")); // Hello, Alice!
console.log(greetWithDefault("Bob", "Hi")); // Hi, Bob!
console.log(greetWithDefault(undefined, "Hey")); // Hey, Guest!
console.log(greetWithDefault(null, "Hey")); // Hey, null! (null doesn't trigger default)

// Default value can be expression
const getDefaultName = () => "Default User";
function createAccount(username = getDefaultName()) {
  return { username };
}
console.log(createAccount()); // { username: 'Default User' }

// Later parameters can reference earlier ones
function calculateArea(width, height = width) {
  return width * height;
}
console.log(calculateArea(5)); // 25 (square)
console.log(calculateArea(5, 10)); // 50 (rectangle)


// ============================================================================
// 5. REST PARAMETERS
// ============================================================================
/**
 * Rest Parameters - Collect multiple arguments into an array
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Uses ... syntax
 * - Must be the last parameter
 * - Is a real array, can use array methods
 * 
 * Use Cases:
 * - Functions with variable number of arguments
 * - Replacement for 'arguments' object
 * 
 * Common Pitfalls:
 * - Can only have one rest parameter
 * - Must be the last parameter
 */

function sum(first, second, ...rest) {
  console.log("First:", first);
  console.log("Second:", second);
  console.log("Rest:", rest); // Real array
  return first + second + rest.reduce((a, b) => a + b, 0);
}

console.log("\n=== Rest Parameters Demo ===");
console.log(sum(1, 2, 3, 4, 5)); // 15

// Combined with destructuring
function processData({ name, age, ...otherInfo }) {
  console.log("Name:", name);
  console.log("Age:", age);
  console.log("Other info:", otherInfo);
}

processData({ 
  name: "Charlie", 
  age: 28, 
  city: "NYC", 
  country: "USA" 
});


// ============================================================================
// 6. HIGHER-ORDER FUNCTIONS
// ============================================================================
/**
 * Higher-Order Functions - Functions that accept or return functions
 * 
 * ES Specification: ES3 (concept), ES5/ES6 enhanced
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

console.log("\n=== Higher-Order Functions Demo ===");

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
console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function composition
const compose = (f, g) => (x) => f(g(x));
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const addOneThenDouble = compose(multiplyByTwo, addOne);
console.log(addOneThenDouble(5)); // 12


// ============================================================================
// 7. CLOSURES
// ============================================================================
/**
 * Closures - Functions can access variables from outer scope
 * 
 * ES Specification: ES3 (1999)
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

console.log("\n=== Closures Demo ===");

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
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
console.log(counter.decrement()); // 1
// console.log(counter.count); // undefined - cannot access private variable

// Closure trap in loops
console.log("Closure trap with var:");
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log("var i:", i); // All print 3
  }, 100);
}

console.log("Fixed with let:");
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log("let j:", j); // Prints 0, 1, 2
  }, 100);
}

// Fix var issue with IIFE
console.log("Fixed with IIFE:");
for (var k = 0; k < 3; k++) {
  (function(index) {
    setTimeout(function() {
      console.log("IIFE k:", index); // Prints 0, 1, 2
    }, 100);
  })(k);
}


// ============================================================================
// 8. ASYNC FUNCTIONS
// ============================================================================
/**
 * Async Functions - Handle asynchronous operations with async/await
 * 
 * ES Specification: ES8/ES2017
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

console.log("\n=== Async Functions Demo ===");

// Simulate async operation
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData() {
  console.log("Fetching data...");
  await delay(1000);
  return { data: "Sample data" };
}

async function processData() {
  try {
    const result = await fetchData();
    console.log("Data received:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

processData();

// Parallel execution of multiple async operations
async function fetchMultiple() {
  const [result1, result2, result3] = await Promise.all([
    delay(1000).then(() => "Data 1"),
    delay(500).then(() => "Data 2"),
    delay(800).then(() => "Data 3")
  ]);
  console.log("All data:", result1, result2, result3);
}

fetchMultiple();


// ============================================================================
// 9. GENERATOR FUNCTIONS
// ============================================================================
/**
 * Generator Functions - Functions that can pause and resume execution
 * 
 * ES Specification: ES6/ES2015
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

console.log("\n=== Generator Functions Demo ===");

function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Infinite sequence
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const seq = infiniteSequence();
console.log(seq.next().value); // 0
console.log(seq.next().value); // 1
console.log(seq.next().value); // 2

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


// ============================================================================
// 10. METHOD DEFINITIONS
// ============================================================================
/**
 * Method Definitions - ES6 shorthand syntax for object methods
 * 
 * ES Specification: ES6/ES2015
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

console.log("\n=== Method Definitions Demo ===");

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
  }
};

calculator.add(10).subtract(3);
console.log("Calculator result:", calculator.result); // 7
calculator.reset = 0;
console.log("After reset:", calculator.result); // 0


// ============================================================================
// 11. FUNCTION BINDING
// ============================================================================
/**
 * Function Binding - Control function's 'this' value
 * 
 * ES Specification: ES5 (bind), ES3 (call/apply)
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

console.log("\n=== Function Binding Demo ===");

const user = {
  name: "David",
  greet: function(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

console.log(user.greet("Hello", "!")); // Hello, David!

// call
console.log(user.greet.call({ name: "Eve" }, "Hi", ".")); // Hi, Eve.

// apply
console.log(user.greet.apply({ name: "Frank" }, ["Hey", "?"])); // Hey, Frank?

// bind
const greetEve = user.greet.bind({ name: "Eve" });
console.log(greetEve("Good morning", "!")); // Good morning, Eve!

// Partial application
const sayHello = user.greet.bind(user, "Hello");
console.log(sayHello("!")); // Hello, David!


// ============================================================================
// 12. CURRYING
// ============================================================================
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

console.log("\n=== Currying Demo ===");

// Manual currying
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

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
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6


// ============================================================================
// SUMMARY - Function Types Comparison
// ============================================================================
console.log("\n=== FUNCTION TYPES COMPARISON ===");
console.log(`
┌─────────────────────┬──────────┬──────────┬──────────┬─────────────┬──────────┐
│ Feature             │ Function │ Function │  Arrow   │   Async     │Generator │
│                     │ Decl.    │ Expr.    │ Function │  Function   │ Function │
├─────────────────────┼──────────┼──────────┼──────────┼─────────────┼──────────┤
│ Hoisting            │    ✓     │    ✗     │    ✗     │      ✗      │    ✗     │
│ Own 'this'          │    ✓     │    ✓     │    ✗     │      ✓      │    ✓     │
│ 'arguments' object  │    ✓     │    ✓     │    ✗     │      ✓      │    ✓     │
│ Constructor (new)   │    ✓     │    ✓     │    ✗     │      ✗      │    ✗     │
│ 'prototype'         │    ✓     │    ✓     │    ✗     │      ✓      │    ✓     │
│ Returns Promise     │    ✗     │    ✗     │    ✗     │      ✓      │    ✗     │
│ Can use 'yield'     │    ✗     │    ✗     │    ✗     │      ✗      │    ✓     │
│ Can use 'await'     │    ✗     │    ✗     │    ✗     │      ✓      │    ✗     │
│ ES Version          │   ES3    │   ES3    │   ES6    │     ES8     │   ES6    │
└─────────────────────┴──────────┴──────────┴──────────┴─────────────┴──────────┘

BEST PRACTICES:
1. Use arrow functions for short callbacks and when you need lexical 'this'
2. Use function declarations for top-level functions and when you need hoisting
3. Use function expressions when you need to conditionally create functions
4. Use async/await for asynchronous operations (cleaner than Promises)
5. Use generators for lazy evaluation and custom iterators
6. Prefer const for function expressions to prevent reassignment
7. Use default parameters instead of checking for undefined
8. Use rest parameters instead of the 'arguments' object
9. Be careful with 'this' - arrow functions inherit, regular functions don't
10. Use descriptive function names for better debugging and code readability
`);


// ============================================================================
// TYPESCRIPT COMPARISON NOTES
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. PARAMETER TYPE ANNOTATIONS
   JS:  function add(a, b) { return a + b; }
   TS:  function add(a: number, b: number): number { return a + b; }
   
   Benefits:
   - Catches type errors at compile time
   - Better IDE autocomplete and IntelliSense
   - Self-documenting code

2. RETURN TYPE ANNOTATIONS
   JS:  function getValue() { return 42; }
   TS:  function getValue(): number { return 42; }
   
   Benefits:
   - Prevents accidental return type changes
   - Explicit contract for function behavior
   - Better error messages

3. FUNCTION OVERLOADS (TS-Only)
   JS:  function format(input) {
          if (typeof input === "string") return input.toUpperCase();
          if (typeof input === "number") return input.toFixed(2);
        }
   
   TS:  function format(input: string): string;
        function format(input: number): string;
        function format(input: string | number): string {
          if (typeof input === "string") return input.toUpperCase();
          if (typeof input === "number") return input.toFixed(2);
          return String(input);
        }
   
   Benefits:
   - Multiple type signatures for same function
   - Better type inference for callers
   - More precise API documentation

4. OPTIONAL PARAMETERS
   JS:  function greet(name, greeting) {
          greeting = greeting || "Hello";
          return greeting + ", " + name;
        }
   
   TS:  function greet(name: string, greeting?: string): string {
          return (greeting || "Hello") + ", " + name;
        }
   
   Benefits:
   - Explicit optional parameters with ?
   - Type checking for optional values
   - Clear function signature

5. GENERIC FUNCTIONS (TS-Only)
   JS:  function identity(value) { return value; }
   
   TS:  function identity<T>(value: T): T { return value; }
   
   Benefits:
   - Type-safe generic code
   - Preserves type information
   - Reusable with any type

6. 'this' PARAMETER (TS-Only)
   JS:  const obj = {
          value: 42,
          getValue: function() { return this.value; }
        };
   
   TS:  interface Obj {
          value: number;
          getValue(this: Obj): number;
        }
        const obj: Obj = {
          value: 42,
          getValue(this: Obj) { return this.value; }
        };
   
   Benefits:
   - Explicit 'this' type checking
   - Prevents 'this' context loss
   - Better error messages

7. VOID, NEVER, UNDEFINED RETURN TYPES
   JS:  function log() { console.log("message"); }
        function throwErr() { throw new Error(); }
   
   TS:  function log(): void { console.log("message"); }
        function throwErr(): never { throw new Error(); }
   
   - void: Function doesn't return meaningful value
   - never: Function never returns (throws or infinite loop)
   - undefined: Function explicitly returns undefined

8. ASYNC FUNCTION TYPES
   JS:  async function fetchData() { return { data: "value" }; }
   
   TS:  async function fetchData(): Promise<{ data: string }> {
          return { data: "value" };
        }
   
   Benefits:
   - Explicit Promise return type
   - Type checking for async operations
   - Better error handling

9. CALLBACK FUNCTION TYPES
   JS:  function map(array, callback) {
          return array.map(callback);
        }
   
   TS:  function map<T, U>(
          array: T[],
          callback: (item: T, index: number) => U
        ): U[] {
          return array.map(callback);
        }
   
   Benefits:
   - Type-safe callbacks
   - Generic type preservation
   - Better IDE support

10. FUNCTION TYPE ALIASES
    JS:  // No type aliases
    
    TS:  type MathOperation = (a: number, b: number) => number;
         const add: MathOperation = (a, b) => a + b;
    
    Benefits:
    - Reusable function types
    - Better code organization
    - Self-documenting code

⚠️ COMMON CONFUSION POINTS:

1. OPTIONAL VS DEFAULT PARAMETERS
   - Optional (?): Can be omitted, value is undefined
   - Default (=): Has fallback value if not provided
   
   function example(a?: string, b: string = "default") {}
   example(); // a is undefined, b is "default"

2. VOID VS UNDEFINED VS NEVER
   - void: Function doesn't return meaningful value (can return undefined)
   - undefined: Function explicitly returns undefined
   - never: Function never returns (throws or infinite loop)
   
   function voidFn(): void { console.log("hi"); }
   function undefinedFn(): undefined { return undefined; }
   function neverFn(): never { throw new Error(); }

3. FUNCTION OVERLOADS ORDER
   - More specific overloads must come first
   - Implementation signature must cover all overloads
   - Implementation signature is NOT part of public API
   
   function fn(x: string): string;        // ✅ Specific first
   function fn(x: string | number): string; // ✅ General second
   function fn(x: string | number): string { return String(x); }

4. ARROW FUNCTIONS AND 'this'
   - Arrow functions don't have their own 'this'
   - They inherit 'this' from enclosing scope
   - Cannot use 'this' parameter with arrow functions
   
   const obj = {
     value: 42,
     arrow: () => this.value,  // ❌ 'this' is not obj
     regular: function() { return this.value; } // ✅ 'this' is obj
   };

5. GENERIC TYPE INFERENCE
   - TypeScript infers generic types from arguments
   - Can explicitly specify generic types when needed
   
   function identity<T>(value: T): T { return value; }
   identity(42);           // T inferred as number
   identity<string>("hi"); // T explicitly set to string

6. ASYNC FUNCTION RETURN TYPES
   - Async functions always return Promise
   - Must wrap return type in Promise<T>
   
   async function getData(): Promise<string> { // ✅ Correct
     return "data";
   }
   
   async function getData(): string { // ❌ Error
     return "data";
   }

7. REST PARAMETERS TYPE
   - Rest parameters are typed as arrays
   - Must be last parameter
   
   function sum(...numbers: number[]): number { // ✅ Correct
     return numbers.reduce((a, b) => a + b, 0);
   }

8. CALLBACK VOID RETURN TYPE
   - Callbacks with void return can return values
   - Return value is ignored (by design for flexibility)
   
   function execute(callback: () => void): void {
     callback();
   }
   execute(() => 42); // ✅ OK, return value ignored

9. TYPE ASSERTIONS IN FUNCTIONS
   - Type assertions don't perform runtime checks
   - Use type guards instead when possible
   
   function bad(value: unknown): string {
     return (value as string).toUpperCase(); // ❌ Unsafe
   }
   
   function good(value: unknown): string {
     if (typeof value === "string") {
       return value.toUpperCase(); // ✅ Safe with type guard
     }
     return "";
   }

10. FUNCTION EXPRESSION TYPE INFERENCE
    - Return type is inferred from implementation
    - Explicit return type prevents accidental changes
    
    const inferred = (x: number) => x * 2; // Return type inferred
    const explicit = (x: number): number => x * 2; // Return type explicit

🎯 BEST PRACTICES:

1. ALWAYS TYPE FUNCTION PARAMETERS
   ❌ function add(a, b) { return a + b; }
   ✅ function add(a: number, b: number): number { return a + b; }

2. SPECIFY RETURN TYPES FOR PUBLIC APIs
   ❌ export function getData() { return { data: "value" }; }
   ✅ export function getData(): { data: string } { return { data: "value" }; }

3. USE GENERICS FOR REUSABLE FUNCTIONS
   ❌ function identity(value: any): any { return value; }
   ✅ function identity<T>(value: T): T { return value; }

4. USE FUNCTION OVERLOADS FOR MULTIPLE SIGNATURES
   ✅ function format(input: string): string;
      function format(input: number): string;
      function format(input: string | number): string { ... }

5. USE 'this' PARAMETER FOR METHODS
   ✅ interface Counter {
        increment(this: Counter): void;
      }

6. USE void FOR SIDE-EFFECT FUNCTIONS
   ✅ function log(message: string): void { console.log(message); }

7. USE never FOR FUNCTIONS THAT THROW
   ✅ function throwError(msg: string): never { throw new Error(msg); }

8. TYPE ASYNC FUNCTION RETURNS
   ✅ async function fetchData(): Promise<Data> { ... }

9. USE TYPE ALIASES FOR COMPLEX FUNCTION TYPES
   ✅ type Callback = (error: Error | null, data?: string) => void;

10. PREFER TYPE GUARDS OVER TYPE ASSERTIONS
    ✅ if (typeof value === "string") { value.toUpperCase(); }

📘 For detailed TypeScript examples and comparisons, see:
   demo/02-functions-ts-comparison.ts
*/
