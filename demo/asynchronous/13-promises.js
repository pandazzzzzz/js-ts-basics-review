// Promises Demo
// 📘 For TypeScript comparison, see: 12-promises-ts-comparison.ts

// ============================================
// 1. PROMISE BASICS
// ============================================

/**
 * Promise - Object representing eventual completion or failure of async operation
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Has three states: pending, fulfilled, rejected
 * - Once settled (fulfilled/rejected), state cannot change
 * - Provides then/catch/finally methods for handling results
 * - Chainable for sequential operations
 * - Better alternative to callback hell
 * 
 * Use Cases:
 * - Asynchronous operations (API calls, file I/O, timers)
 * - Sequential async operations
 * - Parallel async operations
 * - Error handling in async code
 * 
 * Common Pitfalls:
 * - Forgetting to return in then() causes promise chain issues
 * - Unhandled promise rejections can crash Node.js
 * - Creating unnecessary promise wrappers (promise constructor anti-pattern)
 */

console.log("=== Promise Basics Demo ===\n");

// Creating a Promise with the constructor
const simplePromise = new Promise((resolve, reject) => {
  const success = true;
  
  if (success) {
    resolve("Operation successful!");
  } else {
    reject("Operation failed!");
  }
});

simplePromise
  .then(result => {
    console.log("Promise resolved:", result);
  })
  .catch(error => {
    console.error("Promise rejected:", error);
  });

// ============================================
// 2. PROMISE STATES
// ============================================

/**
 * Promise States:
 * 
 * 1. Pending - Initial state, neither fulfilled nor rejected
 * 2. Fulfilled - Operation completed successfully
 * 3. Rejected - Operation failed
 * 
 * Once a promise is fulfilled or rejected, it is "settled" and cannot change state.
 */

console.log("\n=== Promise States Demo ===\n");

// Pending promise
const pendingPromise = new Promise((resolve) => {
  // Never resolves - stays pending
  console.log("Promise created - state: pending");
});

// Fulfilled promise
const fulfilledPromise = new Promise((resolve) => {
  resolve("Fulfilled!");
});

fulfilledPromise.then(value => {
  console.log("Promise state: fulfilled, value:", value);
});

// Rejected promise
const rejectedPromise = new Promise((resolve, reject) => {
  reject(new Error("Rejected!"));
});

rejectedPromise.catch(error => {
  console.log("Promise state: rejected, error:", error.message);
});

// ============================================
// 3. THEN/CATCH/FINALLY CHAINING
// ============================================

/**
 * Promise Methods:
 * 
 * - then(onFulfilled, onRejected) - Handle fulfilled or rejected promise
 * - catch(onRejected) - Handle rejected promise (syntactic sugar for then(null, onRejected))
 * - finally(onFinally) - Execute code regardless of promise outcome (ES2018)
 * 
 * Chaining:
 * - Each then() returns a new promise
 * - Return value becomes the resolved value of the new promise
 * - Errors propagate down the chain until caught
 */

console.log("\n=== Then/Catch/Finally Chaining Demo ===\n");

function asyncOperation(value, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`Failed with value: ${value}`));
      } else {
        resolve(value);
      }
    }, 100);
  });
}

// Basic chaining
asyncOperation(5)
  .then(result => {
    console.log("Step 1:", result);
    return result * 2;
  })
  .then(result => {
    console.log("Step 2:", result);
    return result + 10;
  })
  .then(result => {
    console.log("Step 3:", result);
  })
  .catch(error => {
    console.error("Error caught:", error.message);
  })
  .finally(() => {
    console.log("Finally: Cleanup code runs regardless of outcome");
  });

// Error propagation
asyncOperation(10)
  .then(result => {
    console.log("\nError propagation - Step 1:", result);
    return asyncOperation(result, true); // This will fail
  })
  .then(result => {
    console.log("Step 2: This won't execute");
    return result;
  })
  .catch(error => {
    console.error("Error caught in chain:", error.message);
  });

// ============================================
// 4. PROMISE.ALL - PARALLEL EXECUTION
// ============================================

