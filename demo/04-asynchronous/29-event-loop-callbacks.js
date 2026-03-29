// Event Loop and Callbacks Demo
// 📘 For TypeScript comparison, see: 14-event-loop-callbacks-ts-comparison.ts

// ============================================
// 1. CALL STACK BASICS
// ============================================

/**
 * Call Stack - LIFO (Last In, First Out) data structure
 * 
 * Characteristics:
 * - Tracks function execution
 * - Synchronous execution
 * - One thing at a time (single-threaded)
 * - Stack frames added on function call, removed on return
 * 
 * Use Cases:
 * - Understanding execution order
 * - Debugging stack traces
 * - Understanding recursion limits
 */

console.log("=== Call Stack Basics Demo ===\n");

function first() {
  console.log("1. Inside first()");
  second();
  console.log("5. Back in first()");
}

function second() {
  console.log("2. Inside second()");
  third();
  console.log("4. Back in second()");
}

function third() {
  console.log("3. Inside third()");
}

console.log("Call stack execution:");
first();
console.log("6. Back in global scope");

// Stack visualization:
// Step 1: [global] -> [first]
// Step 2: [global] -> [first] -> [second]
// Step 3: [global] -> [first] -> [second] -> [third]
// Step 4: [global] -> [first] -> [second]
// Step 5: [global] -> [first]
// Step 6: [global]

// ============================================
// 2. CALLBACK FUNCTIONS
// ============================================

/**
 * Callback Functions - Functions passed as arguments
 * 
 * ES Specification: ES3 (concept)
 * 
 * Characteristics:
 * - Functions are first-class citizens
 * - Can be passed as arguments
 * - Executed at a later time
 * - Foundation of asynchronous JavaScript
 * 
 * Use Cases:
 * - Event handlers
 * - Asynchronous operations
 * - Array methods (map, filter, etc.)
 * - Higher-order functions
 * 
 * Common Pitfalls:
 * - Callback hell (nested callbacks)
 * - Error handling complexity
 * - 'this' binding issues
 */

console.log("\n=== Callback Functions Demo ===\n");

// Synchronous callback
function processData(data, callback) {
  console.log("Processing:", data);
  const result = data.toUpperCase();
  callback(result);
}

processData("hello", (result) => {
  console.log("Callback result:", result);
});

// Asynchronous callback
function fetchData(callback) {
  console.log("\nFetching data...");
  setTimeout(() => {
    const data = { id: 1, name: "User" };
    callback(null, data); // Node.js style: error-first callback
  }, 100);
}

fetchData((error, data) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data received:", data);
  }
});

// Array method callbacks
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num, index) => {
  console.log(`Item ${index}: ${num}`);
});

const doubled = numbers.map(num => num * 2);
console.log("Doubled:", doubled);

// ============================================
// 3. SETTIMEOUT AND SETINTERVAL
// ============================================

/**
 * setTimeout - Execute function after delay
 * setInterval - Execute function repeatedly
 * 
 * Characteristics:
 * - Asynchronous execution
 * - Minimum delay, not guaranteed exact timing
 * - Returns timer ID for cancellation
 * - Part of Web APIs (browser) / Node.js APIs
 * 
 * Use Cases:
 * - Delayed execution
 * - Debouncing
 * - Polling
 * - Animations
 * 
 * Common Pitfalls:
 * - Delay is minimum, not exact
 * - Forgetting to clear intervals
 * - 'this' binding in callbacks
 */

console.log("\n=== setTimeout and setInterval Demo ===\n");

// setTimeout - single execution
console.log("Before setTimeout");

setTimeout(() => {
  console.log("setTimeout: Executed after 100ms");
}, 100);

console.log("After setTimeout (but before execution)");

// setTimeout with arguments
setTimeout((name, age) => {
  console.log(`setTimeout with args: ${name}, ${age}`);
}, 150, "Alice", 30);

// Canceling setTimeout
const timeoutId = setTimeout(() => {
  console.log("This won't execute");
}, 200);

clearTimeout(timeoutId);
console.log("setTimeout canceled");

// setInterval - repeated execution
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`setInterval: Execution ${count}`);
  
  if (count >= 3) {
    clearInterval(intervalId);
    console.log("setInterval stopped");
  }
}, 100);

// ============================================
// 4. EVENT LOOP MECHANISM
// ============================================

