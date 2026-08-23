// Event Loop and Callbacks Demo
// 📘 For TypeScript comparison, see: 29-event-loop-callbacks-ts-comparison.ts
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces the event loop and callback-based execution model that underpins asynchronous JavaScript.
// The examples show how the call stack, queues, and timing interact in practice.

// ============================================
// Table of Contents
// ============================================

// 1. CALL STACK BASICS
// 2. CALLBACK FUNCTIONS
// 3. SETTIMEOUT AND SETINTERVAL
// 4. EVENT LOOP MECHANISM
// 5. CALLBACK QUEUE (TASK QUEUE)
// 6. MICROTASKS VS MACROTASKS
// 7. EXECUTION ORDER EXAMPLES
// 8. CALLBACK HELL PROBLEM
// 9. EVENT LOOP VISUALIZATION
// 10. PRACTICAL EXAMPLES
// 11. COMMON PITFALLS & BEST PRACTICES
// 12. RENDERING AND EVENT LOOP (BROWSER)

// ============================================

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

processData("hello", result => {
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

// setTimeout - single execution (ES1)
console.log("Before setTimeout");

setTimeout(() => {
  console.log("setTimeout: Executed after 100ms");
}, 100);

console.log("After setTimeout (but before execution)");

// setTimeout with arguments
setTimeout(
  (name, age) => {
    console.log(`setTimeout with args: ${name}, ${age}`);
  },
  150,
  "Alice",
  30
);

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

// ✅ Solution 2: Promises (ES6)
function promiseSolution() {
  console.log("\nPromise solution:");

  return new Promise(resolve =>
    setTimeout(() => {
      console.log("  Step 1");
      resolve();
    }, 100)
  )
    .then(
      () =>
        new Promise(resolve =>
          setTimeout(() => {
            console.log("  Step 2");
            resolve();
          }, 100)
        )
    )
    .then(
      () =>
        new Promise(resolve =>
          setTimeout(() => {
            console.log("  Step 3");
            resolve();
          }, 100)
        )
    )
    .then(
      () =>
        new Promise(resolve =>
          setTimeout(() => {
            console.log("  Step 4 - Clean and flat!");
            resolve();
          }, 100)
        )
    );
}

setTimeout(() => promiseSolution(), 1000);

// ✅ Solution 3: Async/await (best)
async function asyncAwaitSolution() {
  // - async/await 简化异步链，比 Promise 链更可读 (ES2017)
  console.log("\nAsync/await solution:");

  await new Promise(resolve =>
    setTimeout(() => {
      console.log("  Step 1");
      resolve();
    }, 100)
  );

  await new Promise(resolve =>
    setTimeout(() => {
      console.log("  Step 2");
      resolve();
    }, 100)
  );

  await new Promise(resolve =>
    setTimeout(() => {
      console.log("  Step 3");
      resolve();
    }, 100)
  );

  await new Promise(resolve =>
    setTimeout(() => {
      console.log("  Step 4 - Most readable!");
      resolve();
    }, 100)
  );
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

// Example 1: Debouncing (see 24.2-debounce-throttle.js for full implementation)
// Debounce delays execution until after a pause — uses the event loop's
// macrotask queue (setTimeout) to coalesce rapid calls into one.
const debouncedLog = (delay => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => console.log("Debounced:", args[0]), delay);
  };
})(200);

console.log(
  "Example 1: Debouncing (coalesces rapid calls via macrotask queue)"
);
debouncedLog("Call 1");
debouncedLog("Call 2");
debouncedLog("Call 3"); // Only this will execute

// Example 2: Throttling (see 24.2-debounce-throttle.js for full implementation)
// Throttle limits execution to once per interval — uses the event loop's
// timer mechanism to enforce a minimum gap between calls.
const throttledLog = (limit => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      console.log("Throttled:", args[0]);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
})(200);

console.log("\nExample 2: Throttling (rate-limits via timer macrotasks)");
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
  poll(
    () => {
      count++;
      return count >= 3; // Success on 3rd attempt
    },
    100,
    5
  );
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
    cb => setTimeout(() => cb(null, "Task 1"), 100),
    cb => setTimeout(() => cb(null, "Task 2"), 100),
    cb => setTimeout(() => cb(null, "Task 3"), 100),
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
  regularCallback: function () {
    setTimeout(function () {
      console.log("Pitfall 1 - Regular function this:", this); // undefined or global
    }, 100);
  },

  // ✅ Arrow function preserves 'this'
  arrowCallback: function () {
    setTimeout(() => {
      console.log("Pitfall 1 - Arrow function this:", this.name); // "Object"
    }, 100);
  },
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
// 12. RENDERING AND EVENT LOOP (BROWSER)
// ============================================

