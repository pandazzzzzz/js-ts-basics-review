// Functions - Basics Demo
// 📘 For TypeScript comparison, see: 07.1-functions-basics-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file introduces the fundamentals of JavaScript functions:
// 1. Function declarations and expressions
// 2. Arrow functions and lexical this
// 3. Default parameters and rest parameters
// 4. Function syntax variations and their use cases

// ============================================
// Table of Contents
// ============================================

// 1. Function Declaration (Function Statement)
// 2. Function Expression
// 3. Arrow Function
// 4. Default Parameters
// 5. Rest Parameters

// ============================================

console.log("=== Functions - Basics Demo ===\n");

// ============================================
// 1. Function Declaration (Function Statement)
// ============================================
/**
 * Function Declaration - Traditional function definition (ES3)
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

console.log("=== 1. Function Declaration Demo ===");
console.log("greet('World'):", greet("World"));

// Hoisting example
console.log("hoistedFunction():", hoistedFunction()); // Can be called before declaration

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
showThis();

// 'arguments' object example
function sumAll() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log("sumAll(1, 2, 3, 4, 5):", sumAll(1, 2, 3, 4, 5)); // 15

// Used as constructor
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const person1 = new Person("Alice", 30);
console.log("new Person('Alice', 30):", person1);

// ============================================
// 2. Function Expression
// ============================================
/**
 * Function Expression - Assigning function to a variable (ES3)
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

const add = function (a, b) {
  return a + b;
};

console.log("\n=== 2. Function Expression Demo ===");
console.log("add(5, 3):", add(5, 3)); // 8

// Named function expression - better for debugging and recursion
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can use function name for recursion
};
console.log("factorial(5):", factorial(5)); // 120

// IIFE (Immediately Invoked Function Expression)
(function () {
  console.log("IIFE executed immediately!");
})();

// Conditional function creation
const isDevelopment = true;
const logger = isDevelopment
  ? function (msg) {
      console.log("[DEV]", msg);
    }
  : function (msg) {};

logger("Conditional function created");

// ============================================
// 3. Arrow Function
// ============================================
/**
 * Arrow Function - ES6 concise function syntax (ES6)
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

console.log("\n=== 3. Arrow Function Demo ===");

// Basic syntax
const multiply = (a, b) => a * b;
console.log("multiply(4, 7):", multiply(4, 7)); // 28

// Single parameter can omit parentheses
const square = x => x * x;
console.log("square(5):", square(5)); // 25

// No parameters need empty parentheses
const getRandom = () => Math.random();
console.log("getRandom():", getRandom());

// Multi-line body needs braces and return
const divide = (a, b) => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};
console.log("divide(10, 2):", divide(10, 2)); // 5

// Returning object literal - needs parentheses
const createUser = (name, age) => ({ name, age });
console.log("createUser('Bob', 25):", createUser("Bob", 25)); // { name: 'Bob', age: 25 }

// 'this' binding example
const obj = {
  name: "Object",
  regularFunction: function () {
    console.log("Regular function this:", this.name); // 'Object'
  },
  arrowFunction: () => {
    console.log("Arrow function this:", this); // Inherits outer 'this'
  },
  nestedExample: function () {
    // Arrow function inherits outer 'this' - typical use case
    setTimeout(() => {
      console.log("Nested arrow this:", this.name); // 'Object'
    }, 0);
  },
};

obj.regularFunction();
obj.arrowFunction();
obj.nestedExample();

// Rest parameters replace 'arguments'
const sumAllArrow = (...numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};
console.log("sumAllArrow(1, 2, 3, 4, 5):", sumAllArrow(1, 2, 3, 4, 5)); // 15

// ============================================
// 4. Default Parameters
// ============================================
/**
 * Default Parameters - Provide default values for function parameters (ES6)
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

console.log("\n=== 4. Default Parameters Demo ===");
console.log("greetWithDefault():", greetWithDefault()); // 'Hello, Guest!'
console.log("greetWithDefault('Alice'):", greetWithDefault("Alice")); // 'Hello, Alice!'
console.log("greetWithDefault('Bob', 'Hi'):", greetWithDefault("Bob", "Hi")); // 'Hi, Bob!'
console.log(
  "greetWithDefault(undefined, 'Hey'):",
  greetWithDefault(undefined, "Hey")
); // 'Hey, Guest!'
console.log("greetWithDefault(null, 'Hey'):", greetWithDefault(null, "Hey")); // 'Hey, null!' (null doesn't trigger default)

// Default value can be expression
const getDefaultName = () => "Default User";
function createAccount(username = getDefaultName()) {
  return { username };
}
console.log("createAccount():", createAccount()); // { username: 'Default User' }

// Later parameters can reference earlier ones
function calculateArea(width, height = width) {
  return width * height;
}
console.log("calculateArea(5):", calculateArea(5)); // 25 (square)
console.log("calculateArea(5, 10):", calculateArea(5, 10)); // 50 (rectangle)

// ============================================
// 5. Rest Parameters
// ============================================
/**
 * Rest Parameters - Collect multiple arguments into an array (ES6)
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

console.log("\n=== 5. Rest Parameters Demo ===");
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5)); // 15

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
  country: "USA",
});

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Forgetting that arrow functions don't have their own 'this'
const brokenTimer = {
  name: "Timer",
  start: function () {
    setTimeout(function () {
      // ❌ Bad: 'this' is global or undefined
      console.log("Regular function timer:", this?.name || "GLOBAL");
    }, 0);
  },
  startFixed: function () {
    setTimeout(() => {
      // ✅ Good: Arrow function inherits 'this' from startFixed()
      console.log("Arrow function timer:", this.name);
    }, 0);
  },
};
brokenTimer.start();
brokenTimer.startFixed();

// Pitfall 2: Forgetting parentheses when returning object literal
const badCreateUser = name => {
  name: name;
}; // ❌ Thinks { ... } is function body
const goodCreateUser = name => ({ name: name }); // ✅ Wraps in parentheses
console.log("goodCreateUser('Dave'):", goodCreateUser("Dave"));

// Pitfall 3: Confusing rest parameters with spread operator
function showArgs(...args) {
  // ✅ Rest parameter: collects into array
  console.log("Args:", args);
}
const arr = [1, 2, 3];
showArgs(...arr); // ✅ Spread operator: spreads array into arguments

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use arrow functions for short callbacks and array methods");
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(x => x * 2);
console.log("Doubled array:", doubled);

console.log("✅ Use function declarations for top-level functions (hoisting)");
console.log("✅ Use rest parameters instead of the 'arguments' object");
console.log("✅ Provide sensible defaults with default parameters");
console.log(
  "⚠️  Avoid arrow functions when you need 'this' to bind dynamically"
);
console.log("⚠️  Avoid arrow functions as constructors (they don't work)");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log(
  "📘 07.2-functions-advanced.js - Higher-order functions and closures"
);
console.log("📘 07.3-functions-patterns.js - Advanced function patterns");
console.log("📘 13-scope-closures.js - Closures and lexical scope");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 07.1-functions-basics-ts-comparison.ts
*/