/**
 * Event Loop - Coordinates execution of code
 * 
 * Components:
 * 1. Call Stack - Executes synchronous code
 * 2. Web APIs / Node APIs - Handle async operations
 * 3. Callback Queue (Task Queue) - Holds callbacks
 * 4. Microtask Queue - Holds Promise callbacks
 * 5. Event Loop - Moves tasks from queues to stack
 * 
 * Process:
 * 1. Execute synchronous code on call stack
 * 2. When async operation completes, callback goes to queue
 * 3. When call stack is empty, event loop checks queues
 * 4. Microtasks execute before macrotasks
 * 5. Repeat
 */

console.log("\n=== Event Loop Mechanism Demo ===\n");

console.log("1. Synchronous code");

setTimeout(() => {
  console.log("4. setTimeout callback (macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise callback (microtask)");
});

console.log("2. More synchronous code");

// Execution order:
// 1. Synchronous code executes first
// 2. More synchronous code
// 3. Promise callback (microtask queue)
// 4. setTimeout callback (macrotask queue)

// ============================================
// 5. CALLBACK QUEUE (TASK QUEUE)
// ============================================

/**
 * Callback Queue (Macrotask Queue):
 * 
 * - Holds callbacks from setTimeout, setInterval, I/O
 * - FIFO (First In, First Out)
 * - Processed after call stack is empty
 * - Processed after microtask queue
 * 
 * Examples of macrotasks:
 * - setTimeout
 * - setInterval
 * - setImmediate (Node.js)
 * - I/O operations
 * - UI rendering
 */

console.log("\n=== Callback Queue Demo ===\n");

console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0);
setTimeout(() => console.log("Timeout 2"), 0);
setTimeout(() => console.log("Timeout 3"), 0);

console.log("End");

// Output order:
// Start
// End
// Timeout 1
// Timeout 2
// Timeout 3

// ============================================
// 6. MICROTASKS VS MACROTASKS
// ============================================

/**
 * Microtasks vs Macrotasks:
 * 
 * Microtasks (higher priority):
 * - Promise callbacks (.then, .catch, .finally)
 * - queueMicrotask()
 * - MutationObserver
 * - Process.nextTick (Node.js)
 * 
 * Macrotasks (lower priority):
 * - setTimeout
 * - setInterval
 * - setImmediate (Node.js)
 * - I/O operations
 * 
 * Execution order:
 * 1. Execute all synchronous code
 * 2. Execute ALL microtasks
 * 3. Execute ONE macrotask
 * 4. Repeat from step 2
 */

console.log("\n=== Microtasks vs Macrotasks Demo ===\n");

console.log("1. Sync start");

