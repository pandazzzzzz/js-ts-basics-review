// Closures Basics Demo
// 📘 For TypeScript comparison, see: 13-3-closures-basics-ts-comparison.ts

// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file covers the fundamentals of closures:
// 1. Understanding what closures are
// 2. How closures enable data privacy
// 3. Closure memory and reference behavior
// 4. Practical use cases for closures

// ============================================
// Table of Contents
// ============================================

// 1. What is a Closure?
// 2. Closure Principles
// 3. Closures for Data Privacy
// 4. Closure Memory Behavior
// 5. Common Closure Patterns

// ============================================

console.log("=== Closures Basics Demo ===\n");

// ============================================
// 1. WHAT IS A CLOSURE?
// ============================================
/**
 * Closure - Function + its lexical environment (ES3)
 *
 * Definition:
 * A closure is the combination of a function bundled together
 * (enclosed) with references to its surrounding state (the lexical
 * environment). In other words, a closure gives you access to an
 * outer function's scope from an inner function.
 *
 * Key Characteristics:
 * - Inner function retains access to outer function variables
 * - Even after outer function returns
 * - Each closure has its own copy of outer variables
 * - Created at function definition time
 *
 * When Closures Are Created:
 * - When a function is defined inside another function
 * - The inner function captures the outer scope
 * - This captured scope is the "closure"
 *
 * Visual Analogy:
 * Backpack - Inner function carries a "backpack" with references
 * to variables from the outer function's scope, even when the outer
 * function has finished executing.
 */

console.log("=== 1. What is a Closure? ===");

function outerFunction() {
  const outerVar = "I'm from outer scope";

  function innerFunction() {
    // This inner function "closes over" outerVar
    console.log("Inner can access:", outerVar);
  }

  return innerFunction;
}

// outerFunction has finished executing
const myClosure = outerFunction();

// But myClosure still has access to outerVar!
console.log("Calling closure after outer function returned:");
myClosure(); // Prints: "Inner can access: I'm from outer scope"

// Explanation:
// - outerFunction() created an inner function
// - innerFunction captured (closed over) outerVar
// - outerFunction returned innerFunction
// - outerVar should have been garbage collected
// - But the closure keeps it alive!

// ============================================
// 2. CLOSURE PRINCIPLES
// ============================================
/**
 * Closure Core Principles
 *
 * Principle 1: Lexical Scope Binding
 * - Closures remember the environment in which they were created
 * - Not the environment in which they are called
 *
 * Principle 2: Multiple Closures Share Scope
 * - Multiple closures created in same scope share variables
 * - All closures see the same variable (mutable)
 *
 * Principle 3: Each Closure is Independent
 * - Closures created in different calls have independent state
 * - They don't share variables with other closure instances
 */

console.log("\n=== 2. Closure Principles ===");

// Principle 1: Lexical scope binding
const x = "global x";

function makeClosure() {
  const x = "local x";
  return function () {
    return x; // Returns "local x" (lexical scope, not dynamic)
  };
}

const closure1 = makeClosure();
console.log("Principle 1 (Lexical binding):", closure1()); // "local x"

// Principle 2: Multiple closures share scope
function sharedScopeExample() {
  let shared = 0;

  return {
    increment: function () {
      return ++shared;
    },
    decrement: function () {
      return --shared;
    },
    get: function () {
      return shared;
    },
  };
}

const shared = sharedScopeExample();
console.log("\nPrinciple 2 (Shared scope):");
console.log("Initial:", shared.get()); // 0
console.log("After increment:", shared.increment()); // 1
console.log("After increment:", shared.increment()); // 2
console.log("After decrement:", shared.decrement()); // 1

// Both methods access the same 'shared' variable!

