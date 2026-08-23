// TypeScript vs JavaScript: Fetch API Comparison
// 📘 For JavaScript examples, see: 33-fetch-api.js
// This file demonstrates TypeScript-specific typing for Fetch API

export {};

// ============================================================================
// 1. FETCH FUNCTION TYPES
// ============================================================================

// TypeScript: Built-in fetch types
// fetch(): Promise<Response>
// - Built into TypeScript's lib.dom.d.ts or lib.dom.iterable.d.ts
// - Also available in Node.js 18+ with @types/node

// Basic fetch with type inference
async function basicFetch(): Promise<void> {
  console.log("=== Fetch Function Types ===");

  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  // response is typed as Response (from DOM lib)
  console.log("Status:", response.status);
  console.log("OK:", response.ok);

  // Headers iteration - use forEach instead of entries
  let headerCount = 0;
  response.headers.forEach(() => headerCount++);
  console.log("Headers:", headerCount);
}

// basicFetch();

// ============================================================================
// 2. REQUESTINIT TYPE
// ============================================================================

// TypeScript: RequestInit interface for fetch options
async function typedRequestInit(): Promise<void> {
  console.log("\n=== RequestInit Type ===");

  // RequestInit is built-in TypeScript type
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "Post", body: "Content", userId: 1 }),
  };

  console.log("RequestInit method:", options.method);
  console.log("RequestInit headers:", JSON.stringify(options.headers));
}

// typedRequestInit();

// Custom headers with Record type
async function customHeaders(): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
    "X-Custom-Header": "value",
  };

  const response = await fetch("https://example.com/api", {
    method: "POST",
    headers,
  });

  console.log("Custom headers set:", Object.keys(headers).length);
}

// customHeaders();

// ============================================================================
// 3. RESPONSE TYPE
// ============================================================================

// TypeScript: Response interface methods
async function typedResponse(): Promise<void> {
  console.log("\n=== Response Type ===");

  const response: Response = await fetch(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

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

// typedResponse();

// ============================================================================
// 4. GENERIC FETCH WRAPPER
// ============================================================================

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

  const data = (await response.json()) as T;

  return {
    data,
    status: response.status,
    statusText: response.statusText,
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
  console.log("\n=== Generic Fetch Wrapper ===");

  // Explicit type parameter - T is User
  const userResponse = await fetchApi<User>(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  console.log("User:", userResponse.data.name, userResponse.data.email);

  // Explicit type parameter - T is Post[]
  const postsResponse = await fetchApi<Post[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );
  console.log("Posts count:", postsResponse.data.length);
}

// useGenericFetch();

// ============================================================================
// 5. TYPED REQUEST HELPERS
// ============================================================================

// TypeScript: Typed helper functions for common requests
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

class FetchClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: FetchClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.defaultHeaders ?? {};
    this.timeout = config.timeout ?? 30000;
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
      },
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  // Convenience methods with proper typing
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "GET");
  }

  post<T, B = unknown>(endpoint: string, body: B): Promise<T> {
    return this.request<T>(endpoint, "POST", body);
  }

  put<T, B = unknown>(endpoint: string, body: B): Promise<T> {
    return this.request<T>(endpoint, "PUT", body);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE");
  }
}

async function useFetchClient(): Promise<void> {
  console.log("\n=== Typed Request Helpers ===");

  const client = new FetchClient({
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeout: 5000,
  });

  // get<User>() - T is inferred as User
  const user = await client.get<User>("/users/1");
  console.log("Fetched user:", user.name);

  // post<Post, Omit<Post, 'id'>>() - explicit request/response types
  const newPost = await client.post<Post, Omit<Post, "id">>("/posts", {
    title: "New Post",
    body: "Post content",
    userId: 1,
  });
  console.log("Created post:", newPost.id);
}

// useFetchClient();

// ============================================================================
// 6. ERROR HANDLING TYPES
// ============================================================================

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
  | { success: true; data: T; response: Response }
  | { success: false; error: FetchError };

async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<FetchResult<T>> {
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
      error: new FetchError(
        error instanceof Error ? error.message : "Unknown error",
        0,
        "",
        url
      ),
    };
  }
}

// Type guard for FetchResult
function isSuccess<T>(
  result: FetchResult<T>
): result is { success: true; data: T; response: Response } {
  return result.success;
}

