// Async/Await Demo
// 📘 For TypeScript comparison, see: 13-async-await-ts-comparison.ts

// ============================================
// 1. ASYNC FUNCTION BASICS
// ============================================

/**
 * Async Functions - Syntactic sugar for working with Promises (ES2017)
 * 
 * Characteristics:
 * - async keyword makes function return a Promise
 * - await keyword pauses execution until Promise resolves
 * - Makes asynchronous code look synchronous
 * - Easier error handling with try/catch
 * - Can only use await inside async functions (or top-level in modules)
 * 
 * Use Cases:
 * - Cleaner Promise handling
 * - Sequential async operations
 * - Complex async logic
 * - Error handling in async code
 * 
 * Common Pitfalls:
 * - Forgetting await makes code run asynchronously
 * - Sequential await when parallel execution is better
 * - Not handling errors with try/catch
 * - Using await in non-async functions
 */

console.log("=== Async Function Basics Demo ===\n");

// Helper function to simulate async operation (ES2017)
// - Returns a Promise that resolves after specified delay
// - Useful for testing async code without real API calls
// - Common pattern in async/await examples
function delay(ms, value) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}

// Basic async function (ES2017)
// - async keyword makes function return a Promise automatically
// - await keyword pauses execution until Promise resolves
// - Makes asynchronous code look synchronous
async function basicAsync() {
  console.log("Starting async function");
  const result = await delay(100, "Hello");
  console.log("Result:", result);
  return result + " World";
}

// Async function always returns a Promise
const promise = basicAsync();
console.log("Return value is Promise:", promise instanceof Promise);

promise.then(result => {
  console.log("Final result:", result);
});

// ============================================
// 2. ASYNC FUNCTION SYNTAX
// ============================================

/**
 * Async Function Syntax Variations:
 * 
 * - Async function declaration
 * - Async function expression
 * - Async arrow function
 * - Async method in object/class
 */

console.log("\n=== Async Function Syntax Demo ===\n");

// Async function declaration (ES2017)
// - Standard function declaration with async keyword
// - Can be called before declaration (hoisted)
async function asyncDeclaration() {
  return await delay(50, "Declaration");
}

// Async function expression (ES2017)
// - Function expression assigned to variable
// - Not hoisted, must be declared before use
const asyncExpression = async function() {
  return await delay(50, "Expression");
};

// Async arrow function (ES2017)
// - Concise syntax for async functions
// - No 'this' binding, inherits from enclosing scope
const asyncArrow = async () => {
  return await delay(50, "Arrow");
};

// Async method in object (ES2017)
// - Method shorthand syntax with async keyword
// - 'this' refers to the object
const obj = {
  async asyncMethod() {
    return await delay(50, "Method");
  }
};

// Async method in class (ES8/ES2017)
// - Class method with async keyword
// - Can access class properties with 'this'
class MyClass {
  async asyncClassMethod() {
    return await delay(50, "Class Method");
  }
}

// Execute all variations
(async () => {
  console.log(await asyncDeclaration());
  console.log(await asyncExpression());
  console.log(await asyncArrow());
  console.log(await obj.asyncMethod());
  const instance = new MyClass();
  console.log(await instance.asyncClassMethod());
})();

// ============================================
// 3. AWAIT KEYWORD USAGE
// ============================================

/**
 * Await Keyword:
 * 
 * - Pauses async function execution
 * - Waits for Promise to resolve
 * - Returns resolved value
 * - Can only be used in async functions (or top-level in modules)
 * - Can await any Promise or thenable
 */

console.log("\n=== Await Keyword Usage Demo ===\n");

async function awaitDemo() {
  console.log("Step 1: Start");
  
  // Await a Promise
  const result1 = await delay(100, "First");
  console.log("Step 2:", result1);
  
  // Await another Promise
  const result2 = await delay(100, "Second");
  console.log("Step 3:", result2);
  
  // Await can be used in expressions
  const combined = await delay(100, "Third") + " Result";
  console.log("Step 4:", combined);
  
  return "Complete";
}

awaitDemo().then(result => console.log("Final:", result));

