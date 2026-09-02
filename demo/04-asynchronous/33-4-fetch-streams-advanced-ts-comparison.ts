// TypeScript vs JavaScript: Fetch API - Streams & Advanced Comparison
// 📘 For JavaScript examples, see: 33-4-fetch-streams-advanced.js
// This file demonstrates TypeScript-specific typing for Fetch API streams

// 🎯 Difficulty: Advanced
export {};

// ============================================================================
// 1. STREAM API TYPES
// ============================================================================

console.log("=== Stream API Types ===");

const API_BASE = "https://jsonplaceholder.typicode.com";

async function typedReadStream(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/posts/1`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // TypeScript: ReadableStream types
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("  ✓ Stream reading complete");
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;

      console.log(`  Received chunk: ${value.length} bytes`);
    }

    console.log(`  Total size: ${result.length} bytes`);
  } catch (error) {
    console.error("  Stream error:", error);
  }
}

typedReadStream();

// ============================================================================
// 2. DOWNLOAD WITH PROGRESS TYPES
// ============================================================================

console.log("\n=== Download with Progress Types ===");

async function typedDownloadWithProgress(
  url: string,
  onProgress?: (loaded: number, total: number, percent: number) => void
): Promise<Uint8Array> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const total = parseInt(contentLength || "0", 10);
    let loaded = 0;

    const reader = response.body!.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress) {
        const percent = total ? Math.round((loaded / total) * 100) : 0;
        onProgress(loaded, total, percent);
        console.log(`  Progress: ${loaded}/${total || "?"} bytes (${percent}%)`);
      }
    }

    // Combine chunks
    const result = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    console.log("  ✓ Download complete");
    return result;
  } catch (error) {
    console.error("  Download error:", error);
    throw error;
  }
}

setTimeout(() => {
  typedDownloadWithProgress(`${API_BASE}/posts/1`);
}, 2000);

// ============================================================================
// 3. STREAM TRANSFORM TYPES
// ============================================================================

console.log("\n=== Stream Transform Types ===");

// TypeScript: TextDecoder and typed arrays
async function typedTransformStream(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/posts/1`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let lineCount = 0;
    let charCount = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("  ✓ Stream processing complete");
        console.log(`  Lines: ${lineCount}, Characters: ${charCount}`);
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      charCount += chunk.length;

      const newlines = chunk.split("\n").length - 1;
      lineCount += newlines;

      console.log(`  Processed ${chunk.length} characters`);
    }
  } catch (error) {
    console.error("  Transform error:", error);
  }
}

setTimeout(() => {
  typedTransformStream();
}, 4000);

// ============================================================================
// 4. CANCELLABLE STREAM TYPES
// ============================================================================

console.log("\n=== Cancellable Stream Types ===");

// TypeScript: AbortController with streams
async function typedCancelableStream(): Promise<void> {
  const controller = new AbortController();

  try {
    const response = await fetch(`${API_BASE}/posts/1`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body!.getReader();
    let byteCount = 0;

    console.log("  Starting to read stream...");

    // Cancel after 30ms (demonstrate only)
    setTimeout(() => {
      console.log("  Cancelling stream...");
      controller.abort("User cancelled");
    }, 30);

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("  Stream completed naturally");
          break;
        }

        byteCount += value.length;
        console.log(`  Read ${value.length} bytes`);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log(`  ✓ Stream cancelled after ${byteCount} bytes`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("  Request was aborted at fetch level");
    }
  }
}

setTimeout(() => {
  typedCancelableStream();
}, 6000);

// ============================================================================
// 5. STREAM VS NON-STREAM COMPARISON
// ============================================================================

console.log("\n=== Stream vs Non-Stream Comparison ===");

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function typedCompareReadingMethods(): Promise<void> {
  // Method 1: Read entire response at once
  console.log("  Method 1: Read all at once");
  const start1 = Date.now();
  const response1 = await fetch(`${API_BASE}/posts/1`);
  const data1 = (await response1.json()) as Post;
  const time1 = Date.now() - start1;
  console.log(`    Time: ${time1}ms, Title: ${data1.title.substring(0, 30)}...`);

  // Method 2: Read as stream
  console.log("\n  Method 2: Read as stream");
  const start2 = Date.now();
  const response2 = await fetch(`${API_BASE}/posts/1`);
  const reader2 = response2.body!.getReader();
  let byteCount = 0;

  while (true) {
    const { done, value } = await reader2.read();
    if (done) break;
    byteCount += value.length;
  }

  const time2 = Date.now() - start2;
  console.log(`    Time: ${time2}ms, Bytes: ${byteCount}`);

  console.log("\n  Comparison:");
  console.log(`    Non-stream: ${time1}ms`);
  console.log(`    Stream: ${time2}ms`);
  console.log("    Streams are better for large files, real-time processing");
}

setTimeout(() => {
  typedCompareReadingMethods();
}, 8000);