// Principle 3: Independent closures
function createCounter() {
  let count = 0;
  return function () {
    return ++count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log("\nPrinciple 3 (Independent closures):");
console.log("Counter1:", counter1()); // 1
console.log("Counter1:", counter1()); // 2
console.log("Counter2:", counter2()); // 1 (separate counter!)

// ============================================
// 3. CLOSURES FOR DATA PRIVACY
// ============================================
/**
 * Closure Data Privacy - Encapsulation without private keywords (ES3)
 *
 * Before ES2022 (# private fields), closures were the ONLY way
 * to create truly private variables in JavaScript.
 *
 * Characteristics:
 * - Variables declared in outer function are private
 * - Only inner functions can access them
 * - Cannot be accessed or modified from outside
 *
 * Pattern:
 * 1. Create outer function with private variables
 * 2. Return object with methods that use those variables
 * 3. Variables are accessible only through returned methods
 *
 * Use Cases:
 * - Bank account balances
 * - Internal state management
 * - Encapsulated configuration
 */

console.log("\n=== 3. Closures for Data Privacy ===");

function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable (not accessible outside)

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
    },
  };
}

const account = createBankAccount(100);
console.log("Initial balance:", account.getBalance()); // 100
console.log("After deposit(50):", account.deposit(50)); // 150
console.log("After withdraw(30):", account.withdraw(30)); // 120

// console.log(account.balance); // undefined - private!
console.log("⚠️  Cannot access account.balance directly");

// Each closure has independent state
const account1 = createBankAccount(100);
const account2 = createBankAccount(200);
account1.deposit(50);

console.log("\nIndependent account instances:");
console.log("Account1 balance:", account1.getBalance()); // 150
console.log("Account2 balance:", account2.getBalance()); // 200

// ============================================
// 4. CLOSURE MEMORY BEHAVIOR
// ============================================
/**
 * Closure Memory - How closures affect garbage collection
 *
 * Important Concepts:
 * - Closures keep referenced variables in memory
 * - Variables NOT referenced are garbage collected
 * - Closures can cause memory leaks if not careful
 * - Each closure stores references to variables it uses
 *
 * Memory Management:
 * - Closure is freed when no references remain
 * - Captured variables freed with closure
 * - Large objects in closures = memory pressure
 *
 * Common Pitfalls:
 * - Closing over large objects unnecessarily
 * - Creating closures in loops (historical issue)
 * - Not releasing references when done
 */

console.log("\n=== 4. Closure Memory Behavior ===");

// Closures store only what they use
function outer() {
  const largeObject = { data: new Array(1000).fill("x") };
  const smallValue = 42;

  // This inner function only uses smallValue
  function inner() {
    return smallValue * 2;
  }

  // largeObject may be garbage collected (depends on engine optimization)
  return inner;
}

const efficientClosure = outer();
console.log("Efficient closure uses only needed variables:", efficientClosure()); // 84

// Memory leak example
function createLeak() {
  const largeData = new Array(100000).fill("data");

  return function () {
    // This closure keeps largeData in memory!
    return largeData.length;
  };
}

const leak = createLeak();
console.log("\nMemory leak potential:");
console.log("Closure accessing largeData:", leak());
console.log("⚠️  largeData stays in memory as long as 'leak' exists");

// Better: only capture what's needed
function noLeak() {
  const largeData = new Array(100000).fill("data");
  const length = largeData.length; // Capture only the value

  return function () {
    return length; // Only 'length' is captured
  };
}

const efficient = noLeak();
console.log("Efficient closure captures only length:", efficient());

// ============================================
// 5. COMMON CLOSURE PATTERNS
// ============================================
/**
 * Closure Use Cases - Practical patterns
 *
 * Pattern 1: State Management
 * - Encapsulated state with controlled access
 * - Private mutations through methods
 *
 * Pattern 2: Function Factories
 * - Create customized functions
 * - Pre-configure behavior
 *
 * Pattern 3: Event Handlers
 * - Preserve context in callbacks
 * - Access outer scope in async operations
 *
 * Pattern 4: Module Pattern (see 13-4 for details)
 * - Private and public API
 * - Namespace isolation
 */

console.log("\n=== 5. Common Closure Patterns ===");