/**
 * Promise.all(iterable) - Wait for all promises to fulfill
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Takes array of promises
 * - Returns single promise that resolves when ALL promises resolve
 * - Resolves with array of results in same order
 * - Rejects immediately if ANY promise rejects (fail-fast)
 * 
 * Use Cases:
 * - Multiple independent async operations
 * - Fetching data from multiple APIs
 * - Parallel processing
 * 
 * Common Pitfalls:
 * - One rejection fails entire operation
 * - Results order matches input order, not completion order
 */

console.log("\n=== Promise.all Demo ===\n");

const promise1 = asyncOperation(1);
const promise2 = asyncOperation(2);
const promise3 = asyncOperation(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log("Promise.all results:", results); // [1, 2, 3]
  })
  .catch(error => {
    console.error("Promise.all error:", error.message);
  });

// Fail-fast behavior
const failingPromise = asyncOperation(100, true);
const successPromise1 = asyncOperation(200);
const successPromise2 = asyncOperation(300);

Promise.all([successPromise1, failingPromise, successPromise2])
  .then(results => {
    console.log("This won't execute");
  })
  .catch(error => {
    console.error("Promise.all failed fast:", error.message);
  });

// ============================================
// 5. PROMISE.RACE - FIRST COMPLETION
// ============================================

/**
 * Promise.race(iterable) - Wait for first promise to settle
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Returns promise that settles with first settled promise
 * - Can resolve or reject depending on which finishes first
 * - Other promises continue running but results are ignored
 * 
 * Use Cases:
 * - Timeout implementations
 * - Fastest response wins
 * - Fallback mechanisms
 */

console.log("\n=== Promise.race Demo ===\n");