async function useSafeFetch(): Promise<void> {
  console.log("\n=== Error Handling Types ===");

  // Success case
  const successResult = await safeFetch<User>(
    "https://jsonplaceholder.typicode.com/users/1"
  );

  if (isSuccess(successResult)) {
    // TypeScript knows data and response exist after type guard
    console.log("Success:", successResult.data.name);
    console.log("Response status:", successResult.response.status);
  } else {
    // TypeScript knows error exists after type guard
    console.log("Error:", successResult.error.message);
  }

  // Error case (invalid URL)
  const errorResult = await safeFetch<User>(
    "https://invalid-url-example.com/api"
  );

  if (!isSuccess(errorResult)) {
    // TypeScript knows error exists after type guard
    console.log("Fetch failed:", errorResult.error.message);
  }
}

// useSafeFetch();

// ============================================================================
// 7. ABORTSIGNAL TYPING
// ============================================================================

// TypeScript: AbortController and AbortSignal types
async function fetchWithAbort(
  url: string,
  signal: AbortSignal
): Promise<Response> {
  const response = await fetch(url, { signal });
  return response;
}

// Factory for cancellable fetch
function createCancellableFetcher(baseUrl: string) {
  const controller = new AbortController();

  const fetcher = {
    fetch: <T>(endpoint: string): Promise<T> =>
      fetch(`${baseUrl}${endpoint}`, { signal: controller.signal }).then(
        r => r.json() as T
      ),

    cancel: (): void => controller.abort(),

    get signal(): AbortSignal {
      return controller.signal;
    },
  };

  return fetcher;
}

async function useCancellableFetch(): Promise<void> {
  console.log("\n=== AbortSignal Typing ===");

  const fetcher = createCancellableFetcher(
    "https://jsonplaceholder.typicode.com"
  );

  try {
    // Start fetch
    const dataPromise = fetcher.fetch<User>("/users/1");

    // Cancel after 10ms
    setTimeout(() => fetcher.cancel(), 10);

    const data = await dataPromise;
    console.log("User:", data.name);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch was cancelled");
    } else {
      console.log(
        "Fetch error:",
        error instanceof Error ? error.message : error
      );
    }
  }
}

// useCancellableFetch();

// ============================================================================
// 8. INTERCEPTOR TYPES
// ============================================================================

// TypeScript: Typed request/response interceptors
interface Interceptors<T> {
  request: Array<(config: RequestInit) => RequestInit | Promise<RequestInit>>;
  response: Array<(response: Response) => T | Promise<T>>;
  error: Array<(error: Error) => never | Promise<never>>;
}

class InterceptorFetch {
  private interceptors: Interceptors<unknown> = {
    request: [],
    response: [],
    error: [],
  };

  // Add request interceptor
  useRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>
  ): void {
    this.interceptors.request.push(interceptor);
  }

  // Add response interceptor
  useResponseInterceptor(
    interceptor: (response: Response) => unknown | Promise<unknown>
  ): void {
    this.interceptors.response.push(interceptor);
  }

  // Add error interceptor
  useErrorInterceptor(
    interceptor: (error: Error) => never | Promise<never>
  ): void {
    this.interceptors.error.push(interceptor);
  }

  // Execute interceptors
  private async applyRequestInterceptors(
    config: RequestInit
  ): Promise<RequestInit> {
    let currentConfig = config;

    for (const interceptor of this.interceptors.request) {
      currentConfig = await interceptor(currentConfig);
    }

    return currentConfig;
  }

  private async applyResponseInterceptors(
    response: Response
  ): Promise<unknown> {
    let currentResponse: unknown = response;

    for (const interceptor of this.interceptors.response) {
      currentResponse = await interceptor(currentResponse as Response);
    }

    return currentResponse;
  }

  // Fetch with interceptors
  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const config = await this.applyRequestInterceptors(options ?? {});
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return this.applyResponseInterceptors(response) as Promise<T>;
  }
}

async function useInterceptors(): Promise<void> {
  console.log("\n=== Interceptor Types ===");

  const client = new InterceptorFetch();

  // Request interceptor - add auth header
  client.useRequestInterceptor(config => {
    console.log("Request interceptor: Adding auth header");
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: "Bearer token",
      },
    };
  });

  // Response interceptor - log status
  client.useResponseInterceptor(response => {
    console.log("Response interceptor: Status", response.status);
    return response;
  });

  // Use the client
  const data = await client.fetch<User>(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  console.log("User with interceptors:", data.name);
}

// useInterceptors();

// ============================================================================
// 9. QUERY PARAMETER TYPES
// ============================================================================

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

