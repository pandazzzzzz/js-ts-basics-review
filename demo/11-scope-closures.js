// ============================================================================
// JAVASCRIPT SCOPE AND CLOSURES - COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. GLOBAL SCOPE
// ============================================================================
/**
 * Global Scope - Variables accessible everywhere in the program (ES1)
 * 
 * Characteristics:
 * - Variables declared outside any function or block
 * - Accessible from anywhere in the code
 * - In browsers: attached to window object
 * - In Node.js: attached to global object
 * - var, let, const at top level create global variables
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

// Global variables
var globalVar = "I am global (var)";
let globalLet = "I am global (let)";
const globalConst = "I am global (const)";

function accessGlobal() {
  console.log(globalVar);   // Accessible
  console.log(globalLet);   // Accessible
  console.log(globalConst); // Accessible
}

console.log("=== Global Scope Demo ===");
accessGlobal();

// Implicit global (without declaration keyword) - BAD PRACTICE
function createImplicitGlobal() {
  implicitGlobal = "I am implicitly global"; // No var/let/const
}
createImplicitGlobal();
console.log(implicitGlobal); // Accessible globally (in non-strict mode)

// In strict mode, implicit globals throw ReferenceError
"use strict";
function strictMode() {
  try {
    strictGlobal = "This will fail";
  } catch (error) {
    console.log("Strict mode error:", error.message);
  }
}
strictMode();


// ============================================================================
// 2. FUNCTION (LOCAL) SCOPE
// ============================================================================
/**
 * Function Scope (also called Local Scope) - Variables accessible only within the function (ES1)
 * 
 * Characteristics:
 * - Variables declared with var inside function
 * - Not accessible outside the function
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

console.log("\n=== Function Scope Demo ===");

function outerFunction() {
  var functionScoped = "I am function-scoped";
  
  if (true) {
    var alsoFunctionScoped = "var ignores blocks";
  }
  
  console.log(functionScoped);      // Accessible
  console.log(alsoFunctionScoped);  // Accessible (var is function-scoped)
}

outerFunction();

try {
  console.log(functionScoped); // ReferenceError
} catch (error) {
  console.log("Cannot access function-scoped variable:", error.message);
}

// Function scope with parameters
function greet(name) { // 'name' is function-scoped
  var greeting = "Hello";
  return `${greeting}, ${name}!`;
}

console.log(greet("Alice"));
// console.log(name); // ReferenceError


// ============================================================================
// 3. BLOCK SCOPE
// ============================================================================
/**
 * Block Scope - Variables accessible only within the block {} (ES6)
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

console.log("\n=== Block Scope Demo ===");

if (true) {
  var varVariable = "var is function-scoped";
  let letVariable = "let is block-scoped";
  const constVariable = "const is block-scoped";
  
  console.log(varVariable);   // Accessible
  console.log(letVariable);   // Accessible
  console.log(constVariable); // Accessible
}

console.log(varVariable); // Accessible (var ignores block)

try {
  console.log(letVariable); // ReferenceError
} catch (error) {
  console.log("let is block-scoped:", error.message);
}

try {
  console.log(constVariable); // ReferenceError
} catch (error) {
  console.log("const is block-scoped:", error.message);
}

// Block scope in loops
console.log("\nBlock scope in loops:");
for (let i = 0; i < 3; i++) {
  // Each iteration has its own 'i'
  setTimeout(() => console.log("let i:", i), 100);
}

for (var j = 0; j < 3; j++) {
  // All iterations share same 'j'
  setTimeout(() => console.log("var j:", j), 100);
}

// Block scope in switch
switch (true) {
  case true: {
    let caseVariable = "block-scoped in case";
    console.log(caseVariable);
    break;
  }
  default: {
    // caseVariable not accessible here
  }
}


// ============================================================================
// 4. LEXICAL SCOPE (STATIC SCOPE)
// ============================================================================
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
 * - Closures
 * - Private variables
 * - Function factories
 * 
 * Common Pitfalls:
 * - Can be confused with dynamic scope (not in JavaScript)
 * - Nested functions can shadow outer variables
 */