/**
 * Rendering - When browser paints to screen
 *
 * ES Specification: Web API (browser)
 *
 * Characteristics:
 * - Rendering happens after microtasks and before next macrotask
 * - Only if DOM has changes (layout thrashing prevention)
 * - Target: 60fps (16.67ms per frame)
 * - requestAnimationFrame syncs with display refresh rate
 * - Rendering is part of event loop in browsers
 *
 * Event Loop with Rendering:
 * 1. Execute synchronous code
 * 2. Execute all microtasks
 * 3. Perform rendering if needed
 * 4. Execute one macrotask
 * 5. Repeat
 *
 * Use Cases:
 * - Animations
 * - Game loops
 * - Smooth UI updates
 * - Performance optimization
 */

setTimeout(() => {
  console.log("\n=== Rendering and Event Loop Demo ===\n");

  // 12.1 requestAnimationFrame
  console.log("12.1 requestAnimationFrame - Animation frame:");

  let frameCount = 0;
  const startTime = Date.now();

  function animate() {
    frameCount++;
    const elapsed = Date.now() - startTime;

    console.log(`   Frame ${frameCount}, elapsed: ${elapsed}ms`);

    if (frameCount < 5) {
      // Schedule next frame
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(animate);
      } else {
        // Fallback for Node.js: use setTimeout to simulate animation frame (~16.67ms for 60fps)
        setTimeout(animate, 16.67);
      }
    } else {
      const avgFrameTime = elapsed / frameCount;
      console.log(`   Average frame time: ${avgFrameTime.toFixed(2)}ms`);
      console.log(`   Target for 60fps: 16.67ms per frame`);
    }
  }

  // Start animation loop (with browser fallback)
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(animate);
  } else {
    console.log(
      "   Browser-only: requestAnimationFrame not available, using setTimeout fallback"
    );
    animate();
  }

  // 12.2 Microtasks vs Rendering
  setTimeout(() => {
    console.log("\n12.2 Microtasks vs Rendering order:");

    function updateDOM() {
      console.log("   1. DOM update");
    }

    function processMicrotasks() {
      console.log("   2. Microtask processing");
      return Promise.resolve().then(() => {
        console.log("   3. Promise microtask");
      });
    }

    function scheduleMacrotask() {
      console.log("   4. Macrotask scheduled");
      setTimeout(() => {
        console.log("   6. Macrotask execution");
      }, 0);
    }

    // Execution order:
    updateDOM(); // 1. DOM update
    processMicrotasks(); // 2-3. Microtasks run before rendering
    scheduleMacrotask(); // 4-6. Rendering, then macrotask

    console.log("   5. Synchronous code done");
    // Rendering happens here (after microtasks, before macrotask)
  }, 3000);

  // 12.3 Animation loop best practices
  setTimeout(() => {
    console.log("\n12.3 Animation loop best practices:");

    class AnimationLoop {
      constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.isRunning = false;
        this.lastTime = 0;
      }

      start() {
        if (!this.isRunning) {
          this.isRunning = true;
          this.lastTime = performance.now();
          console.log("   ✓ Animation loop started");
          this.loop();
        }
      }

      stop() {
        this.isRunning = false;
        console.log("   ✓ Animation loop stopped");
      }

      loop() {
        if (!this.isRunning) return;

        const currentTime =
          typeof performance !== "undefined" ? performance.now() : Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.updateCallback(deltaTime);

        if (typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(() => this.loop());
        } else {
          // Node.js fallback
          setTimeout(() => this.loop(), 16.67);
        }
      }
    }

    // Example usage
    const animationLoop = new AnimationLoop(deltaTime => {
      // Update animation based on delta time
      // deltaTime is in milliseconds
    });

    animationLoop.start();

    // Stop after 1 second
    setTimeout(() => animationLoop.stop(), 1000);
  }, 5000);

  // 12.4 Rendering timing
  setTimeout(() => {
    console.log("\n12.4 Rendering timing visualization:");

    console.log(`
    Event Loop Cycle with Rendering:
    -------------------------------

    ┌─────────────────────────────────┐
    │ 1. Synchronous Code          │
    │    - Execute all sync code     │
    └──────────────┬───────────────┘
                   │
                   ↓
    ┌─────────────────────────────────┐
    │ 2. Microtasks Queue          │
    │    - Promise callbacks        │
    │    - queueMicrotask()        │
    │    - Process ALL until empty   │
    └──────────────┬───────────────┘
                   │
                   ↓
    ┌─────────────────────────────────┐
    │ 3. Rendering (if DOM changed)│
    │    - Style calculation       │
    │    - Layout calculation      │
    │    - Paint to screen         │
    │    - Composite layers        │
    └──────────────┬───────────────┘
                   │
                   ↓
    ┌─────────────────────────────────┐
    │ 4. Macrotask Queue          │
    │    - setTimeout              │
    │    - setInterval            │
    │    - I/O callbacks         │
    │    - Process ONE at a time   │
    └──────────────┬───────────────┘
                   │
                   └──→ Back to step 1
    `);

    console.log("Key points:");
    console.log("  - Rendering happens AFTER all microtasks");
    console.log("  - Rendering happens BEFORE next macrotask");
    console.log("  - requestAnimationFrame syncs with display refresh");
    console.log("  - Excessive microtasks can delay rendering");
    console.log("  - Layout thrashing triggers unnecessary repaints");
  }, 7000);
}, 4000);