setTimeout(() => console.log("5. Timeout (macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("3. Promise 1 (microtask)"))
  .then(() => console.log("4. Promise 2 (microtask)"));

console.log("2. Sync end");

// Detailed execution order example
setTimeout(() => {
  console.log("\n6. Macrotask 1");
  Promise.resolve().then(() => console.log("7. Microtask inside macrotask"));
}, 0);

setTimeout(() => {
  console.log("8. Macrotask 2");
}, 0);

// ============================================
// 7. EXECUTION ORDER EXAMPLES
// ============================================

console.log("\n=== Execution Order Examples ===\n");

// Example 1: Complex execution order
console.log("Example 1:");

setTimeout(() => console.log("A: setTimeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("B: Promise 1");
    setTimeout(() => console.log("C: setTimeout inside Promise"), 0);
  })
  .then(() => console.log("D: Promise 2"));

setTimeout(() => console.log("E: setTimeout 2"), 0);

console.log("F: Synchronous");

// Order: F, B, D, A, E, C

// Example 2: Nested callbacks
setTimeout(() => {
  console.log("\nExample 2: Nested setTimeout");
  
  setTimeout(() => {
    console.log("  Nested level 1");
    
    setTimeout(() => {
      console.log("    Nested level 2");
    }, 0);
  }, 0);
}, 500);

// Example 3: Promise vs setTimeout
setTimeout(() => {
  console.log("\nExample 3:");
  console.log("  1. setTimeout");
  
  Promise.resolve().then(() => {
    console.log("  2. Promise (runs before next setTimeout)");
  });
  
  setTimeout(() => {
    console.log("  3. Next setTimeout");
  }, 0);
}, 600);

// ============================================
// 8. CALLBACK HELL PROBLEM
// ============================================

/**
 * Callback Hell - Deeply nested callbacks
 * 
 * Problems:
 * - Hard to read and maintain
 * - Difficult error handling
 * - Hard to reason about flow
 * - Pyramid of doom
 * 
 * Solutions:
 * - Named functions
 * - Promises
 * - Async/await
 */

console.log("\n=== Callback Hell Demo ===\n");

// ❌ Callback hell example
function callbackHell() {
  console.log("Callback hell example:");
  
  setTimeout(() => {
    console.log("  Step 1");
    
    setTimeout(() => {
      console.log("  Step 2");
      
      setTimeout(() => {
        console.log("  Step 3");
        
        setTimeout(() => {
          console.log("  Step 4 - This is hard to read!");
        }, 100);
      }, 100);
    }, 100);
  }, 100);
}

callbackHell();

// ✅ Solution 1: Named functions
function step1() {
  console.log("\nNamed functions solution:");
  console.log("  Step 1");
  setTimeout(step2, 100);
}

function step2() {
  console.log("  Step 2");
  setTimeout(step3, 100);
}

function step3() {
  console.log("  Step 3");
  setTimeout(step4, 100);
}

function step4() {
  console.log("  Step 4 - Much better!");
}

setTimeout(step1, 500);

// ✅ Solution 2: Promises
function promiseSolution() {
  console.log("\nPromise solution:");
  
  return new Promise(resolve => setTimeout(() => {
    console.log("  Step 1");
    resolve();
  }, 100))
    .then(() => new Promise(resolve => setTimeout(() => {
      console.log("  Step 2");
      resolve();
    }, 100)))
    .then(() => new Promise(resolve => setTimeout(() => {
      console.log("  Step 3");
      resolve();
    }, 100)))
    .then(() => new Promise(resolve => setTimeout(() => {
      console.log("  Step 4 - Clean and flat!");
      resolve();
    }, 100)));
}

setTimeout(() => promiseSolution(), 1000);

// ✅ Solution 3: Async/await (best)
async function asyncAwaitSolution() {
  console.log("\nAsync/await solution:");
  
  await new Promise(resolve => setTimeout(() => {
    console.log("  Step 1");
    resolve();
  }, 100));
  
  await new Promise(resolve => setTimeout(() => {
    console.log("  Step 2");
    resolve();
  }, 100));
  
  await new Promise(resolve => setTimeout(() => {
    console.log("  Step 3");
    resolve();
  }, 100));
  
  await new Promise(resolve => setTimeout(() => {
    console.log("  Step 4 - Most readable!");
    resolve();
  }, 100));
}

setTimeout(() => asyncAwaitSolution(), 1500);

// ============================================
// 9. EVENT LOOP VISUALIZATION
// ============================================

console.log("\n=== Event Loop Visualization ===\n");

console.log(`
Event Loop Architecture:

┌───────────────────────────┐
│      Call Stack           │  ← Executes synchronous code
│  [function3]              │
│  [function2]              │
│  [function1]              │
│  [global]                 │
└───────────────────────────┘
         ↑
         │ (when stack is empty)
         │
┌────────┴──────────────────┐
│     Event Loop            │  ← Monitors queues and stack
└────────┬──────────────────┘
         │
         ↓
┌───────────────────────────┐
│   Microtask Queue         │  ← Higher priority
│  [Promise callback]       │
│  [queueMicrotask]         │
└───────────────────────────┘
         ↓
┌───────────────────────────┐
│   Macrotask Queue         │  ← Lower priority
│  [setTimeout callback]    │
│  [setInterval callback]   │
│  [I/O callback]           │
└───────────────────────────┘
         ↑
         │
┌────────┴──────────────────┐
│    Web APIs / Node APIs   │  ← Handle async operations
│  - setTimeout             │
│  - fetch                  │
│  - DOM events             │
│  - File I/O               │
└───────────────────────────┘

Execution Flow:
1. Execute all synchronous code on call stack
2. When async operation starts, it goes to Web APIs
3. When async operation completes, callback goes to queue
4. Event loop checks: Is call stack empty?
5. If yes, move ALL microtasks to call stack (one by one)
6. Then move ONE macrotask to call stack
7. Repeat from step 4
`);

// ============================================
// 10. PRACTICAL EXAMPLES
// ============================================

console.log("\n=== Practical Examples ===\n");

// Example 1: Debouncing
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const debouncedLog = debounce((msg) => {
  console.log("Debounced:", msg);
}, 200);

console.log("Example 1: Debouncing");
debouncedLog("Call 1");
debouncedLog("Call 2");
debouncedLog("Call 3"); // Only this will execute

// Example 2: Throttling
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

const throttledLog = throttle((msg) => {
  console.log("Throttled:", msg);
}, 200);

console.log("\nExample 2: Throttling");
throttledLog("Call 1"); // Executes
throttledLog("Call 2"); // Ignored
throttledLog("Call 3"); // Ignored

// Example 3: Polling
function poll(fn, interval, maxAttempts) {
  let attempts = 0;
  
  const intervalId = setInterval(() => {
    attempts++;
    console.log(`Polling attempt ${attempts}`);
    
    const result = fn();
    
    if (result || attempts >= maxAttempts) {
      clearInterval(intervalId);
      console.log(result ? "Success!" : "Max attempts reached");
    }
  }, interval);
}

setTimeout(() => {
  console.log("\nExample 3: Polling");
  let count = 0;
  poll(() => {
    count++;
    return count >= 3; // Success on 3rd attempt
  }, 100, 5);
}, 2000);

// Example 4: Sequential async operations
function sequentialAsync(tasks, callback) {
  let index = 0;
  const results = [];
  
  function next() {
    if (index >= tasks.length) {
      callback(null, results);
      return;
    }
    
    const task = tasks[index];
    index++;
    
    task((error, result) => {
      if (error) {
        callback(error);
        return;
      }
      
      results.push(result);
      next();
    });
  }
  
  next();
}

setTimeout(() => {
  console.log("\nExample 4: Sequential async operations");
  
  const tasks = [
    (cb) => setTimeout(() => cb(null, "Task 1"), 100),
    (cb) => setTimeout(() => cb(null, "Task 2"), 100),
    (cb) => setTimeout(() => cb(null, "Task 3"), 100)
  ];
  
  sequentialAsync(tasks, (error, results) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("All tasks completed:", results);
    }
  });
}, 2500);