// Forgetting await - common mistake
async function forgotAwait() {
  console.log("\nForgot await example:");
  
  // ❌ Without await - returns Promise
  const wrong = delay(100, "Wrong");
  console.log("Without await:", wrong); // Promise object
  
  // ✅ With await - returns value
  const correct = await delay(100, "Correct");
  console.log("With await:", correct); // "Correct"
}

forgotAwait();

// ============================================
// 4. ERROR HANDLING WITH TRY-CATCH
// ============================================

/**
 * Error Handling in Async Functions (try-catch blocks):
 * 
 * - Use try/catch blocks for synchronous-style error handling
 * - Catch block handles rejected Promises
 * - Can use finally for cleanup
 * - Unhandled errors reject the returned Promise
 */

console.log("\n=== Error Handling Demo ===\n");

function failingOperation(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Operation failed"));
      } else {
        resolve("Success");
      }
    }, 100);
  });
}

// Basic try/catch
async function basicErrorHandling() {
  try {
    const result = await failingOperation(false);
    console.log("Success case:", result);
    
    const failed = await failingOperation(true);
    console.log("This won't execute");
  } catch (error) {
    console.error("Caught error:", error.message);
  }
}

basicErrorHandling();

// Try/catch with finally
async function errorHandlingWithFinally() {
  let resource = null;
  
  try {
    console.log("\nAcquiring resource...");
    resource = { data: "Important data" };
    
    await failingOperation(true);
    
    console.log("This won't execute");
  } catch (error) {
    console.error("Error occurred:", error.message);
  } finally {
    console.log("Cleanup: Releasing resource");
    resource = null;
  }
}

errorHandlingWithFinally();

// Multiple try/catch blocks
async function multipleTryCatch() {
  console.log("\nMultiple try/catch blocks:");
  
  try {
    const result1 = await failingOperation(false);
    console.log("First operation:", result1);
  } catch (error) {
    console.error("First operation failed:", error.message);
  }
  
  try {
    const result2 = await failingOperation(true);
    console.log("This won't execute");
  } catch (error) {
    console.error("Second operation failed:", error.message);
  }
  
  console.log("Function continues after errors");
}

multipleTryCatch();

// ============================================
// 5. SEQUENTIAL VS PARALLEL EXECUTION
// ============================================

/**
 * Sequential vs Parallel Execution:
 * 
 * Sequential (one after another):
 * - Use await for each operation
 * - Total time = sum of all operations
 * - Use when operations depend on each other
 * 
 * Parallel (all at once):
 * - Use Promise.all() with await
 * - Total time = longest operation
 * - Use when operations are independent
 */

console.log("\n=== Sequential vs Parallel Execution Demo ===\n");

// Sequential execution
async function sequential() {
  console.log("Sequential: Starting...");
  const start = Date.now();
  
  const result1 = await delay(200, "First");
  const result2 = await delay(200, "Second");
  const result3 = await delay(200, "Third");
  
  const duration = Date.now() - start;
  console.log(`Sequential: ${result1}, ${result2}, ${result3}`);
  console.log(`Sequential: Took ${duration}ms (≈600ms)`);
}

// Parallel execution
async function parallel() {
  console.log("\nParallel: Starting...");
  const start = Date.now();
  
  const [result1, result2, result3] = await Promise.all([
    delay(200, "First"),
    delay(200, "Second"),
    delay(200, "Third")
  ]);
  
  const duration = Date.now() - start;
  console.log(`Parallel: ${result1}, ${result2}, ${result3}`);
  console.log(`Parallel: Took ${duration}ms (≈200ms)`);
}

// Run both
(async () => {
  await sequential();
  await parallel();
})();

// Mixed: Some sequential, some parallel
async function mixed() {
  console.log("\nMixed execution:");
  
  // First operation must complete first
  const user = await delay(100, { id: 1, name: "Alice" });
  console.log("Fetched user:", user.name);
  
  // These can run in parallel
  const [posts, comments, likes] = await Promise.all([
    delay(100, ["Post 1", "Post 2"]),
    delay(100, ["Comment 1", "Comment 2"]),
    delay(100, [10, 20])
  ]);
  
  console.log("Fetched posts:", posts.length);
  console.log("Fetched comments:", comments.length);
  console.log("Fetched likes:", likes.length);
}

