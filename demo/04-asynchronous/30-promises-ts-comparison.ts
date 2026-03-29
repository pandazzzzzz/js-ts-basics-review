// TypeScript vs JavaScript: Promises Comparison
// 📘 For JavaScript examples, see: 25-promises.js
// This file demonstrates TypeScript-specific typing for Promises

export {};

// ============================================================================
// 1. PROMISE<T> GENERIC TYPE
// ============================================================================

// JavaScript: No type checking for promise values
// const simplePromise = new Promise((resolve) => {
//   resolve(42); // No type checking
// });

// TypeScript: Promise<T> generic type enforces resolved value type
const typedPromise: Promise<number> = new Promise<number>((resolve) => {
  resolve(42);
  // resolve("string"); // ❌ Error: Type 'string' is not assignable to type 'number'
});

// Type inference in resolve/reject
const inferredPromise = new Promise<string>((resolve, reject) => {
  // TypeScript infers resolve type from generic parameter
  if (true) {
    resolve("success");
  } else {
    reject(new Error("failed"));
  }
});

console.log("=== Promise<T> Generic Type ===");
typedPromise.then(value => {
  // value is typed as number
  console.log("Promise value:", value * 2);
});

// ============================================================================
// 2. TYPED PROMISE FUNCTIONS
// ============================================================================

// TypeScript: Explicit return type for promise-returning functions
function asyncOperation(value: number, shouldFail: boolean = false): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`Failed with value: ${value}`));
      } else {
        resolve(value * 2);
      }
    }, 100);
  });
}

// Arrow function with explicit return type
const asyncOpArrow = (value: number): Promise<number> => {
  return Promise.resolve(value * 2);
};

console.log("\n=== Typed Promise Functions ===");
asyncOperation(5).then(result => {
  // result is typed as number
  console.log("Result:", result);
});

// ============================================================================
// 3. PROMISE.ALL WITH TUPLE TYPES
// ============================================================================

// TypeScript: Promise.all preserves individual types as tuple
const promise1: Promise<number> = Promise.resolve(1);
const promise2: Promise<string> = Promise.resolve("hello");
const promise3: Promise<boolean> = Promise.resolve(true);

// TypeScript infers tuple type: [number, string, boolean]
Promise.all([promise1, promise2, promise3]).then(results => {
  // results has tuple type [number, string, boolean]
  const [num, str, bool] = results;

  // Type-safe access - no type assertions needed
  const doubled: number = num * 2;
  const upper: string = str.toUpperCase();
  const negated: boolean = !bool;

  console.log("Promise.all tuple:", doubled, upper, negated);
});

// Without destructuring - still type-safe
Promise.all([promise1, promise2, promise3]).then(results => {
  // TypeScript knows the exact tuple type
  console.log("First (number):", results[0]);
  console.log("Second (string):", results[1]);
  console.log("Third (boolean):", results[2]);
});

console.log("\n=== Promise.all with Tuple Types ===");

// ============================================================================
// 4. PROMISE.ALLSETTLED RESULT TYPES
// ============================================================================

// TypeScript: Promise.allSettled returns typed settled results
type SettledResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: unknown };

async function mixedPromises(): Promise<void> {
  const promises = [
    asyncOperation(1),
    asyncOperation(2, true), // Will fail
    asyncOperation(3)
  ];

  const results = await Promise.allSettled(promises);

  // TypeScript knows results type: PromiseSettledResult<number>[]
  results.forEach((result, index) => {
    // Type guard for fulfilled status
    if (result.status === "fulfilled") {
      // result.value is typed as number
      console.log(`Promise ${index}: fulfilled with value ${result.value}`);
    } else {
      // result.reason is typed as unknown (must narrow to access properties)
      if (result.reason instanceof Error) {
        console.log(`Promise ${index}: rejected with reason ${result.reason.message}`);
      }
    }
  });
}

console.log("\n=== Promise.allSettled Result Types ===");
mixedPromises();

// ============================================================================
// 5. CUSTOM PROMISE IMPLEMENTATION WITH TYPES
// ============================================================================

// TypeScript: Implementing Promise-like interfaces
interface MyPromiseLike<T> {
  then<TResult1, TResult2>(
    onFulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onRejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>
  ): MyPromiseLike<TResult1 | TResult2>;
}

// Class implementing Promise-like pattern
class TypedResult<T> implements MyPromiseLike<T> {
  private value: T | null = null;
  private resolved: boolean = false;

  constructor(private initialValue?: T) {
    if (initialValue !== undefined) {
      this.value = initialValue;
      this.resolved = true;
    }
  }

  resolve(value: T): void {
    this.value = value;
    this.resolved = true;
  }

  then<TResult1, TResult2>(
    onFulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onRejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>
  ): MyPromiseLike<TResult1 | TResult2> {
    if (this.resolved && onFulfilled) {
      const result = onFulfilled(this.value as T);
      return new TypedResult(result as TResult1);
    }
    return new TypedResult();
  }
}

