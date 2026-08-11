// TypeScript vs JavaScript: Fetch API - Basics Comparison
// 📘 For JavaScript examples, see: 33.1-fetch-basics.js
// This file demonstrates TypeScript-specific typing for Fetch API basics

export {};

// ============================================================================
// 1. FETCH FUNCTION TYPES
// ============================================================================

console.log("=== Fetch Function Types ===");

// TypeScript: Built-in fetch types
// fetch(): Promise<Response>
// - Built into TypeScript's lib.dom.d.ts or lib.dom.iterable.d.ts
// - Also available in Node.js 18+ with @types/node

// Basic fetch with type inference
async function basicFetch(): Promise<void> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  // response is typed as Response (from DOM lib)
  console.log("Status:", response.status);
  console.log("OK:", response.ok);

  // Headers iteration - use forEach instead of entries
  let headerCount = 0;
  response.headers.forEach(() => headerCount++);
  console.log("Headers:", headerCount);
}

basicFetch();

// ============================================================================
// 2. REQUESTINIT TYPE
// ============================================================================

console.log("\n=== RequestInit Type ===");

// TypeScript: RequestInit interface for fetch options
async function typedRequestInit(): Promise<void> {
  // RequestInit is built-in TypeScript type
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: "Post", body: "Content", userId: 1 })
  };

  console.log("RequestInit method:", options.method);
  console.log("RequestInit headers:", JSON.stringify(options.headers));
}

typedRequestInit();

// Custom headers with Record type
async function customHeaders(): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123",
    "X-Custom-Header": "value"
  };

  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    method: "GET",
    headers
  });

  console.log("Custom headers set:", Object.keys(headers).length);
  console.log("Response OK:", response.ok);
}

customHeaders();

// ============================================================================
// 3. RESPONSE TYPE
// ============================================================================

console.log("\n=== Response Type ===");

// TypeScript: Response interface methods
async function typedResponse(): Promise<void> {
  const response: Response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  // Response properties (all typed)
  const status: number = response.status;
  const statusText: string = response.statusText;
  const ok: boolean = response.ok;
  const type: ResponseType = response.type; // "basic" | "cors" | "default" | "error" | "opaque"
  const url: string = response.url;
  const headers: Headers = response.headers;

  console.log("Response status:", status);
  console.log("Response ok:", ok);
  console.log("Response type:", type);

  // Response body methods (all return Promise)
  // json(): Promise<unknown>
  // text(): Promise<string>
  // blob(): Promise<Blob>
  // arrayBuffer(): Promise<ArrayBuffer>
  // formData(): Promise<FormData>
}

typedResponse();

// ============================================================================
// 4. GENERIC FETCH WRAPPER
// ============================================================================

console.log("\n=== Generic Fetch Wrapper ===");

// TypeScript: Generic fetch function with type parameter
interface ApiResponseType<T> {
  data: T;
  status: number;
  statusText: string;
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponseType<T>> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as T;

  return {
    data,
    status: response.status,
    statusText: response.statusText
  };
}

// Usage with explicit type parameter
interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function useGenericFetch(): Promise<void> {
  // Explicit type parameter - T is User
  const userResponse = await fetchApi<User>("https://jsonplaceholder.typicode.com/users/1");
  console.log("User:", userResponse.data.name, userResponse.data.email);

  // Explicit type parameter - T is Post[]
  const postsResponse = await fetchApi<Post[]>("https://jsonplaceholder.typicode.com/posts?_limit=3");
  console.log("Posts count:", postsResponse.data.length);
  postsResponse.data.forEach(post => console.log("Post:", post.title));
}

useGenericFetch();

// ============================================================================
// 5. RESPONSE METHODS TYPES
// ============================================================================

console.log("\n=== Response Methods Types ===");

async function responseMethods(): Promise<void> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  // json() - returns Promise<unknown>
  const jsonData = await response.json() as Post;
  console.log("JSON data:", jsonData.title);

  // text() - returns Promise<string>
  const textResponse = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const textData = await textResponse.text();
  console.log("Text data length:", textData.length);

  // arrayBuffer() - returns Promise<ArrayBuffer>
  const abResponse = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const abData = await abResponse.arrayBuffer();
  console.log("ArrayBuffer byte length:", abData.byteLength);

  // blob() - returns Promise<Blob>
  console.log("\n⚠️ Blob and FormData examples skipped (browser-only)");
}

responseMethods();

// ============================================================================
// 6. FORMDATA TYPES
// ============================================================================

console.log("\n=== FormData Types ===");

async function typedFormData(): Promise<void> {
  // TypeScript: FormData is a built-in type
  const formData: FormData = new FormData();
  formData.append("title", "File Upload Post");
  formData.append("body", "Content with file attachment");
  formData.append("userId", "1");

  // Note: Don't set Content-Type header with FormData
  // Browser sets it automatically with boundary
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  console.log("FormData upload result:", result);
}

typedFormData();

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Fetch Basics ===\n");
console.log(`
1. USE GENERIC FETCH WRAPPERS
   - fetchApi<T>(url) returns Promise<ApiResponse<T>>
   - Type-safe response data

2. TYPE REQUESTINIT AND RESPONSE
   - const options: RequestInit = { ... }
   - const response: Response = await fetch(url)

3. USE RECORD<T, U> FOR HEADERS
   - Record<string, string> for header maps
   - Type-safe header manipulation

4. TYPE RESPONSE BODY METHODS
   - await response.json() as T
   - response.text(): Promise<string>
   - response.blob(): Promise<Blob>

5. USE INTERFACES FOR DATA TYPES
   - Define User, Post interfaces
   - Explicitly type your response data

⚠️ COMMON PITFALLS:

1. Forgetting that response.json() returns Promise<unknown>
   - Always cast: await response.json() as T

2. Not checking response.ok before parsing
   - Always check: if (!response.ok) throw ...

3. Using 'any' for everything
   - Use proper interfaces or unknown

📘 See 33.1-fetch-basics.js for JavaScript fundamentals!
`);

// ============================================================================
// CROSS REFERENCES
// ============================================================================

console.log("\n=== Cross References ===");
console.log("📘 33.2-fetch-error-handling-ts-comparison.ts - Error handling with TypeScript");
console.log("📘 33.3-fetch-practical-patterns-ts-comparison.ts - Advanced patterns with TypeScript");
console.log("📘 33.4-fetch-streams-advanced-ts-comparison.ts - Streams with TypeScript");