function buildUrl(
  baseUrl: string,
  params?: Record<string, QueryValue>
): string {
  if (!params) return baseUrl;

  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// Usage with typed parameters
interface UserQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

async function fetchUsers(params: UserQueryParams): Promise<User[]> {
  const url = buildUrl("https://jsonplaceholder.typicode.com/users", {
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    order: params.order,
    search: params.search,
  });

  const response = await fetch(url);
  return (await response.json()) as User[];
}

async function useQueryParams(): Promise<void> {
  console.log("\n=== Query Parameter Types ===");

  const users = await fetchUsers({
    page: 1,
    limit: 10,
    sortBy: "name",
    order: "asc",
  });

  console.log("Fetched users:", users.length);
}

// useQueryParams();

// ============================================================================
// 10. RESPONSE TRANSFORMER TYPES
// ============================================================================

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
const userTransformer: Transformer<User, string> = user => {
  return `${user.name} <${user.email}>`;
};

async function useTransformers(): Promise<void> {
  console.log("\n=== Response Transformer Types ===");

  const userString = await fetchWithTransform<User, string>(
    "https://jsonplaceholder.typicode.com/users/1",
    userTransformer
  );

  console.log("Transformed user:", userString);
}

// useTransformers();

// ============================================================================
// 11. PARTIAL AND OPTIONAL FETCH OPTIONS
// ============================================================================

// TypeScript: Partial types for optional fetch configuration
type PartialRequestInit = Partial<RequestInit>;

function createDefaultRequest(overrides: PartialRequestInit = {}): RequestInit {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...overrides,
  };
}

async function usePartialTypes(): Promise<void> {
  console.log("\n=== Partial and Optional Types ===");

  // Only override method
  const postRequest = createDefaultRequest({ method: "POST" });
  console.log("POST request:", postRequest.method);

  // Only add body
  const bodyRequest = createDefaultRequest({
    method: "POST",
    body: JSON.stringify({ key: "value" }),
  });
  console.log("Body request:", bodyRequest.body);
}

// usePartialTypes();

// ============================================================================
// 12. RECORD AND MAPPED TYPES FOR HEADERS
// ============================================================================

// TypeScript: Mapped types for header manipulation
type HeaderTransform = (value: string) => string;

function transformHeaders(
  headers: Record<string, string>,
  transforms: Record<string, HeaderTransform>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const transform = transforms[key] ?? ((v: string) => v);
    result[key] = transform(value);
  }

  return result;
}

async function useMappedHeaderTypes(): Promise<void> {
  console.log("\n=== Record and Mapped Types ===");

  const headers: Record<string, string> = {
    "content-type": "application/json",
    authorization: "Bearer secret123",
    "x-custom": "value",
  };

  // Transform specific headers
  const transformed = transformHeaders(headers, {
    authorization: value => value.replace(/Bearer .+/, "Bearer [REDACTED]"),
    "x-custom": value => value.toUpperCase(),
  });

  console.log("Transformed headers:", transformed);
}

// useMappedHeaderTypes();

// ============================================================================
// 13. UNION TYPES FOR API RESPONSES
// ============================================================================

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

async function handleVersionedResponse(response: ApiResponse): Promise<void> {
  console.log("\n=== Union Types for API Responses ===");

  if (isV3Response(response)) {
    // TypeScript knows response has meta and links
    console.log("V3 Response with links:", response.links);
  } else if (isV2Response(response)) {
    // TypeScript knows response has meta
    console.log("V2 Response with meta:", response.meta);
  } else {
    // V1 response - basic format
    console.log("V1 Response:", response.version);
  }
}

// ============================================================================
// 14. UTILITY TYPES FOR FETCH
// ============================================================================

// TypeScript: Utility types commonly used with fetch

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
type RequiredUser = Required<Partial<User>>;
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
  console.log("\n=== Utility Types for Fetch ===");

  // CreateUserInput - User without id
  const createUser: CreateUserInput = {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
  };
  console.log("Create user input:", createUser);

  // UserNameOnly - only name and email
  const userName: UserNameOnly = { name: "John", email: "john@example.com" };
  console.log("User name only:", userName);

  // StringKeys utility
  const stringKeys: UserStringKeys = "name";
  console.log("String key:", stringKeys);
}