console.log("\n=== Custom Promise Implementation ===");
const customPromise = new TypedResult<number>(42);
customPromise.then(value => {
  console.log("Custom promise value:", value);
  return value * 2;
}).then(value => {
  console.log("Chained value:", value);
});

// ============================================================================
// 6. ERROR HANDLING WITH TYPED CATCH
// ============================================================================

// TypeScript: Catch parameter is 'unknown' type (not 'any')
async function typedErrorHandling(): Promise<void> {
  try {
    await asyncOperation(10, true);
  } catch (error: unknown) {
    // error is 'unknown' - must use type guard to access properties
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else if (typeof error === "string") {
      console.log("String error:", error);
    } else {
      console.log("Unknown error type");
    }
  }
}

console.log("\n=== Typed Error Handling ===");
typedErrorHandling();

// Custom error types
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithTypedError(): Promise<void> {
  try {
    throw new ApiError("Not found", 404, "/api/users");
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      // TypeScript knows error has statusCode and endpoint properties
      console.log(`API Error ${error.statusCode} at ${error.endpoint}: ${error.message}`);
    }
  }
}

fetchWithTypedError();

// ============================================================================
// 7. PROMISE UTILITY TYPES
// ============================================================================

// Awaited<T> - Unwrap Promise type (TypeScript 4.5+)
type NumberPromise = Promise<number>;
type UnwrappedNumber = Awaited<NumberPromise>; // number

// Nested promises
type NestedPromise = Promise<Promise<string>>;
type UnwrappedString = Awaited<NestedPromise>; // string

// Complex types
interface UserData {
  id: number;
  name: string;
}

type UserPromise = Promise<UserData>;
type UnwrappedUser = Awaited<UserPromise>; // UserData

// With union types
type MaybePromise<T> = T | Promise<T>;
type UnwrappedMaybe = Awaited<MaybePromise<string>>; // string

console.log("\n=== Promise 效用类型 ===");
console.log("Awaited<Promise<number>>:", typeof 42);

// Practical: Generic async function with Awaited
async function processResult<T>(promise: Promise<T>): Promise<T> {
  const result: Awaited<Promise<T>> = await promise;
  return result;
}

processResult(Promise.resolve("hello")).then(result => {
  // result is typed as string
  console.log("Processed result:", result.toUpperCase());
});

// ============================================================================
// 8. GENERIC PROMISE WRAPPER
// ============================================================================