console.log("\n=== Lexical Scope Demo ===");

function outer() {
  const outerVar = "I am from outer";
  
  function inner() {
    const innerVar = "I am from inner";
    console.log(outerVar); // Can access outer variable
    console.log(innerVar);
  }
  
  inner();
  // console.log(innerVar); // ReferenceError - cannot access inner variable
}

outer();

// Lexical scope is static, not dynamic
const x = "global x";

function showX() {
  console.log(x); // Looks up scope chain at definition time
}

function callShowX() {
  const x = "local x";
  showX(); // Prints "global x", not "local x"
}

callShowX();

// Nested lexical scopes
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


// ============================================================================
// 5. SCOPE CHAIN
// ============================================================================
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

console.log("\n=== Scope Chain Demo ===");

const global = "global";

function first() {
  const firstVar = "first";
  
  function second() {
    const secondVar = "second";
    
    function third() {
      const thirdVar = "third";
      
      // Scope chain: third -> second -> first -> global
      console.log("Scope chain lookup:");
      console.log("thirdVar:", thirdVar);   // Found in third
      console.log("secondVar:", secondVar); // Found in second
      console.log("firstVar:", firstVar);   // Found in first
      console.log("global:", global);       // Found in global
    }
    
    third();
  }
  
  second();
}

first();

// Scope chain stops at first match
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


// ============================================================================
// 6. VARIABLE SHADOWING
// ============================================================================
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

console.log("\n=== Variable Shadowing Demo ===");

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

function useParameter(value) { // Parameter shadows global 'value'
  console.log("Parameter value:", value);
}

useParameter(42); // 42, not 100

// Shadowing with let in same scope is error
function noReDeclare() {
  let x = 1;
  // let x = 2; // SyntaxError: Identifier 'x' has already been declared
}


// ============================================================================
// 7. TEMPORAL DEAD ZONE (TDZ)
// ============================================================================
/**
 * Temporal Dead Zone - Period between scope start and variable declaration (ES6)
 * 
 * Characteristics:
 * - Applies to let and const (not var)
 * - Variable exists but cannot be accessed before declaration
 * - ReferenceError if accessed in TDZ
 * - Prevents use-before-declaration bugs
 * 
 * Use Cases:
 * - Enforcing declaration-before-use
 * - Catching initialization errors
 * 
 * Common Pitfalls:
 * - Confusing with hoisting
 * - typeof doesn't work in TDZ
 */

console.log("\n=== Temporal Dead Zone Demo ===");

function tdzExample() {
  // TDZ starts here for 'tdzVariable'
  
  try {
    console.log(tdzVariable); // ReferenceError
  } catch (error) {
    console.log("TDZ error:", error.message);
  }
  
  // TDZ ends here
  let tdzVariable = "Now accessible";
  console.log(tdzVariable); // Works
}

tdzExample();

// var does NOT have TDZ (hoisted with undefined)
function noTdzWithVar() {
  console.log(varVariable); // undefined (not ReferenceError)
  var varVariable = "var is hoisted";
  console.log(varVariable); // "var is hoisted"
}

noTdzWithVar();

// typeof in TDZ
function typeofTdz() {
  // console.log(typeof letVar); // ReferenceError in TDZ
  let letVar = 42;
  
  console.log(typeof undeclaredVar); // "undefined" (no TDZ for undeclared)
}

typeofTdz();

// TDZ in default parameters
function defaultParamTdz(a = b, b = 2) {
  // 'b' is in TDZ when evaluating 'a = b'
  return [a, b];
}

try {
  defaultParamTdz(); // ReferenceError
} catch (error) {
  console.log("Default param TDZ:", error.message);
}


// ============================================================================
// 8. CLOSURES - DATA PRIVACY
// ============================================================================
/**
 * Closures for Data Privacy - Creating private variables (ES3)
 * 
 * Characteristics:
 * - Inner function retains access to outer variables
 * - Variables not accessible from outside
 * - Each closure has its own copy of variables
 * 
 * Use Cases:
 * - Private state
 * - Encapsulation
 * - Information hiding
 * 
 * Common Pitfalls:
 * - Memory usage (variables not garbage collected)
 * - Can't access private variables for debugging
 */