// ============================================
// 12.5 QUEUEMICROTASK, SETIMMEDIATE, AND PROCESS.NEXTTICK
// ============================================
/**
 * Platform-specific microtask/timer APIs
 *
 * queueMicrotask() (Browser + Node.js, ES2020):
 * - Queues a microtask, executed before next macrotask
 * - Similar to Promise.resolve().then(() => ...) but more explicit
 * - No delay — runs as soon as current task completes and stack is empty
 *
 * process.nextTick() (Node.js only):
 * - Queues a callback before any microtasks
 * - Runs after current operation, before Promise callbacks and queueMicrotask
 * - Can cause starvation if used recursively (nextTick queue never empties)
 * - ⚠️ Use setImmediate or queueMicrotask for most cases
 *
 * setImmediate() (Node.js only):
 * - Queues a macrotask in the "check" phase of the Node.js event loop
 * - Runs after I/O callbacks but before close callbacks
 * - Similar to setTimeout(fn, 0) but more efficient (no timer overhead)
 */

console.log("\n=== 12.5 queueMicrotask, setImmediate, process.nextTick ===");

// queueMicrotask — Standard API (Browser + Node.js)
console.log("\nqueueMicrotask (Standard ES2020):");
console.log("  - Adds callback to microtask queue");
console.log("  - Executes before next macrotask (setTimeout, I/O)");
console.log("  - But after the current task completes");

Promise.resolve().then(() => console.log("  Promise.then (microtask)"));
queueMicrotask(() => console.log("  queueMicrotask (also microtask)"));
// Both run in the same microtask phase

// Execution order demonstration
setTimeout(() => {
  console.log("\nExecution order within setTimeout callback:");
  console.log("  1. Synchronous code");

  queueMicrotask(() => console.log("  2. queueMicrotask (microtask)"));
  Promise.resolve().then(() => console.log("  3. Promise.then (microtask)"));

  console.log("  → Microtasks run before next macrotask");
  // Output: 1 → 2 → 3 (sync first, then microtasks by registration order)
}, 100);

// process.nextTick (Node.js only)
console.log("\nprocess.nextTick (Node.js only):");
if (typeof process !== "undefined" && process.nextTick) {
  console.log("  - Runs BEFORE microtasks (Promise, queueMicrotask)");
  console.log("  - Can starve I/O if used recursively");
  console.log("  - Use queueMicrotask or setImmediate instead for most cases");

  // Demonstration (would show nextTick running before Promise):
  // process.nextTick(() => console.log('  1. nextTick (even before Promise)'));
  // Promise.resolve().then(() => console.log('  2. Promise.then'));
  // queueMicrotask(() => console.log('  3. queueMicrotask'));
} else {
  console.log("  ⚠️ Not available in browser environment");
}

// setImmediate (Node.js only)
console.log("\nsetImmediate (Node.js only):");
if (typeof setImmediate !== "undefined") {
  console.log("  - Schedules callback in 'check' phase of event loop");
  console.log("  - Similar to setTimeout(fn, 0) but more efficient");
  console.log("  - Runs after I/O callbacks, before close callbacks");
} else {
  console.log("  ⚠️ Not available in browser environment");
  console.log("  Use setTimeout(fn, 0) as cross-platform alternative");
}

// Comparison table
console.log("\nMicrotask/Timer Comparison:");
console.log(`
  ┌─────────────────────┬──────────────┬──────────────────────┐
  │ API                 │ Queue        │ Platform             │
  ├─────────────────────┼──────────────┼──────────────────────┤
  │ process.nextTick()  │ nextTick     │ Node.js only         │
  │ queueMicrotask()    │ Microtask    │ Browser + Node.js    │
  │ Promise.then()      │ Microtask    │ Browser + Node.js    │
  │ setImmediate()      │ Macrotask    │ Node.js only         │
  │ setTimeout(fn, 0)   │ Macrotask    │ Browser + Node.js    │
  └─────────────────────┴──────────────┴──────────────────────┘
`);

// Best Practices Summary

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

📘 See 29-event-loop-callbacks-ts-comparison.ts for detailed examples!
*/

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 30-promises.js - Promises");
console.log("📘 31-async-await.js - Async/await");
console.log("📘 33.1-fetch-basics.js - Fetch API basics");
console.log(
  "📘 24.2-debounce-throttle.js - Complete debounce/throttle implementations"
);

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 29-event-loop-callbacks-ts-comparison.ts
*/