// useUtilityTypes();

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Fetch API ===\n");
console.log(`
1. USE GENERIC FETCH WRAPPERS
   - fetchApi<T>(url) returns Promise<ApiResponse<T>>
   - Type-safe response data

2. TYPE REQUESTINIT AND RESPONSE
   - const options: RequestInit = { ... }
   - const response: Response = await fetch(url)

3. USE UNION TYPES FOR API RESPONSES
   - Handle different API versions
   - Type guards for narrowing

4. CREATE TYPE-SAFE ERROR CLASSES
   - Extend Error with custom properties
   - FetchError with status, url, etc.

5. USE UTILITY TYPES
   - Omit<T>, Pick<T>, Partial<T>
   - For request/response types

6. TYPE ABORTSIGNAL PROPERLY
   - signal: AbortSignal
   - Create cancellable fetchers

7. USE RECORD<T, U> FOR HEADERS
   - Record<string, string> for header maps
   - Mapped types for transformations

8. IMPLEMENT INTERCEPTORS WITH TYPES
   - Request: (config: RequestInit) => RequestInit
   - Response: (response: Response) => T

⚠️ COMMON PITFALLS:

1. Not checking response.ok before parsing
   - Always check: if (!response.ok) throw ...

2. Using 'any' for response data
   - Use proper interfaces or generics

3. Forgetting response.json() returns Promise<unknown>
   - Cast to your type: await response.json() as T

4. Not typing error in catch blocks
   - catch (error: unknown) and use type guards

5. Mixing up Response and response.json() types
   - Response: the HTTP response
   - response.json(): Promise<unknown> with body data

📘 See 33-fetch-api.js for JavaScript fundamentals!
`);

// ============================================================================
// ABORTCONTROLLER AND ABORTSIGNAL TYPES
// ============================================================================

console.log("\n=== AbortController and AbortSignal Types ===");

// TypeScript: Built-in AbortController and AbortSignal types
// AbortController: class with signal property and abort() method
// AbortSignal: interface with aborted property and abort event

// Basic AbortController with types
async function typedAbortController(): Promise<void> {
  const controller: AbortController = new AbortController();
  const signal: AbortSignal = controller.signal;

  // AbortSignal properties
  const isAborted: boolean = signal.aborted;
  const reason: unknown = signal.reason; // TypeScript 4.7+

  // Event listener with typed event
  signal.addEventListener("abort", (event: Event) => {
    console.log("Aborted:", signal.reason);
  });

  try {
    const response: Response = await fetch("https://api.example.com/data", {
      signal,
    });
    const data: unknown = await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request was aborted");
    }
  }
}

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
      "https://api.example.com/data",
      { method: "GET" },
      3000
    );
    const data: unknown = await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request timed out");
    }
  }
}

// Typed search controller
class TypedSearchController<T> {
  private currentController: AbortController | null = null;

  async search(query: string, endpoint: string): Promise<T[] | null> {
    // Cancel previous search
    if (this.currentController) {
      this.currentController.abort("New search started");
    }

    this.currentController = new AbortController();
    const { signal } = this.currentController;

    try {
      const response = await fetch(`${endpoint}?q=${query}`, { signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const results: T[] = await response.json();
      return results;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return null; // Search was cancelled
      }
      throw error;
    }
  }

  cancel(): void {
    if (this.currentController) {
      this.currentController.abort("User cancelled");
      this.currentController = null;
    }
  }
}

// Usage with typed results
interface SearchResult {
  id: number;
  title: string;
  description: string;
}

async function useTypedSearchController(): Promise<void> {
  const searchController = new TypedSearchController<SearchResult>();

  const results = await searchController.search("typescript", "/api/search");
  if (results) {
    results.forEach(result => {
      console.log(result.title); // Type-safe access
    });
  }
}

// AbortSignal.timeout() - Modern API (TypeScript 4.7+)
async function typedSignalTimeout(): Promise<void> {
  try {
    // Type-safe timeout signal
    const signal: AbortSignal = AbortSignal.timeout(5000);

    const response = await fetch("https://api.example.com/data", { signal });
    const data: unknown = await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      console.log("Request timed out");
    }
  }
}

// Combining signals with types
function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }

    signal.addEventListener(
      "abort",
      () => {
        controller.abort(signal.reason);
      },
      { once: true }
    );
  }

  return controller.signal;
}

// React hook pattern with types
interface UseFetchOptions extends RequestInit {
  skip?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Example hook signature (implementation would use React)
function useFetch<T = unknown>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> {
  // Implementation would use useState, useEffect, etc.
  // This is just the type signature
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => {},
  };
}

console.log("\nAbortController TypeScript Features:");
console.log("  - Built-in types for AbortController and AbortSignal");
console.log("  - Type-safe abort reasons (TypeScript 4.7+)");
console.log("  - Generic search controllers");
console.log("  - Type-safe timeout functions");
console.log("  - AbortSignal.timeout() support");

console.log("\nBest Practices:");
console.log("  ✅ Use generic types for reusable abort logic");
console.log("  ✅ Type abort reasons for better error handling");
console.log("  ✅ Create typed wrapper functions");
console.log("  ✅ Use AbortSignal.timeout() when available");
console.log("  ✅ Combine signals with type safety");

console.log("\n📘 See 33-fetch-api.js for detailed AbortController examples!");