mixed();

// ============================================
// 6. TOP-LEVEL AWAIT
// ============================================

/**
 * Top-Level Await - Use await outside async functions
 * 
 * ES Specification: ES2022
 * 
 * Characteristics:
 * - Can use await at module top level
 * - Only works in ES modules (type="module")
 * - Module execution pauses until Promise resolves
 * - Useful for module initialization
 * 
 * Use Cases:
 * - Loading configuration
 * - Dynamic imports
 * - Resource initialization
 * 
 * Common Pitfalls:
 * - Blocks module loading
 * - Not available in CommonJS
 * - Can cause circular dependency issues
 */

console.log("\n=== Top-Level Await Demo ===\n");

// Note: Top-level await only works in ES modules
// In this demo file, we'll simulate it with IIFE

// Simulated top-level await
(async () => {
  console.log("Simulating top-level await...");
  
  // Load configuration
  const config = await delay(100, { apiUrl: "https://api.example.com", timeout: 5000 });
  console.log("Config loaded:", config);
  
  // Dynamic import (simulated)
  const module = await delay(100, { feature: "enabled" });
  console.log("Module loaded:", module);
})();

// ============================================
// 7. RELATIONSHIP WITH PROMISES (Promise relationship)
// ============================================

/**
 * Async/Await and Promises:
 * 
 * - Async/await is syntactic sugar over Promises
 * - Async functions return Promises
 * - Can mix async/await with .then()/.catch()
 * - await works with any Promise
 */

console.log("\n=== Relationship with Promises Demo ===\n");

// Async function returns Promise
async function returnsPromise() {
  return "Value";
}

// Can use .then() on async function result
returnsPromise().then(value => {
  console.log("Using .then():", value);
});

// Can await Promise-returning functions
function promiseFunction() {
  return Promise.resolve("Promise value");
}

async function awaitPromiseFunction() {
  const result = await promiseFunction();
  console.log("Awaiting Promise function:", result);
}

awaitPromiseFunction();

// Mixing async/await with Promise methods
async function mixedApproach() {
  const result = await Promise.all([
    delay(100, "A"),
    delay(100, "B"),
    delay(100, "C")
  ]);
  
  console.log("Mixed approach:", result);
  
  return result.join(", ");
}

mixedApproach().then(final => {
  console.log("Final result:", final);
});

// Converting Promise chain to async/await
function promiseChain() {
  return delay(100, 5)
    .then(result => result * 2)
    .then(result => result + 10)
    .then(result => {
      console.log("Promise chain result:", result);
      return result;
    });
}

async function asyncAwaitVersion() {
  let result = await delay(100, 5);
  result = result * 2;
  result = result + 10;
  console.log("Async/await result:", result);
  return result;
}

promiseChain();
asyncAwaitVersion();

// ============================================
// 8. PRACTICAL EXAMPLES
// ============================================

console.log("\n=== Practical Examples ===\n");