console.log("\n=== Closures - Data Privacy Demo ===");

function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
      throw new Error("Amount must be positive");
    },
    
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      throw new Error("Invalid withdrawal amount");
    },
    
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log("Initial balance:", account.getBalance()); // 100
console.log("After deposit:", account.deposit(50));    // 150
console.log("After withdrawal:", account.withdraw(30)); // 120
// console.log(account.balance); // undefined - private!

// Each closure has independent state
const account1 = createBankAccount(100);
const account2 = createBankAccount(200);
account1.deposit(50);
console.log("Account 1:", account1.getBalance()); // 150
console.log("Account 2:", account2.getBalance()); // 200


// ============================================================================
// 9. CLOSURES - FUNCTION FACTORIES
// ============================================================================
/**
 * Function Factories - Functions that create customized functions
 * 
 * Characteristics:
 * - Returns function with preset parameters
 * - Each returned function has its own closure
 * - Enables function customization
 * 
 * Use Cases:
 * - Creating specialized functions
 * - Configuration
 * - Partial application
 */

console.log("\n=== Function Factories Demo ===");

function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log("double(5):", double(5));       // 10
console.log("triple(5):", triple(5));       // 15
console.log("quadruple(5):", quadruple(5)); // 20

// Function factory pattern - Functions that create other functions
// - Greeter factory creates customized greeting functions
// - Each returned function "remembers" its greeting via closure
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");
const sayHey = createGreeter("Hey");

console.log(sayHello("Alice")); // Hello, Alice!
console.log(sayHi("Bob"));      // Hi, Bob!
console.log(sayHey("Charlie")); // Hey, Charlie!

// Validator factory
function createValidator(min, max) {
  return function(value) {
    return value >= min && value <= max;
  };
}

const isValidAge = createValidator(0, 120);
const isValidPercentage = createValidator(0, 100);

console.log("isValidAge(25):", isValidAge(25));           // true
console.log("isValidAge(150):", isValidAge(150));         // false
console.log("isValidPercentage(50):", isValidPercentage(50)); // true


// ============================================================================
// 10. CLOSURES - PARTIAL APPLICATION
// ============================================================================
/**
 * Partial Application - Pre-filling function arguments
 * 
 * Characteristics:
 * - Creates new function with some arguments preset
 * - Reduces function arity
 * - Enables function specialization
 * 
 * Use Cases:
 * - Creating specialized functions
 * - Reducing repetition
 * - Function composition
 */

console.log("\n=== Partial Application Demo ===");

function add(a, b, c) {
  return a + b + c;
}

function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const add5 = partial(add, 5);
console.log("add5(10, 15):", add5(10, 15)); // 30

const add5And10 = partial(add, 5, 10);
console.log("add5And10(15):", add5And10(15)); // 30

// Practical example: logging with preset prefix
function log(level, timestamp, message) {
  console.log(`[${level}] ${timestamp}: ${message}`);
}

const errorLog = partial(log, "ERROR");
const infoLog = partial(log, "INFO");

errorLog(new Date().toISOString(), "Something went wrong");
infoLog(new Date().toISOString(), "Operation completed");


// ============================================================================
// 11. CLOSURES - MEMOIZATION
// ============================================================================
/**
 * Memoization - Caching function results for performance
 * 
 * Characteristics:
 * - Stores computed results
 * - Returns cached result for same input
 * - Uses closure to maintain cache
 * 
 * Use Cases:
 * - Expensive computations
 * - Recursive functions
 * - API call caching
 * 
 * Common Pitfalls:
 * - Memory usage grows with unique inputs
 * - Only works for pure functions
 */

console.log("\n=== Memoization Demo ===");

function memoize(fn) {
  const cache = {}; // Private cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log("Returning cached result for:", args);
      return cache[key];
    }
    
    console.log("Computing result for:", args);
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

// Expensive fibonacci calculation
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log("First call:");
console.log("fib(10):", memoizedFib(10));

console.log("\nSecond call (cached):");
console.log("fib(10):", memoizedFib(10));