// ============================================
// 11. COMMON PITFALLS & BEST PRACTICES
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// Pitfall 1: 'this' binding in callbacks
const obj = {
  name: "Object",
  
  // ❌ Regular function loses 'this'
  regularCallback: function() {
    setTimeout(function() {
      console.log("Pitfall 1 - Regular function this:", this); // undefined or global
    }, 100);
  },
  
  // ✅ Arrow function preserves 'this'
  arrowCallback: function() {
    setTimeout(() => {
      console.log("Pitfall 1 - Arrow function this:", this.name); // "Object"
    }, 100);
  }
};

setTimeout(() => {
  obj.regularCallback();
  obj.arrowCallback();
}, 3000);

// Pitfall 2: Forgetting to clear intervals
console.log("\nPitfall 2: Memory leaks from intervals");

// ❌ Interval never cleared
let leakyCount = 0;
const leakyInterval = setInterval(() => {
  leakyCount++;
  if (leakyCount >= 3) {
    console.log("  ❌ Should stop but interval not cleared");
    // Missing: clearInterval(leakyInterval);
  }
}, 100);

// Clear it after demo
setTimeout(() => clearInterval(leakyInterval), 500);

// ✅ Always clear intervals
let properCount = 0;
const properInterval = setInterval(() => {
  properCount++;
  if (properCount >= 3) {
    clearInterval(properInterval);
    console.log("  ✅ Interval properly cleared");
  }
}, 100);

// Pitfall 3: Assuming setTimeout is exact
console.log("\nPitfall 3: setTimeout timing");

const start = Date.now();
setTimeout(() => {
  const elapsed = Date.now() - start;
  console.log(`  Requested 100ms, actual: ${elapsed}ms (may vary)`);
}, 100);

// Pitfall 4: Blocking the event loop
console.log("\nPitfall 4: Blocking event loop");

setTimeout(() => console.log("  This will be delayed"), 0);

// ❌ Blocking operation
const blockStart = Date.now();
while (Date.now() - blockStart < 200) {
  // Blocking the event loop
}

console.log("  Blocking operation completed");
// The setTimeout above will only execute after this

