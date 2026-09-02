// TypeScript vs JavaScript: Fetch API - Error Handling Comparison
// 📘 For JavaScript examples, see: 33.2-fetch-error-handling.js
// This file demonstrates TypeScript-specific typing for Fetch API error handling

// 🎯 Difficulty: Intermediate
export {};

// ============================================================================
// 1. ERROR HANDLING TYPES
// ============================================================================

console.log("=== Error Handling Types ===");

// TypeScript: Typed error handling for fetch
class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string
  ) {
    super(message);
    this.name = "FetchError";
  }
}

type FetchResult<T> =
  { success: true; data: T; response: Response } | { success: false; error: FetchError };

async function safeFetch<T>(url: string, options?: RequestInit): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      return {
        success: false,
        error: new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          url
        ),
      };
    }

    const data = (await response.json()) as T;

    return {
      success: true,
      data,
      response,
    };
  } catch (error) {
    if (error instanceof FetchError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new FetchError(error instanceof Error ? error.message : "Unknown error", 0, "", url),
    };
  }
}

// Type guard for FetchResult
function isSuccess<T>(
  result: FetchResult<T>
): result is { success: true; data: T; response: Response } {
  return result.success;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

async function useSafeFetch(): Promise<void> {
  // Success case
  const successResult = await safeFetch<User>("https://jsonplaceholder.typicode.com/users/1");

  if (isSuccess(successResult)) {
    // TypeScript knows data and response exist after type guard
    console.log("Success:", successResult.data.name);
    console.log("Response status:", successResult.response.status);
  } else {
    // TypeScript knows error exists after type guard
    console.log("Error:", successResult.error.message);
  }

  // Error case (nonexistent post)
  const errorResult = await safeFetch<User>("https://jsonplaceholder.typicode.com/posts/999999");

  if (!isSuccess(errorResult)) {
    // TypeScript knows error exists after type guard
    console.log("HTTP error:", errorResult.error.message, "Status:", errorResult.error.status);
  }
}

useSafeFetch();

// ============================================================================
// 2. TIMEOUT TYPES
// ============================================================================

console.log("\n=== Timeout Types ===");

// Typed timeout function
function fetchWithTimeout<T = unknown>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  const { signal: originalSignal, ...restOptions } = options;

  // Combine signals if provided
  if (originalSignal) {
    originalSignal.addEventListener("abort", () => {
      controller.abort(originalSignal.reason);
    });
  }

  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Timeout after ${timeoutMs}ms`));
  }, timeoutMs);

  return fetch(url, {
    ...restOptions,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

// Usage with type inference
async function useTypedTimeout(): Promise<void> {
  try {
    const response = await fetchWithTimeout(
      "https://jsonplaceholder.typicode.com/posts/1",
      { method: "GET" },
      10000
    );
    const data: unknown = await response.json();
    console.log("Timed fetch completed successfully");
    console.log("Data:", data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request timed out");
    } else if (error instanceof Error) {
      console.log("Error:", error.message);
    }
  }
}

useTypedTimeout();

// ============================================================================
// 3. ASYNC/AWAIT TYPES
// ============================================================================

console.log("\n=== Async/Await Types ===");

// TypeScript: Strong typing for async/await fetch patterns
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function fetchPostClean(postId: number): Promise<Post> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as Post;
}

async function demonstrateAsyncAwait(): Promise<void> {
  try {
    const post = await fetchPostClean(1);
    console.log("Fetched post:", post.title);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
  }
}

demonstrateAsyncAwait();

// ============================================================================
// 4. SEQUENTIAL VS PARALLEL TYPES
// ============================================================================

console.log("\n=== Sequential vs Parallel Types ===");

async function sequentialVsParallel(): Promise<void> {
  // Sequential (slower - waits for each request)
  console.log("\nSequential approach:");
  const startSeq = Date.now();

  try {
    const post1 = await fetch("https://jsonplaceholder.typicode.com/posts/1").then(
      r => r.json() as Promise<Post>
    );
    const post2 = await fetch("https://jsonplaceholder.typicode.com/posts/2").then(
      r => r.json() as Promise<Post>
    );
    const post3 = await fetch("https://jsonplaceholder.typicode.com/posts/3").then(
      r => r.json() as Promise<Post>
    );

    const endSeq = Date.now();
    console.log("Sequential time:", endSeq - startSeq, "ms");
    console.log("Got posts:", post1.title, post2.title, post3.title);
  } catch (error) {
    console.error("Sequential error:", error);
  }

  // Parallel (faster - all requests start together)
  console.log("\nParallel approach (Promise.all):");
  const startPar = Date.now();

  try {
    const [post1, post2, post3] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/posts/1").then(r => r.json() as Promise<Post>),
      fetch("https://jsonplaceholder.typicode.com/posts/2").then(r => r.json() as Promise<Post>),
      fetch("https://jsonplaceholder.typicode.com/posts/3").then(r => r.json() as Promise<Post>),
    ]);

    const endPar = Date.now();
    console.log("Parallel time:", endPar - startPar, "ms");
    console.log("Got posts:", post1.title, post2.title, post3.title);
  } catch (error) {
    console.error("Parallel error:", error);
  }
}

sequentialVsParallel();

// ============================================================================
// 5. UNION TYPES FOR API RESPONSES
// ============================================================================

console.log("\n=== Union Types for API Responses ===");

// TypeScript: Union types for different API response formats
type ApiVersion = "v1" | "v2" | "v3";

interface ApiV1Response {
  version: "v1";
  data: unknown;
}

interface ApiV2Response {
  version: "v2";
  data: unknown;
  meta: {
    page: number;
    total: number;
  };
}

interface ApiV3Response {
  version: "v3";
  data: unknown;
  meta: {
    page: number;
    total: number;
  };
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
}

type ApiResponse = ApiV1Response | ApiV2Response | ApiV3Response;

function isV2Response(response: ApiResponse): response is ApiV2Response {
  return response.version === "v2";
}

function isV3Response(response: ApiResponse): response is ApiV3Response {
  return response.version === "v3";
}

async function handleVersionedResponse(): Promise<void> {
  // Mock responses to demonstrate type narrowing
  const v1Response: ApiV1Response = { version: "v1", data: { id: 1 } };
  const v2Response: ApiV2Response = {
    version: "v2",
    data: { id: 1 },
    meta: { page: 1, total: 100 },
  };
  const v3Response: ApiV3Response = {
    version: "v3",
    data: { id: 1 },
    meta: { page: 1, total: 100 },
    links: { self: "/api/v1", next: "/api/v1?page=2" },
  };

  // Type narrowing with type guards
  function processResponse(response: ApiResponse): void {
    if (isV3Response(response)) {
      // TypeScript knows response has meta and links
      console.log("V3 Response with links:", response.links);
      console.log("Meta:", response.meta);
    } else if (isV2Response(response)) {
      // TypeScript knows response has meta
      console.log("V2 Response with meta:", response.meta);
    } else {
      // V1 response - basic format
      console.log("V1 Response:", response.version);
    }
  }

  processResponse(v1Response);
  processResponse(v2Response);
  processResponse(v3Response);
}

handleVersionedResponse();

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Error Handling ===\n");
console.log(`
1. CREATE TYPE-SAFE ERROR CLASSES
   - Extend Error with custom properties
   - FetchError with status, url, etc.

2. USE UNION TYPES FOR RESULTS
   - FetchResult<T> = { success: true } | { success: false }
   - Type guards for narrowing

3. TYPE ABORTSIGNAL PROPERLY
   - signal: AbortSignal
   - Type abort reasons

4. USE TRY/CATCH WITH TYPED ERROR HANDLING
   - catch (error: unknown)
   - Use type guards (instanceof Error)

5. USE PROMISE.ALL WITH TYPED RESULTS
   - Promise.all<T1, T2, T3>(...)
   - Properly typed tuple result

6. STRONG TYPE YOUR DATA INTERFACES
   - User, Post interfaces
   - Explicit types for all API data

⚠️ COMMON PITFALLS:

1. Not typing error in catch blocks
   - Always use: catch (error: unknown)

2. Forgetting that response.ok is not caught by catch()
   - Check response.ok manually

3. Using 'any' instead of 'unknown' for unvalidated data
   - unknown is safer for external data

4. Not using type guards with result unions
   - isSuccess() pattern makes narrowing safe

📘 See 33.2-fetch-error-handling.js for JavaScript fundamentals!
`);

// ============================================================================
// CROSS REFERENCES
// ============================================================================

console.log("\n=== Cross References ===");
console.log("📘 33.1-fetch-basics-ts-comparison.ts - Fetch basics with TypeScript");
console.log(
  "📘 33.3-fetch-practical-patterns-ts-comparison.ts - Advanced patterns with TypeScript"
);
console.log("📘 33.4-fetch-streams-advanced-ts-comparison.ts - Streams with TypeScript");