// Memoized factorial
const factorial = memoize(function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
});

console.log("\nFactorial:");
console.log("factorial(5):", factorial(5));
console.log("factorial(5) again:", factorial(5));


// ============================================================================
// 12. MODULE PATTERN
// ============================================================================
/**
 * Module Pattern - Encapsulation using closures and IIFE (ES3)
 * 
 * Characteristics:
 * - Creates private and public members
 * - Uses IIFE to create scope
 * - Returns public API
 * - Prevents global namespace pollution
 * 
 * Use Cases:
 * - Code organization
 * - Encapsulation
 * - Creating libraries
 * 
 * Common Pitfalls:
 * - Cannot access private members for testing
 * - ES6 modules are now preferred
 */

console.log("\n=== Module Pattern Demo ===");

const Calculator = (function() {
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
    }
  };
})();

Calculator.add(10).multiply(2).subtract(5);
console.log("Result:", Calculator.getResult()); // 15
Calculator.reset();

// Revealing module pattern
const Counter = (function() {
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
  
  // Reveal public methods
  return {
    increment,
    decrement,
    getCount
  };
})();

Counter.increment();
Counter.increment();
console.log("Counter:", Counter.getCount()); // 2


// ============================================================================
// COMMON PITFALLS & BEST PRACTICES
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Closure in loops with var
console.log("Pitfall 1: Closure in loops");
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log("var i:", i); // All print 3
  }, 100);
}

// Solution: Use let
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log("let j:", j); // Prints 0, 1, 2
  }, 100);
}

// Pitfall 2: Accidental global variables
console.log("\nPitfall 2: Accidental globals");
function createAccidentalGlobal() {
  accidentalGlobal = "Oops!"; // No var/let/const
}
// Use strict mode to prevent this

// Pitfall 3: Memory leaks with closures
console.log("\nPitfall 3: Memory leaks");
function createLeak() {
  const largeData = new Array(1000000).fill("data");
  
  return function() {
    // This closure keeps largeData in memory
    console.log(largeData[0]);
  };
}
// Solution: Only close over what you need

// Pitfall 4: Modifying loop variable in closure
console.log("\nPitfall 4: Modifying loop variable");
const functions = [];
for (let i = 0; i < 3; i++) {
  functions.push(function() {
    return i;
  });
}
// Each function has its own 'i' with let

console.log("\n=== Best Practices ===");
console.log(`
1. USE let AND const INSTEAD OF var
   ✅ let and const are block-scoped
   ✅ Prevents hoisting confusion
   ✅ Prevents accidental globals

2. MINIMIZE GLOBAL VARIABLES
   ✅ Use modules or IIFE
   ✅ Prevents naming conflicts
   ✅ Easier to maintain

3. USE CLOSURES FOR ENCAPSULATION
   ✅ Create private variables
   ✅ Expose only necessary API
   ✅ Better code organization

4. BE AWARE OF MEMORY IMPLICATIONS
   ✅ Closures keep variables in memory
   ✅ Only close over what you need
   ✅ Consider memory usage in loops

5. USE STRICT MODE
   ✅ Prevents accidental globals
   ✅ Catches common mistakes
   ✅ Better error messages

6. AVOID DEEP NESTING
   ✅ Harder to understand
   ✅ Performance impact
   ✅ Refactor into smaller functions

7. USE DESCRIPTIVE VARIABLE NAMES
   ✅ Avoid shadowing when possible
   ✅ Makes code more readable
   ✅ Easier to debug

8. UNDERSTAND THE SCOPE CHAIN
   ✅ Know where variables are defined
   ✅ Understand variable lookup
   ✅ Avoid unintended shadowing

9. USE IIFE FOR INITIALIZATION
   ✅ Creates isolated scope
   ✅ Prevents global pollution
   ✅ Runs immediately

10. PREFER ES6 MODULES OVER MODULE PATTERN
    ✅ Native language support
    ✅ Better tooling
    ✅ Static analysis
`);


// ============================================================================
// SCOPE AND CLOSURES SUMMARY
// ============================================================================
console.log("\n=== SCOPE TYPES COMPARISON ===");
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
`);