function delayedPromise(value, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Promise with value ${value} completed after ${delay}ms`);
      resolve(value);
    }, delay);
  });
}

Promise.race([
  delayedPromise("fast", 100),
  delayedPromise("medium", 200),
  delayedPromise("slow", 300)
])
  .then(result => {
    console.log("Promise.race winner:", result); // "fast"
  });

// Timeout pattern
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
  
  return Promise.race([promise, timeout]);
}

withTimeout(delayedPromise("data", 500), 200)
  .then(result => console.log("Result:", result))
  .catch(error => console.error("Timeout error:", error.message));

// ============================================
// 6. PROMISE.ALLSETTLED - ALL RESULTS
// ============================================

/**
 * Promise.allSettled(iterable) - Wait for all promises to settle
 * 
 * ES Specification: ES2020
 * 
 * Characteristics:
 * - Waits for ALL promises to settle (fulfill or reject)
 * - Never rejects - always fulfills with array of results
 * - Each result has status ("fulfilled" or "rejected") and value/reason
 * 
 * Use Cases:
 * - When you need all results regardless of failures
 * - Batch operations where some can fail
 * - Collecting partial results
 */

console.log("\n=== Promise.allSettled Demo ===\n");

const promises = [
  asyncOperation(1),
  asyncOperation(2, true), // This will fail
  asyncOperation(3),
  asyncOperation(4, true)  // This will also fail
];

Promise.allSettled(promises)
  .then(results => {
    console.log("Promise.allSettled results:");
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`  Promise ${index}: fulfilled with value ${result.value}`);
      } else {
        console.log(`  Promise ${index}: rejected with reason ${result.reason.message}`);
      }
    });
  });

// ============================================
// 7. PROMISE.ANY - FIRST SUCCESS
// ============================================

/**
 * Promise.any(iterable) - Wait for first promise to fulfill
 * 
 * ES Specification: ES2021
 * 
 * Characteristics:
 * - Returns first fulfilled promise
 * - Ignores rejections unless ALL promises reject
 * - Rejects with AggregateError if all promises reject
 * 
 * Use Cases:
 * - Fastest successful response
 * - Fallback to multiple sources
 * - Redundant requests
 */

console.log("\n=== Promise.any Demo ===\n");

Promise.any([
  asyncOperation(1, true),  // Fails
  asyncOperation(2),         // Succeeds
  asyncOperation(3)          // Succeeds
])
  .then(result => {
    console.log("Promise.any first success:", result); // 2
  })
  .catch(error => {
    console.error("All promises rejected:", error);
  });

// All rejections case
Promise.any([
  asyncOperation(1, true),
  asyncOperation(2, true),
  asyncOperation(3, true)
])
  .then(result => {
    console.log("This won't execute");
  })
  .catch(error => {
    console.error("Promise.any - all rejected:", error.constructor.name); // AggregateError
  });

// ============================================
// 8. ERROR HANDLING PATTERNS
// ============================================

/**
 * Error Handling Best Practices:
 * 
 * 1. Always add catch() to promise chains
 * 2. Use finally() for cleanup code
 * 3. Return promises in then() for proper chaining
 * 4. Handle errors at appropriate level
 * 5. Use Promise.allSettled() when you need all results
 */

console.log("\n=== Error Handling Patterns Demo ===\n");

// Pattern 1: Catch at the end of chain
asyncOperation(10)
  .then(result => result * 2)
  .then(result => result + 5)
  .catch(error => {
    console.error("Pattern 1 - Error at end:", error.message);
    return 0; // Provide default value
  })
  .then(result => {
    console.log("Pattern 1 - Recovered with:", result);
  });

// Pattern 2: Catch and rethrow
asyncOperation(20, true)
  .catch(error => {
    console.error("Pattern 2 - Logging error:", error.message);
    throw error; // Rethrow for upstream handling
  })
  .catch(error => {
    console.error("Pattern 2 - Upstream handler:", error.message);
  });

// Pattern 3: Finally for cleanup
let resource = null;

asyncOperation(30)
  .then(result => {
    resource = { data: result };
    console.log("Pattern 3 - Resource acquired:", resource);
    return result;
  })
  .catch(error => {
    console.error("Pattern 3 - Error:", error.message);
  })
  .finally(() => {
    if (resource) {
      console.log("Pattern 3 - Cleanup: releasing resource");
      resource = null;
    }
  });

// ============================================
// 9. PRACTICAL EXAMPLES
// ============================================

console.log("\n=== Practical Examples ===\n");

// Example 1: Simulated API call
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: `User${userId}`, email: `user${userId}@example.com` });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 100);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1", userId },
        { id: 2, title: "Post 2", userId }
      ]);
    }, 100);
  });
}

// Sequential operations
console.log("Example 1: Sequential API calls");
fetchUser(1)
  .then(user => {
    console.log("  Fetched user:", user.name);
    return fetchUserPosts(user.id);
  })
  .then(posts => {
    console.log("  Fetched posts:", posts.length);
  })
  .catch(error => {
    console.error("  Error:", error.message);
  });

// Example 2: Parallel operations
console.log("\nExample 2: Parallel API calls");
Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
])
  .then(users => {
    console.log("  Fetched users:", users.map(u => u.name).join(", "));
  })
  .catch(error => {
    console.error("  Error:", error.message);
  });

// Example 3: Retry logic
function fetchWithRetry(fn, retries = 3) {
  return fn().catch(error => {
    if (retries > 0) {
      console.log(`  Retrying... (${retries} attempts left)`);
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  });
}

console.log("\nExample 3: Retry logic");
let attemptCount = 0;
fetchWithRetry(() => {
  attemptCount++;
  return asyncOperation(100, attemptCount < 3); // Fail first 2 attempts
}, 3)
  .then(result => {
    console.log("  Success after retries:", result);
  })
  .catch(error => {
    console.error("  Failed after all retries:", error.message);
  });

// ============================================
// 10. COMMON PITFALLS & BEST PRACTICES
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// Pitfall 1: Promise Hell (nested promises)
console.log("Pitfall 1: Promise Hell");
asyncOperation(1)
  .then(result1 => {
    asyncOperation(result1 * 2)
      .then(result2 => {
        asyncOperation(result2 + 10)
          .then(result3 => {
            console.log("  ❌ Nested result:", result3);
          });
      });
  });

// Better: Flat chain
asyncOperation(1)
  .then(result1 => asyncOperation(result1 * 2))
  .then(result2 => asyncOperation(result2 + 10))
  .then(result3 => {
    console.log("  ✅ Flat chain result:", result3);
  });

// Pitfall 2: Forgetting to return
console.log("\nPitfall 2: Forgetting to return");
asyncOperation(5)
  .then(result => {
    asyncOperation(result * 2); // ❌ Not returned!
  })
  .then(result => {
    console.log("  ❌ Result is undefined:", result);
  });

asyncOperation(5)
  .then(result => {
    return asyncOperation(result * 2); // ✅ Returned
  })
  .then(result => {
    console.log("  ✅ Result is correct:", result);
  });

// Pitfall 3: Unhandled rejections
console.log("\nPitfall 3: Unhandled rejections");
// ❌ No catch - will cause unhandled rejection warning
// asyncOperation(10, true);

// ✅ Always add catch
asyncOperation(10, true)
  .catch(error => {
    console.log("  ✅ Error handled:", error.message);
  });

// Pitfall 4: Creating unnecessary promises
console.log("\nPitfall 4: Promise constructor anti-pattern");

// ❌ Unnecessary promise wrapper
function badFetchUser(id) {
  return new Promise((resolve, reject) => {
    fetchUser(id)
      .then(user => resolve(user))
      .catch(error => reject(error));
  });
}

// ✅ Just return the promise
function goodFetchUser(id) {
  return fetchUser(id);
}

goodFetchUser(1)
  .then(user => console.log("  ✅ User fetched correctly:", user.name));

// ============================================
// BEST PRACTICES SUMMARY
// ============================================

console.log("\n=== Best Practices Summary ===\n");
console.log(`
1. ALWAYS add .catch() to promise chains
2. Use Promise.all() for parallel independent operations
3. Use Promise.allSettled() when you need all results
4. Use Promise.race() for timeout patterns
5. Use Promise.any() for fastest successful response
6. Return promises in .then() for proper chaining
7. Use .finally() for cleanup code
8. Avoid promise hell - keep chains flat
9. Don't wrap promises unnecessarily
10. Handle errors at the appropriate level
11. Use async/await for better readability (see demo/13-async-await.js)
12. Be aware of fail-fast behavior in Promise.all()
`);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. PROMISE TYPE ANNOTATIONS
   JS:  const promise = new Promise((resolve) => resolve(42));
   TS:  const promise: Promise<number> = new Promise((resolve) => resolve(42));
   
   Benefits:
   - Type-safe promise values
   - Better IDE autocomplete
   - Compile-time error checking

2. GENERIC PROMISE TYPES
   JS:  function fetchData() { return Promise.resolve({ data: "value" }); }
   TS:  function fetchData(): Promise<{ data: string }> {
          return Promise.resolve({ data: "value" });
        }
   
   Benefits:
   - Explicit return types
   - Type inference in .then()
   - Better error messages

3. PROMISE.ALL TYPE INFERENCE
   JS:  Promise.all([promise1, promise2, promise3])
   TS:  Promise.all([promise1, promise2, promise3])
        // Returns Promise<[Type1, Type2, Type3]> - tuple type!
   
   Benefits:
   - Preserves individual types
   - Type-safe array destructuring
   - Better type checking

4. ERROR TYPES
   JS:  promise.catch(error => console.log(error));
   TS:  promise.catch((error: unknown) => {
          if (error instanceof Error) {
            console.log(error.message);
          }
        });
   
   Benefits:
   - Type-safe error handling
   - Forces error type checking
   - Prevents runtime errors

5. PROMISE UTILITY TYPES
   TS-Only:
   - Awaited<T>: Unwraps Promise type
   - Promise<T>: Promise that resolves to T
   
   type Data = Awaited<Promise<string>>; // string
   type PromiseData = Promise<string>; // Promise<string>

⚠️ COMMON CONFUSION POINTS:

1. PROMISE<void> vs PROMISE<undefined>
   - Promise<void>: Promise that doesn't return meaningful value
   - Promise<undefined>: Promise that explicitly returns undefined
   
   async function voidFn(): Promise<void> { console.log("hi"); }
   async function undefinedFn(): Promise<undefined> { return undefined; }

2. ERROR TYPE IN CATCH
   - Catch parameter is 'unknown' in TypeScript (not 'any')
   - Must use type guards to access error properties
   
   promise.catch((error: unknown) => {
     if (error instanceof Error) {
       console.log(error.message); // ✅ Type-safe
     }
   });

3. PROMISE.ALL TUPLE TYPES
   - TypeScript preserves individual types in tuple
   - Array destructuring is type-safe
   
   const [user, posts, comments] = await Promise.all([
     fetchUser(1),    // Promise<User>
     fetchPosts(1),   // Promise<Post[]>
     fetchComments(1) // Promise<Comment[]>
   ]);
   // user: User, posts: Post[], comments: Comment[]

📘 See 12-promises-ts-comparison.ts for detailed examples!
*/