// Example 1: API calls with error handling
async function fetchUserData(userId) {
  try {
    console.log(`Fetching user ${userId}...`);
    const user = await delay(100, { id: userId, name: `User${userId}` });
    
    console.log(`Fetching posts for ${user.name}...`);
    const posts = await delay(100, [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" }
    ]);
    
    return { user, posts };
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

fetchUserData(1).then(data => {
  console.log("User data:", data.user.name, "with", data.posts.length, "posts");
});

// Example 2: Retry logic
async function fetchWithRetry(fn, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`);
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      } else {
        throw new Error(`Failed after ${retries} attempts`);
      }
    }
  }
}

let attemptCount = 0;
fetchWithRetry(async () => {
  attemptCount++;
  if (attemptCount < 3) {
    throw new Error("Temporary failure");
  }
  return "Success!";
}, 3, 100)
  .then(result => console.log("Retry result:", result))
  .catch(error => console.error("Retry failed:", error.message));

// Example 3: Parallel requests with error handling
async function fetchMultipleUsers(userIds) {
  const results = await Promise.allSettled(
    userIds.map(id => fetchUserData(id))
  );
  
  const successful = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value);
  
  const failed = results
    .filter(r => r.status === "rejected")
    .map(r => r.reason.message);
  
  console.log(`Fetched ${successful.length} users successfully`);
  if (failed.length > 0) {
    console.log(`Failed to fetch ${failed.length} users`);
  }
  
  return successful;
}

fetchMultipleUsers([1, 2, 3]);

// Example 4: Timeout wrapper
async function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

async function slowOperation() {
  return await delay(2000, "Slow result");
}

withTimeout(slowOperation(), 500)
  .then(result => console.log("Timeout example:", result))
  .catch(error => console.error("Timeout example:", error.message));

// Example 5: Sequential processing with accumulation
async function processItems(items) {
  console.log("\nProcessing items sequentially:");
  let total = 0;
  
  for (const item of items) {
    const result = await delay(100, item * 2);
    total += result;
    console.log(`Processed item ${item}, result: ${result}, total: ${total}`);
  }
  
  return total;
}

processItems([1, 2, 3, 4, 5]).then(total => {
  console.log("Final total:", total);
});

// ============================================
// 9. COMMON PITFALLS & BEST PRACTICES
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// Pitfall 1: Forgetting await
async function forgettingAwait() {
  console.log("Pitfall 1: Forgetting await");
  
  // ❌ Without await - doesn't wait
  delay(100, "Wrong");
  console.log("  ❌ Continued immediately");
  
  // ✅ With await - waits
  await delay(100, "Correct");
  console.log("  ✅ Waited for completion");
}

forgettingAwait();

// Pitfall 2: Sequential when parallel is better
async function unnecessarySequential() {
  console.log("\nPitfall 2: Unnecessary sequential execution");
  const start = Date.now();
  
  // ❌ Sequential - slow
  const a = await delay(200, "A");
  const b = await delay(200, "B");
  const c = await delay(200, "C");
  
  console.log(`  ❌ Sequential took ${Date.now() - start}ms`);
}

async function betterParallel() {
  const start = Date.now();
  
  // ✅ Parallel - fast
  const [a, b, c] = await Promise.all([
    delay(200, "A"),
    delay(200, "B"),
    delay(200, "C")
  ]);
  
  console.log(`  ✅ Parallel took ${Date.now() - start}ms`);
}

(async () => {
  await unnecessarySequential();
  await betterParallel();
})();

// Pitfall 3: Not handling errors
async function unhandledError() {
  console.log("\nPitfall 3: Unhandled errors");
  
  // ❌ No try/catch - error propagates
  try {
    await failingOperation(true);
  } catch (error) {
    console.log("  ✅ Error caught:", error.message);
  }
}

unhandledError();

// Pitfall 4: Awaiting in loops unnecessarily
async function awaitInLoop() {
  console.log("\nPitfall 4: Await in loop");
  const items = [1, 2, 3, 4, 5];
  const start = Date.now();
  
  // ❌ Sequential processing
  const results1 = [];
  for (const item of items) {
    results1.push(await delay(100, item * 2));
  }
  console.log(`  ❌ Loop took ${Date.now() - start}ms`);
  
  // ✅ Parallel processing
  const start2 = Date.now();
  const results2 = await Promise.all(
    items.map(item => delay(100, item * 2))
  );
  console.log(`  ✅ Parallel took ${Date.now() - start2}ms`);
}

awaitInLoop();

// Pitfall 5: Mixing callbacks with async/await
async function mixingCallbacks() {
  console.log("\nPitfall 5: Mixing callbacks with async/await");
  
  // ❌ Callback doesn't work with await
  setTimeout(async () => {
    const result = await delay(100, "Callback result");
    console.log("  ❌ This works but is confusing");
  }, 100);
  
  // ✅ Use Promise-based approach
  await delay(100);
  const result = await delay(100, "Promise result");
  console.log("  ✅ Clean async/await:", result);
}

mixingCallbacks();

// ============================================
// BEST PRACTICES SUMMARY
// ============================================

console.log("\n=== Best Practices Summary ===\n");
console.log(`
1. ALWAYS use try/catch for error handling
2. Use parallel execution (Promise.all) when operations are independent
3. Use sequential execution (await) when operations depend on each other
4. Don't forget await - it's easy to miss!
5. Use Promise.allSettled() when you need all results regardless of failures
6. Add timeout wrappers for operations that might hang
7. Use descriptive variable names for awaited values
8. Consider using async IIFE for top-level async code
9. Don't mix callbacks with async/await - convert to Promises
10. Use async/await instead of Promise chains for better readability
11. Be careful with await in loops - consider if parallel is better
12. Always return values from async functions explicitly
`);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. ASYNC FUNCTION RETURN TYPES
   JS:  async function getData() { return { data: "value" }; }
   TS:  async function getData(): Promise<{ data: string }> {
          return { data: "value" };
        }
   
   Benefits:
   - Explicit Promise return type
   - Type checking for returned values
   - Better IDE autocomplete

2. AWAIT TYPE INFERENCE
   JS:  const result = await fetchData();
   TS:  const result = await fetchData(); // Type inferred from Promise<T>
   
   Benefits:
   - Automatic type inference
   - No need to annotate awaited values
   - Type-safe variable usage

3. ERROR HANDLING TYPES
   JS:  try { await operation(); } catch (error) { console.log(error); }
   TS:  try {
          await operation();
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        }
   
   Benefits:
   - Type-safe error handling
   - Forces error type checking
   - Prevents runtime errors

4. GENERIC ASYNC FUNCTIONS
   JS:  async function fetchItem(id) { return await fetch(id); }
   TS:  async function fetchItem<T>(id: number): Promise<T> {
          const response = await fetch(`/api/items/${id}`);
          return response.json();
        }
   
   Benefits:
   - Type-safe generic async functions
   - Preserves type information
   - Better type inference

5. PROMISE.ALL TYPE INFERENCE
   JS:  const [a, b, c] = await Promise.all([p1, p2, p3]);
   TS:  const [a, b, c] = await Promise.all([p1, p2, p3]);
        // Types: [Type1, Type2, Type3] - tuple type!
   
   Benefits:
   - Preserves individual types
   - Type-safe destructuring
   - Better error messages

6. ASYNC ARROW FUNCTION TYPES
   JS:  const fn = async (x) => x * 2;
   TS:  const fn: (x: number) => Promise<number> = async (x) => x * 2;
   
   Benefits:
   - Explicit function type
   - Type checking for parameters
   - Better documentation

⚠️ COMMON CONFUSION POINTS:

1. ASYNC FUNCTION ALWAYS RETURNS PROMISE
   - Even if you return a non-Promise value
   - TypeScript enforces Promise<T> return type
   
   async function getValue(): Promise<number> {
     return 42; // ✅ Automatically wrapped in Promise
   }

2. AWAIT UNWRAPS PROMISE TYPE
   - await converts Promise<T> to T
   - TypeScript infers the unwrapped type
   
   const promise: Promise<string> = fetchData();
   const value: string = await promise; // Type is string, not Promise<string>

3. ERROR TYPE IN CATCH IS UNKNOWN
   - TypeScript 4.4+ uses 'unknown' for catch errors
   - Must use type guards to access error properties
   
   try {
     await operation();
   } catch (error: unknown) {
     if (error instanceof Error) {
       console.log(error.message); // ✅ Type-safe
     }
   }

4. VOID VS PROMISE<VOID>
   - void: Synchronous function with no return
   - Promise<void>: Async function with no meaningful return
   
   function syncVoid(): void { console.log("hi"); }
   async function asyncVoid(): Promise<void> { console.log("hi"); }

5. TOP-LEVEL AWAIT TYPE CHECKING
   - Top-level await works in ES modules
   - TypeScript checks module type
   
   // In ES module (type: "module")
   const config = await loadConfig(); // ✅ Type-safe

6. ASYNC GENERATOR RETURN TYPE
   - Async generators return AsyncIterableIterator<T>
   - Different from Promise<T>
   
   async function* asyncGen(): AsyncIterableIterator<number> {
     yield 1;
     yield 2;
   }

📘 See 13-async-await-ts-comparison.ts for detailed examples!
*/