// ============================================
// BEST PRACTICES SUMMARY
// ============================================

setTimeout(() => {
  console.log("\n=== Best Practices Summary ===\n");
  console.log(`
1. UNDERSTAND the event loop and execution order
2. USE arrow functions to preserve 'this' in callbacks
3. ALWAYS clear intervals and timeouts when done
4. AVOID callback hell - use Promises or async/await
5. USE error-first callbacks (error, data) for consistency
6. DON'T block the event loop with long synchronous operations
7. REMEMBER microtasks execute before macrotasks
8. USE debouncing/throttling for frequent events
9. BE AWARE setTimeout delay is minimum, not exact
10. PREFER Promises/async-await over callbacks for async code
11. USE named functions instead of anonymous callbacks for better debugging
12. UNDERSTAND the difference between microtasks and macrotasks
  `);
}, 3500);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. CALLBACK FUNCTION TYPES
   JS:  function process(callback) { callback(result); }
   TS:  function process(callback: (result: string) => void): void {
          callback(result);
        }
   
   Benefits:
   - Type-safe callback parameters
   - Better IDE autocomplete
   - Compile-time error checking

2. ERROR-FIRST CALLBACK TYPES
   JS:  function fetch(callback) { callback(error, data); }
   TS:  function fetch(callback: (error: Error | null, data?: Data) => void): void {
          callback(error, data);
        }
   
   Benefits:
   - Explicit error handling
   - Type-safe data parameter
   - Better error messages

3. SETTIMEOUT RETURN TYPE
   JS:  const id = setTimeout(() => {}, 100);
   TS:  const id: NodeJS.Timeout = setTimeout(() => {}, 100);
        // or: const id: number = setTimeout(() => {}, 100); (browser)
   
   Benefits:
   - Type-safe timer IDs
   - Platform-specific types
   - Better type checking

4. GENERIC CALLBACK TYPES
   JS:  function map(array, callback) { return array.map(callback); }
   TS:  function map<T, U>(
          array: T[],
          callback: (item: T, index: number) => U
        ): U[] {
          return array.map(callback);
        }
   
   Benefits:
   - Type-safe transformations
   - Generic type preservation
   - Better type inference

5. EVENT HANDLER TYPES
   JS:  element.addEventListener('click', (event) => {});
   TS:  element.addEventListener('click', (event: MouseEvent) => {});
   
   Benefits:
   - Type-safe event objects
   - Better IDE support
   - Prevents runtime errors

6. PROMISE CALLBACK TYPES
   JS:  promise.then(result => {}, error => {});
   TS:  promise.then(
          (result: Data) => {},
          (error: Error) => {}
        );
   
   Benefits:
   - Type-safe Promise callbacks
   - Better error handling
   - Type inference

⚠️ COMMON CONFUSION POINTS:

1. CALLBACK PARAMETER ORDER
   - Error-first callbacks: (error, data)
   - Array methods: (item, index, array)
   - Event handlers: (event)
   
   Be consistent with parameter order!

2. VOID VS UNDEFINED RETURN
   - void: Callback doesn't return meaningful value
   - undefined: Callback explicitly returns undefined
   
   type Callback = () => void; // ✅ Flexible
   type Callback = () => undefined; // ❌ Too strict

3. OPTIONAL CALLBACK PARAMETERS
   - Use ? for optional parameters
   - Provide default values when appropriate
   
   function process(callback?: (data: string) => void): void {
     if (callback) callback("data");
   }

4. THIS BINDING IN CALLBACKS
   - Arrow functions inherit 'this'
   - Regular functions have dynamic 'this'
   
   class Component {
     name = "Component";
     
     // ✅ Arrow function preserves 'this'
     onClick = () => {
       console.log(this.name);
     };
     
     // ❌ Regular function loses 'this'
     onClickBad() {
       setTimeout(function() {
         console.log(this.name); // Error!
       }, 100);
     }
   }

5. TIMER ID TYPES
   - Browser: number
   - Node.js: NodeJS.Timeout
   
   Use ReturnType<typeof setTimeout> for cross-platform code

6. CALLBACK HELL TYPE SAFETY
   - TypeScript doesn't prevent callback hell
   - Still need to use Promises/async-await
   - Type safety doesn't equal code quality

📘 See 14-event-loop-callbacks-ts-comparison.ts for detailed examples!
*/