// ============================================================================
// 6. UTILITY TYPES FOR FETCH
// ============================================================================

console.log("\n=== Utility Types for Fetch ===");

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Omit properties from type
type CreateUserInput = Omit<User, "id">;
// Equivalent to: { name: string; email: string; username: string }

// Pick specific properties
type UserNameOnly = Pick<User, "name" | "email">;
// Equivalent to: { name: string; email: string }

// Make all properties optional
type PartialUser = Partial<User>;
// Equivalent to: { id?: number; name?: string; ... }

// Make all properties required
type RequiredUser = Required<PartialUser>;
// Equivalent to: { id: number; name: string; ... }

// Exclude null and undefined
type NonNullableUser = NonNullable<User | null | undefined>;
// Equivalent to: User

// Extract specific types
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type UserStringKeys = StringKeys<User>;
// "name" | "email" | "username"

async function useUtilityTypes(): Promise<void> {
  // CreateUserInput - User without id
  const createUser: CreateUserInput = {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
  };
  console.log("Create user input:", createUser.name);

  // UserNameOnly - only name and email
  const userName: UserNameOnly = { name: "John", email: "john@example.com" };
  console.log("User name only:", userName.name);

  // StringKeys utility
  const stringKeys: UserStringKeys = "name";
  console.log("String key:", stringKeys);
}

useUtilityTypes();

// ============================================================================
// 7. QUERY PARAMETER TYPES
// ============================================================================

console.log("\n=== Query Parameter Types ===");

// TypeScript: Typed query parameter builder
type QueryValue = string | number | boolean | null | undefined;

function buildQueryString(params: Record<string, QueryValue>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

function buildUrl(baseUrl: string, params?: Record<string, QueryValue>): string {
  if (!params) return baseUrl;

  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// Usage with typed parameters
// type alias (not interface) so it's assignable to Record<string, QueryValue>
type UserQueryParams = {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
};

async function fetchUsers(params: UserQueryParams): Promise<User[]> {
  const url = buildUrl(`${API_BASE}/users`, params);

  const response = await fetch(url);
  return (await response.json()) as User[];
}

async function useQueryParams(): Promise<void> {
  const users = await fetchUsers({
    _page: 1,
    _limit: 3,
  });

  console.log(
    "Fetched users:",
    users.map(u => u.name)
  );
}

useQueryParams();

// ============================================================================
// 8. RESPONSE TRANSFORMER TYPES
// ============================================================================

console.log("\n=== Response Transformer Types ===");

// TypeScript: Typed response transformers
type Transformer<T, U> = (data: T) => U;

async function fetchWithTransform<T, U>(
  url: string,
  transformer: Transformer<T, U>,
  options?: RequestInit
): Promise<U> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as T;
  return transformer(data);
}

// Usage
const userTransformer: Transformer<User, string> = (user: User) => {
  return `${user.name} <${user.email}>`;
};

async function useTransformers(): Promise<void> {
  const userString = await fetchWithTransform<User, string>(`${API_BASE}/users/1`, userTransformer);

  console.log("Transformed user:", userString);
}

useTransformers();

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Streams & Advanced ===\n");
console.log(`
1. TYPE STREAM READERS PROPERLY
   - response.body!.getReader() (non-null assertion
   - Use ReadableStreamDefaultReader<Uint8Array>

2. TYPE PROGRESS CALLBACKS
   - onProgress?: (loaded, total, percent) => void

3. USE UTILITY TYPES
   - Omit<T>, Pick<T>, Partial<T>
   - For request/response types

4. TYPE QUERY PARAM BUILDERS
   - QueryValue = string | number | boolean | null | undefined

5. USE TRANSFORMER TYPES
   - Transformer<T, U> = (data: T) => U
   - Type-safe response transformation

6. CANCELLABLE STREAMS WITH TYPES
   - AbortController with signal
   - Proper typing for abort reasons

7. PROPERLY TYPE TEXTDECODER
   - decoder.decode(value, { stream: true })
   - Typed arrays for chunks

8. STREAM COMBINING
   - Combine chunks into single Uint8Array

⚠️ COMMON PITFALLS:

1. Forgetting response.body can be null
   - Always use ! or check for null

2. Not checking response.ok before reading streams
   - Always check first

3. Not handling AbortError
   - Use type guard for AbortError name

4. Typo in DOMException vs Error
   - Check error instanceof DOMException for abort

📘 See 33-4-fetch-streams-advanced.js for JavaScript fundamentals!
`);

// ============================================================================
// CROSS REFERENCES
// ============================================================================

console.log("\n=== Cross References ===");
console.log("📘 33-1-fetch-basics-ts-comparison.ts - Fetch basics with TypeScript");
console.log("📘 33-2-fetch-error-handling-ts-comparison.ts - Error handling with TypeScript");
console.log(
  "📘 33-3-fetch-practical-patterns-ts-comparison.ts - Advanced patterns with TypeScript"
);
