// TypeScript vs JavaScript: Async/Await Comparison
// 📘 For JavaScript examples, see: 31-async-await.js
// This file demonstrates TypeScript-specific typing for async/await

// 🎯 Difficulty: Intermediate
export {};

// ============================================================================
// 1. ASYNC FUNCTION RETURN TYPE ANNOTATIONS
// ============================================================================

// JavaScript: No explicit return type
// async function getData() {
//   return { data: "value" };
// }

// TypeScript: Explicit Promise<T> return type
async function getData(): Promise<{ data: string }> {
  return { data: "value" };
  // return { data: 123 }; // ❌ Error: Type 'number' is not assignable to type 'string'
}

// Type inference - TypeScript can often infer the return type
async function inferredReturn() {
  return { data: "value" }; // TypeScript infers Promise<{ data: string }>
}

console.log("=== Async Function Return Types ===");
getData().then(result => {
  // result is typed as { data: string }
  console.log("Data:", result.data);
});

// ============================================================================
// 2. AWAIT TYPE INFERENCE
// ============================================================================

// TypeScript: await automatically unwraps Promise type
async function awaitTypeDemo(): Promise<void> {
  const promise: Promise<string> = Promise.resolve("hello");

  // await unwraps Promise<string> to string
  const value = await promise;

  // value is typed as string (not Promise<string>)
  const upper: string = value.toUpperCase();
  console.log("Awaited value:", upper);
}

console.log("\n=== Await Type Inference ===");
awaitTypeDemo();

// Multiple awaits with type inference
async function multipleAwaits(): Promise<void> {
  const numPromise: Promise<number> = Promise.resolve(42);
  const strPromise: Promise<string> = Promise.resolve("hello");

  const num = await numPromise; // Type: number
  const str = await strPromise; // Type: string

  // Type-safe operations
  const result: number = num * 2;
  const combined: string = str + " world";

  console.log("Multiple awaits:", result, combined);
}

multipleAwaits();

// ============================================================================
// 3. GENERIC ASYNC FUNCTIONS
// ============================================================================

// TypeScript: Generic type parameter for async functions
async function fetchItem<T>(id: number): Promise<T> {
  // Simulated fetch - in reality would call API
  const response = await Promise.resolve({ id, data: "item data" } as T);
  return response;
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
}

async function useGenericFetch(): Promise<void> {
  // Explicit type parameter - returns Promise<User>
  const user = await fetchItem<User>(1);
  console.log("User:", user.name);

  // Explicit type parameter - returns Promise<Post>
  const post = await fetchItem<Post>(2);
  console.log("Post:", post.title);
}

console.log("\n=== Generic Async Functions ===");
useGenericFetch();

// Generic with constraints
interface Identifiable {
  id: number;
}

async function fetchWithConstraint<T extends Identifiable>(id: number): Promise<T> {
  return { id, name: "Item" } as unknown as T;
}

// ✅ OK - User extends Identifiable (has id property)
interface Product extends Identifiable {
  name: string;
  price: number;
}

// ❌ Error - doesn't satisfy Identifiable constraint
// interface Invalid { name: string; } // No id property!

fetchWithConstraint<Product>(1).then(product => {
  // TypeScript knows product has id, name, and price
  console.log("Product:", product.name, product.price);
});

// ============================================================================
// 4. ERROR HANDLING WITH TYPED CATCH
// ============================================================================