// TypeScript: Generic fetch wrapper with type parameter
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status}`, response.status, url);
  }

  const data = await response.json() as T;

  return {
    data,
    status: response.status,
    message: "Success"
  };
}

// Usage with explicit type parameter
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function useGenericFetch(): Promise<void> {
  // TypeScript infers return type as Promise<ApiResponse<User>>
  const userResponse = await fetchApi<User>("/api/users/1");
  console.log("User:", userResponse.data.name);

  // TypeScript infers return type as Promise<ApiResponse<Post[]>>
  const postsResponse = await fetchApi<Post[]>("/api/posts");
  console.log("Posts count:", postsResponse.data.length);
}

console.log("\n=== Generic Promise Wrapper ===");
// useGenericFetch(); // Would run if API existed

// ============================================================================
// 9. ASYNC FUNCTION RETURN TYPE INFERENCE
// ============================================================================

// TypeScript: Async functions always return Promise<T>
async function explicitReturn(): Promise<string> {
  return "hello"; // TypeScript wraps in Promise automatically
}

async function inferredReturn() {
  return 42; // TypeScript infers return type as Promise<number>
}

async function voidReturn(): Promise<void> {
  console.log("This returns Promise<void>");
  // Implicitly returns undefined wrapped in Promise
}

// Getting actual return type
type ExplicitReturnType = ReturnType<typeof explicitReturn>; // Promise<string>
type InferredReturnType = ReturnType<typeof inferredReturn>; // Promise<number>
type VoidReturnType = ReturnType<typeof voidReturn>; // Promise<void>

// Using Awaited to get unwrapped type
type ExplicitUnwrapped = Awaited<ExplicitReturnType>; // string
type InferredUnwrapped = Awaited<InferredReturnType>; // number
type VoidUnwrapped = Awaited<VoidReturnType>; // void

console.log("\n=== Async Function Return Types ===");
explicitReturn().then(result => {
  // result is typed as string
  console.log("Explicit return:", result);
});

// ============================================================================
// 10. TYPE-SAFE PROMISE CHAINING
// ============================================================================

// TypeScript: Type inference through promise chains
function chainedOperations(): Promise<void> {
  return Promise.resolve(10)
    .then(value => {
      // value is typed as number
      return value * 2; // Returns Promise<number>
    })
    .then(value => {
      // value is still typed as number
      return `Result: ${value}`; // Returns Promise<string>
    })
    .then(result => {
      // result is typed as string
      console.log("Chain result:", result);
    })
    .catch(error => {
      // error is typed as unknown
      if (error instanceof Error) {
        console.error("Chain error:", error.message);
      }
    });
}

console.log("\n=== Type-Safe Promise Chaining ===");
chainedOperations();

// With explicit intermediate types
interface IntermediateResult {
  doubled: number;
  original: number;
}

Promise.resolve(5)
  .then((value: number): IntermediateResult => ({
    doubled: value * 2,
    original: value
  }))
  .then((result: IntermediateResult) => {
    // TypeScript provides autocomplete for result properties
    console.log("Doubled:", result.doubled);
    console.log("Original:", result.original);
  });

// ============================================================================
// 11. PROMISE RACE AND ANY TYPES
// ============================================================================

// Promise.race - returns type of first settled promise
const racePromises: Promise<number | string>[] = [
  Promise.resolve(42),
  Promise.resolve("hello")
];

Promise.race(racePromises).then(result => {
  // result is typed as number | string (union of all input types)
  console.log("Race result:", result);
});

// Promise.any - returns type of first fulfilled promise
const anyPromises = [
  Promise.reject(new Error("fail")),
  Promise.resolve(100),
  Promise.resolve(200)
];

Promise.any(anyPromises).then(result => {
  // result is typed as number (only fulfilled values)
  console.log("Any result:", result);
}).catch(error => {
  // error is AggregateError when all promises reject
  console.log("All rejected:", error.constructor.name);
});

console.log("\n=== Promise.race and Promise.any Types ===");

// ============================================================================
// 12. FUNCTION TYPE FOR PROMISE CALLBACKS
// ============================================================================

// TypeScript: Type async callbacks
type AsyncCallback<T> = (value: T) => Promise<void> | void;

function processAsync<T>(value: T, callback: AsyncCallback<T>): void {
  const result = callback(value);
  if (result instanceof Promise) {
    result.then(() => console.log("Async callback completed"));
  }
}

// Usage with typed callback
processAsync(42, (value: number) => {
  // value is typed as number
  console.log("Callback received:", value);
});

// Async callback
processAsync("test", async (value: string) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log("Async callback with value:", value.toUpperCase());
});

console.log("\n=== Function Type for Promise Callbacks ===");

// ============================================================================
// 13. TYPE GUARDS WITH PROMISES
// ============================================================================

// Type guard for promise results
function isFulfilled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

function isRejected(
  result: PromiseSettledResult<unknown>
): result is PromiseRejectedResult {
  return result.status === "rejected";
}

// Usage with allSettled
async function typedAllSettled(): Promise<void> {
  const results = await Promise.allSettled([
    Promise.resolve(1),
    Promise.reject(new Error("fail")),
    Promise.resolve(3)
  ]);

  const fulfilled = results.filter(isFulfilled);
  const rejected = results.filter(isRejected);

  // fulfilled has type PromiseFulfilledResult<number>[]
  console.log("Fulfilled values:", fulfilled.map(r => r.value));

  // rejected has type PromiseRejectedResult[]
  console.log("Rejected reasons:", rejected.map(r => r.reason));
}

console.log("\n=== Type Guards with Promises ===");
typedAllSettled();

// ============================================================================
// 14. ABORT SIGNAL TYPING
// ============================================================================

// TypeScript: AbortSignal typing for cancellable operations
async function fetchWithAbort(
  url: string,
  signal: AbortSignal
): Promise<Response> {
  const response = await fetch(url, { signal });
  return response;
}

// Usage with AbortController
async function cancellableFetch(): Promise<void> {
  const controller = new AbortController();
  const signal: AbortSignal = controller.signal;

  try {
    const response = await fetchWithAbort("/api/data", signal);
    console.log("Response status:", response.status);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch was cancelled");
    }
  }
}

console.log("\n=== Abort Signal Typing ===");

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Promises ===\n");
console.log(`
1. ALWAYS specify Promise<T> generic type for clarity
2. Use type inference when generic is obvious from context
3. Let TypeScript infer tuple types in Promise.all
4. Use type guards in catch blocks (error is 'unknown')
5. Create custom error classes extending Error
6. Use Awaited<T> to unwrap Promise types
7. Create generic fetch wrappers for API calls
8. Use interfaces for API response types
9. Filter with type guards for Promise.allSettled results
10. Use ReturnType<> and Awaited<> for complex type extraction

⚠️ COMMON PITFALLS:

1. Forget catch parameter is 'unknown' (not 'any')
   - Must use instanceof or typeof to narrow type

2. Confusing Promise<void> with Promise<undefined>
   - void: no meaningful return value
   - undefined: explicitly returns undefined

3. Not specifying tuple types in Promise.all
   - TypeScript usually infers correctly, but explicit is clearer

4. Using any instead of unknown for errors
   - any defeats type safety
   - unknown requires proper type checking

📘 See 25-promises.js for JavaScript fundamentals!
`);