// Pattern 1: State management (simple store)
function createStore(initialState) {
  let state = initialState;
  const listeners = [];

  return {
    getState() {
      return state;
    },

    setState(newState) {
      state = newState;
      // Notify all listeners
      listeners.forEach(listener => listener(state));
    },

    subscribe(listener) {
      listeners.push(listener);
      // Return unsubscribe function
      return function () {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
  };
}

const store = createStore({ count: 0, name: "Demo" });

const unsubscribe = store.subscribe(state => {
  console.log("State updated:", state);
});

console.log("\nPattern 1: Store/State Management");
store.setState({ count: 1, name: "Demo" }); // Triggers listener
unsubscribe(); // Clean up

// Pattern 2: Function factory (see 13-4 for more)
function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("\nPattern 2: Function Factories");
console.log("double(5):", double(5)); // 10
console.log("triple(5):", triple(5)); // 15

// Pattern 3: Event handler with context
function createButtonHandler(userId) {
  return function (event) {
    // This closure remembers userId
    console.log(`Button clicked by user ${userId}`);
    console.log(`Event type: ${event.type}`);
  };
}

const handleUserClick = createButtonHandler(42);
console.log("\nPattern 3: Event Handlers");
console.log("Closure preserves userId:", 42);

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log(`
Pitfall 1: Loop closures (historical var problem)
❌ for (var i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), 100);
   }
   // All timeouts print 5 (shared var)

✅ for (let i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), 100);
   }
   // Prints 0, 1, 2, 3, 4 (let creates new binding)
   // Or use IIFE with var to capture current value

Pitfall 2: Memory leaks with large closures
❌ function process(data) {
     return function() { return data; };  // Captures entire data
   }
   // Keep large object in memory unnecessarily

✅ function process(data) {
     const result = processData(data);
     return function() { return result; };  // Capture only result
   }

Pitfall 3: Assuming closure captures by value
❌ for (let i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), i * 100);
   }
   // Captures 'i' by reference (let ensures each iteration has own copy)

✅ This is actually CORRECT with let!
   // Each iteration creates new 'i' binding
   // The closure captures that specific binding
`);

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log(`
✅ Use closures for data privacy
   - Encapsulate internal state
   - Expose only necessary methods
   - Prevent direct modification

✅ Close over only what you need
   - Extract specific values from large objects
   - Reduces memory pressure
   - Allows garbage collection

✅ Understand closure lifetime
   - Closures keep variables in memory
   - Release references when done
   - Be careful with long-lived closures

✅ Prefer let in loops for closures
   - Each iteration gets new binding
   - Avoids historical var closure issues
   - More predictable behavior

✅ Use closures for function configuration
   - Create factories with preset parameters
   - Customize behavior without rewriting
   - Maintain lexical scope benefits

✅ Document closure behavior
   - Explain what is captured
   - Note memory implications
   - Help maintainers understand lifetime
`);

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────────────────┬─────────────────────────────────┐
│ Concept               │ Explanation                 │
├─────────────────────────┼─────────────────────────────────┤
│ Closure Definition     │ Function + lexical environment │
│ Data Privacy          │ Private vars before ES2022 #   │
│ Lexical Binding       │ Captures creation-time scope    │
│ Memory Retention      │ Keeps captured vars alive     │
│ Independent State      │ Each closure has own copy     │
│ Shared Scope          │ Multiple closures can share   │
└─────────────────────────┴─────────────────────────────────┘

CLOSURE = Function + References to surrounding scope

Key Insight:
When a function is defined inside another function, it "closes over"
the variables in the outer function's scope, maintaining access to them
even after the outer function has returned.

Primary Use Cases:
• Data privacy and encapsulation
• Function factories and partial application (see 13-4)
• State management
• Event handlers with preserved context
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 13-1-scope-basics.js - Scope fundamentals");
console.log("📘 13-4-closures-patterns.js - Advanced closure patterns");
console.log("📘 16-classes.js - ES2022+ # private fields (modern alternative)");
console.log("📘 27-memory-management.js - Memory management and garbage collection");
console.log("📘 24-function-patterns-advanced.js - Memoization and caching");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 13-3-closures-basics-ts-comparison.ts
*/