// TypeScript 4.4+: catch parameter is 'unknown' by default
async function typedErrorHandling(): Promise<void> {
  try {
    await Promise.reject(new Error("Something went wrong"));
  } catch (error: unknown) {
    // error is 'unknown' - must use type guard

    if (error instanceof Error) {
      // TypeScript knows error has message, stack properties
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

// Custom error types with type guards
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

function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    typeof error.statusCode === "number" &&
    typeof error.endpoint === "string"
  );
}

async function fetchWithCustomError(): Promise<void> {
  try {
    // Simulated API call that might fail
    throw new ApiError("Not found", 404, "/api/users");
  } catch (error: unknown) {
    if (isApiError(error)) {
      // TypeScript knows error is ApiError after type guard
      console.log(`API Error ${error.statusCode} at ${error.endpoint}`);
    }
  }
}

fetchWithCustomError();

// ============================================================================
// 5. PROMISE.ALL WITH TUPLE TYPE INFERENCE
// ============================================================================

// TypeScript: Preserves tuple types through await
async function promiseAllTypes(): Promise<void> {
  const numPromise: Promise<number> = Promise.resolve(42);
  const strPromise: Promise<string> = Promise.resolve("hello");
  const boolPromise: Promise<boolean> = Promise.resolve(true);

  // TypeScript infers tuple type [number, string, boolean]
  const [num, str, bool] = await Promise.all([numPromise, strPromise, boolPromise]);

  // Each variable has correct type
  const doubled: number = num * 2;
  const upper: string = str.toUpperCase();
  const negated: boolean = !bool;

  console.log("Tuple types:", doubled, upper, negated);
}

console.log("\n=== Promise.all Tuple Types ===");
promiseAllTypes();

// Without destructuring - still type-safe
async function promiseAllWithoutDestructuring(): Promise<void> {
  const results: [number, string] = await Promise.all([
    Promise.resolve(100),
    Promise.resolve("world"),
  ]);

  // results has tuple type [number, string]
  console.log("First:", results[0]); // Type: number
  console.log("Second:", results[1]); // Type: string
}

promiseAllWithoutDestructuring();

// ============================================================================
// 6. ASYNC ARROW FUNCTION TYPES
// ============================================================================

// TypeScript: Explicit type for async arrow functions
const asyncFn: (x: number) => Promise<number> = async x => x * 2;

// With multiple parameters
const asyncFnMulti: (a: number, b: number) => Promise<number> = async (a, b) => a + b;

// With object parameters
interface Options {
  value: number;
  multiplier: number;
}

const asyncFnObject: (opts: Options) => Promise<number> = async ({ value, multiplier }) =>
  value * multiplier;

console.log("\n=== Async Arrow Function Types ===");
asyncFn(5).then(result => {
  console.log("Arrow function result:", result); // 10
});

asyncFnMulti(3, 4).then(result => {
  console.log("Multi-param result:", result); // 7
});

asyncFnObject({ value: 10, multiplier: 3 }).then(result => {
  console.log("Object param result:", result); // 30
});

// Infer type from assignment
const inferredAsyncFn = async (x: number): Promise<number> => x * 2;
// TypeScript infers type: (x: number) => Promise<number>

// ============================================================================
// 7. AWAITED<T> UTILITY TYPE
// ============================================================================

// Awaited<T> - Unwrap Promise types (TypeScript 4.5+)
type SimplePromise = Awaited<Promise<string>>; // string
type NestedPromise = Awaited<Promise<Promise<number>>>; // number
type MaybePromise = Awaited<string | Promise<number>>; // string | number

// With complex types
interface ComplexData {
  users: User[];
  total: number;
}

type UnwrappedComplex = Awaited<Promise<ComplexData>>; // ComplexData

// Practical: Extract return type from async function
async function complexFunction(): Promise<ComplexData> {
  return { users: [], total: 0 };
}

// Use ReturnType + Awaited to get unwrapped return type
type ComplexReturn = Awaited<ReturnType<typeof complexFunction>>; // ComplexData

console.log("\n=== Awaited<T> Utility Type ===");
const typeCheck: ComplexReturn = {
  users: [{ id: 1, name: "Test", email: "test@example.com" }],
  total: 1,
};
console.log("Type check:", typeCheck.total);

// Generic function using Awaited
async function processAsync<T>(promise: Promise<T>): Promise<Awaited<Promise<T>>> {
  const result: Awaited<Promise<T>> = await promise;
  return result;
}

processAsync(Promise.resolve("hello")).then(result => {
  // result is typed as string
  console.log("Processed:", result.toUpperCase());
});

// ============================================================================
// 8. ASYNC FUNCTION OVERLOADS
// ============================================================================

// TypeScript: Function overloads for async functions
async function fetchData(url: string): Promise<Response>;
async function fetchData(url: string, parseAs: "json"): Promise<unknown>;
async function fetchData(url: string, parseAs: "text"): Promise<string>;
async function fetchData(url: string, parseAs: "blob"): Promise<Blob>;
async function fetchData(
  url: string,
  parseAs: "json" | "text" | "blob" = "json"
): Promise<unknown | string | Blob> {
  const response = await fetch(url);

  switch (parseAs) {
    case "text":
      return response.text();
    case "blob":
      return response.blob();
    default:
      return response.json();
  }
}

// Usage - TypeScript infers return type based on arguments
async function useOverloads(): Promise<void> {
  // Returns Promise<unknown>
  const jsonData = await fetchData("/api/data");

  // Returns Promise<string>
  const textData = await fetchData("/api/data", "text");

  // Returns Promise<Blob>
  const blobData = await fetchData("/api/data", "blob");

  console.log("Overload types:", typeof jsonData, typeof textData, typeof blobData);
}

console.log("\n=== Async Function Overloads ===");
// useOverloads(); // Would run with actual API

// ============================================================================
// 9. THIS TYPING IN ASYNC METHODS
// ============================================================================

// TypeScript: Type 'this' in async methods
class AsyncService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Explicit 'this' type
  async fetchUser(this: AsyncService, id: number): Promise<User> {
    // 'this' is typed as AsyncService
    const url = `${this.baseUrl}/users/${id}`;
    // Simulated fetch
    return { id, name: "User", email: "user@example.com" };
  }

  // Method returning Promise<this> for chaining
  async withRetry(): Promise<this> {
    // Retry logic
    return this;
  }
}

// Usage
const service = new AsyncService("https://api.example.com");

console.log("\n=== This Typing in Async Methods ===");
service.fetchUser(1).then(user => {
  console.log("User from service:", user.name);
});

// This binding issue prevention
class DataFetcher {
  private apiKey: string = "secret";

  // Arrow function preserves 'this'
  fetch = async (id: number): Promise<string> => {
    // 'this.apiKey' is accessible and typed
    return `Fetched ${id} with key ${this.apiKey}`;
  };

  // Regular method - 'this' might be lost
  async fetchRegular(id: number): Promise<string> {
    return `Regular fetch ${id}`;
  }
}

const fetcher = new DataFetcher();

// Arrow function - 'this' is preserved
const arrowFetch = fetcher.fetch;
arrowFetch(1).then(result => console.log("Arrow:", result));

// Regular method - might lose 'this' when destructured
const regularFetch = fetcher.fetchRegular.bind(fetcher);
regularFetch(1).then(result => console.log("Regular:", result));

// ============================================================================
// 10. ASYNC GENERATOR TYPES
// ============================================================================

// TypeScript: AsyncIterableIterator<T> return type
async function* asyncNumberGenerator(): AsyncIterableIterator<number> {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 10));
    yield i;
  }
}

// Custom async iterable class
class AsyncRange implements AsyncIterable<number> {
  constructor(
    private from: number,
    private to: number,
    private delay: number = 10
  ) {}

  [Symbol.asyncIterator](): AsyncIterator<number> {
    let current = this.from;
    const to = this.to;
    const delay = this.delay;

    return {
      next: async (): Promise<IteratorResult<number>> => {
        if (current <= to) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return { value: current++, done: false };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

async function useAsyncGenerator(): Promise<void> {
  console.log("\n=== Async Generator Types ===");

  // Using async generator
  for await (const num of asyncNumberGenerator()) {
    // num is typed as number
    console.log("Generated:", num);
  }

  // Using custom async iterable
  const range = new AsyncRange(1, 3);
  for await (const num of range) {
    console.log("Range:", num);
  }
}

useAsyncGenerator();

// ============================================================================
// 11. CONDITIONAL TYPES WITH PROMISES
// ============================================================================

// TypeScript: Conditional types for Promise handling
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>; // number
type C = UnwrapPromise<Promise<{ id: number }>>; // { id: number }

// More complex conditional
type DeepUnwrap<T> =
  T extends Promise<infer U> ? DeepUnwrap<U> : T extends Array<infer U> ? DeepUnwrap<U>[] : T;

type D = DeepUnwrap<Promise<Promise<string>>>; // string
type E = DeepUnwrap<Promise<number[]>>; // number[]

console.log("\n=== Conditional Types with Promises ===");
const conditionalCheck: DeepUnwrap<Promise<number[]>> = [1, 2, 3];
console.log("Conditional check:", conditionalCheck);

// ============================================================================
// 12. MAPPED TYPES WITH PROMISES
// ============================================================================

// TypeScript: Make all properties of a type Promise-wrapped
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>;
};

interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

type AsyncConfig = Promisify<Config>;
// Equivalent to:
// {
//   apiUrl: Promise<string>;
//   timeout: Promise<number>;
//   retries: Promise<number>;
// }

// Unwrap all properties
type Unpromisify<T> = {
  [K in keyof T]: Awaited<T[K]>;
};

type SyncConfig = Unpromisify<AsyncConfig>;
// Back to original Config type

async function useMappedTypes(): Promise<void> {
  console.log("\n=== Mapped Types with Promises ===");

  const asyncConfig: AsyncConfig = {
    apiUrl: Promise.resolve("https://api.example.com"),
    timeout: Promise.resolve(5000),
    retries: Promise.resolve(3),
  };

  // Use Promise.all with object values (not keys)
  const results = await Promise.all([asyncConfig.apiUrl, asyncConfig.timeout, asyncConfig.retries]);

  const apiUrl = results[0];
  const timeout = results[1];
  const retries = results[2];

  console.log("Config:", apiUrl, timeout, retries);
}

useMappedTypes();

// ============================================================================
// 13. TYPE-SAFE RETRY PATTERN
// ============================================================================

// Generic retry function with type preservation
async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

// Usage with type preservation
async function useRetry(): Promise<void> {
  console.log("\n=== Type-Safe Retry Pattern ===");

  // TypeScript knows result type is string
  const result = await retry(
    async () => {
      return "success";
    },
    3,
    100
  );

  // result is typed as string
  console.log("Retry result:", result.toUpperCase());

  // With object type
  const userData = await retry(
    async (): Promise<User> => {
      return { id: 1, name: "User", email: "user@example.com" };
    },
    3,
    100
  );

  // userData is typed as User
  console.log("User data:", userData.name);
}

useRetry();

// ============================================================================
// 14. ABORT SIGNAL TYPING
// ============================================================================

// TypeScript: AbortSignal in async functions
async function fetchWithCancellation(url: string, signal: AbortSignal): Promise<Response> {
  const response = await fetch(url, { signal });
  return response;
}

// Factory function with AbortController
function createCancellableFetcher() {
  const controller = new AbortController();

  return {
    fetch: (url: string) => fetchWithCancellation(url, controller.signal),
    cancel: () => controller.abort(),
    get signal(): AbortSignal {
      return controller.signal;
    },
  };
}

async function useCancellableFetch(): Promise<void> {
  console.log("\n=== Abort Signal Typing ===");

  const fetcher = createCancellableFetcher();

  try {
    const response = await fetcher.fetch("/api/data");
    console.log("Response status:", response.status);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch was cancelled");
    }
  }
}

// useCancellableFetch();

// ============================================================================
// 15. SEQUENTIAL VS PARALLEL TYPE PATTERNS
// ============================================================================

// TypeScript: Type-safe sequential vs parallel patterns
async function sequentialPattern(): Promise<void> {
  console.log("\n=== Sequential vs Parallel Patterns ===");

  // Sequential - types are inferred step by step
  const step1: number = await Promise.resolve(10);
  const step2: number = await Promise.resolve(step1 * 2);
  const step3: boolean = await Promise.resolve(step2 > 0);

  console.log("Sequential:", step1, step2, step3);
}

async function parallelPattern(): Promise<void> {
  // Parallel - tuple types preserved
  const [num, str, bool] = (await Promise.all([
    Promise.resolve(100),
    Promise.resolve("parallel"),
    Promise.resolve(true),
  ])) as [number, string, boolean];

  // Types: num: number, str: string, bool: boolean
  console.log("Parallel:", num, str, bool);
}

sequentialPattern();
parallelPattern();

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Async/Await ===\n");
console.log(`
1. ALWAYS annotate async function return types for clarity
2. Use type inference when generic is obvious from context
3. Let TypeScript infer tuple types in Promise.all
4. Use type guards in catch blocks (error is 'unknown')
5. Create custom error classes extending Error
6. Use Awaited<T> to unwrap Promise types
7. Create generic async functions for API calls
8. Use function overloads for different return types
9. Use arrow functions to preserve 'this' binding
10. Use AsyncIterableIterator<T> for async generators

⚠️ COMMON PITFALLS:

1. Forget async functions always return Promise<T>
   - Even returning void becomes Promise<void>

2. Confusing Awaited<T> with ReturnType<T>
   - ReturnType: gets Promise<T> from async function
   - Awaited: unwraps Promise<T> to T

3. Not using type guards for catch errors
   - error is 'unknown' - must check type

4. Losing 'this' in async methods
   - Use arrow functions or bind explicitly

5. Sequential await when parallel is better
   - Use Promise.all for independent operations

📘 See 31-async-await.js for JavaScript fundamentals!
`);
