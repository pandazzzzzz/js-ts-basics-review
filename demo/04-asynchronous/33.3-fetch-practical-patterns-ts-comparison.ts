// TypeScript vs JavaScript: Fetch API - Practical Patterns Comparison
// 📘 For JavaScript examples, see: 33.3-fetch-practical-patterns.js
// This file demonstrates TypeScript-specific typing for Fetch API practical patterns

export {};

// ============================================================================
// 1. API CLIENT TYPES
// ============================================================================

console.log("=== API Client Types ===");

// TypeScript: Typed helper functions for common requests
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
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

  patch<T, B = unknown>(endpoint: string, body: B): Promise<T> {
    return this.request<T>(endpoint, "PATCH", body);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE");
  }
}

async function useFetchClient(): Promise<void> {
  const client = new FetchClient({
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
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

useFetchClient();

// ============================================================================
// 2. RETRY WITH EXPONENTIAL BACKOFF TYPES
// ============================================================================

console.log("\n=== Retry with Exponential Backoff Types ===");

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  shouldRetry?: (error: unknown) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
};

async function fetchWithRetry<T = unknown>(
  url: string,
  options: RequestInit = {},
  config: Partial<RetryConfig> = defaultRetryConfig
): Promise<T> {
  const { maxRetries, baseDelayMs, shouldRetry } = {
    ...defaultRetryConfig,
    ...config,
  };
  let lastError: unknown;

  const shouldRetryDefault = (error: unknown): boolean => {
    if (error instanceof Error && error.message.startsWith("HTTP 4"))
      return false;
    return true;
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return (await response.json()) as T;
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);

      if (response.status >= 400 && response.status < 500) {
        throw lastError;
      }
    } catch (error) {
      lastError = error;

      const willRetry =
        attempt < maxRetries &&
        (shouldRetry?.(error) ?? shouldRetryDefault(error));

      if (willRetry) {
        const delay = Math.pow(2, attempt - 1) * baseDelayMs;
        console.log(
          `Retry attempt ${attempt}/${maxRetries}, waiting ${delay}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

async function demonstrateRetry(): Promise<void> {
  try {
    const data = await fetchWithRetry<Post>(
      "https://jsonplaceholder.typicode.com/posts/1",
      {},
      { maxRetries: 3, baseDelayMs: 500 }
    );
    console.log("Fetched with retry logic:", data.title);
  } catch (error) {
    console.error("All retries exhausted:", error);
  }
}

demonstrateRetry();

// ============================================================================
// 3. ABORTSIGNAL TYPING
// ============================================================================

console.log("\n=== AbortSignal Typing ===");

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
  const fetcher = createCancellableFetcher(
    "https://jsonplaceholder.typicode.com"
  );

  try {
    // Start fetch
    const dataPromise = fetcher.fetch<User>("/users/1");

    // Don't cancel - let it complete for demo
    const data = await dataPromise;
    console.log("User:", data.name);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch was cancelled");
    } else {
      console.log("Fetch error:", error);
    }
  }
}

useCancellableFetch();

// ============================================================================
// 4. TYPED SEARCH CONTROLLER
// ============================================================================

console.log("\n=== Typed Search Controller ===");

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
        console.log(`Search for "${query}" was cancelled`);
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
}

async function useTypedSearchController(): Promise<void> {
  const searchController = new TypedSearchController<SearchResult>();

  // Simulate search-as-you-type (cancels previous)
  searchController
    .search("java", "https://jsonplaceholder.typicode.com/posts")
    .catch(() => {});
  searchController
    .search("javasc", "https://jsonplaceholder.typicode.com/posts")
    .catch(() => {});
  const results = await searchController.search(
    "typescript",
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (results) {
    console.log("Search completed, results count:", results.length);
    results.slice(0, 3).forEach(result => console.log("-", result.title));
  }
}

useTypedSearchController();

// ============================================================================
// 5. MODERN ABORTSIGNAL APIS
// ============================================================================

console.log("\n=== Modern AbortSignal APIs ===");

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

// AbortSignal.timeout() - Modern API (TypeScript 4.7+)
async function typedSignalTimeout(): Promise<void> {
  if ("timeout" in AbortSignal) {
    console.log("✅ AbortSignal.timeout() available");
    try {
      // Type-safe timeout signal
      const signal = (AbortSignal as any).timeout(10000);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1",
        { signal }
      );
      const data = await response.json();
      console.log("Fetched with signal timeout completed successfully");
    } catch (error) {
      console.log("Timeout or error:", error);
    }
  } else {
    console.log("⚠️ AbortSignal.timeout() not available in this environment");
  }
}

typedSignalTimeout();

// ============================================================================
// 6. INTERCEPTOR TYPES
// ============================================================================

console.log("\n=== Interceptor Types ===");

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
  const client = new InterceptorFetch();

  // Request interceptor - add auth header
  client.useRequestInterceptor(config => {
    console.log("Request interceptor called");
    return {
      ...config,
      headers: {
        ...config.headers,
        "X-App-Version": "1.0.0",
      },
    };
  });

  // Response interceptor - log status
  client.useResponseInterceptor(response => {
    console.log("Response interceptor called, status:", response.status);
    return response;
  });

  // Use the client
  const data = await client.fetch<User>(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  console.log("User with interceptors:", data.name);
}

useInterceptors();

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Practical Patterns ===\n");
console.log(`
1. TYPED API CLIENT CLASSES
   - Generic request<T>(endpoint, method, body)
   - Convenience methods: get<T>, post<T, B>, etc.
   - Strong typing for request/response

2. TYPE-SAFE RETRY CONFIGURATION
   - RetryConfig interface with proper types
   - shouldRetry() callback with error typing
   - Exponential backoff with types

3. GENERIC CANCELLABLE FETCHERS
   - createCancellableFetcher<T>()
   - Typed fetch results

4. TYPED SEARCH CONTROLLERS
   - TypedSearchController<T>
   - Type-safe search results
   - Cancel previous requests

5. MODERN ABORTSIGNAL APIS WITH TYPES
   - AbortSignal.timeout() support
   - combineSignals() with proper typing
   - Type abort reasons (TypeScript 4.7+)

6. TYPED INTERCEPTORS
   - Interceptors<T> interface
   - Request/response/error hooks
   - Strong typing for all callbacks

⚠️ COMMON PITFALLS:

1. Not using proper generics for reusable components
   - Always use <T> for type safety

2. Forgetting that AbortController.abort() takes an optional reason
   - Type the reason with unknown

3. Not properly typing interceptor callbacks
   - Use union types for return values (T | Promise<T>)

📘 See 33.3-fetch-practical-patterns.js for JavaScript fundamentals!
`);

// ============================================================================
// CROSS REFERENCES
// ============================================================================

console.log("\n=== Cross References ===");
console.log(
  "📘 33.1-fetch-basics-ts-comparison.ts - Fetch basics with TypeScript"
);
console.log(
  "📘 33.2-fetch-error-handling-ts-comparison.ts - Error handling with TypeScript"
);
console.log(
  "📘 33.4-fetch-streams-advanced-ts-comparison.ts - Streams with TypeScript"
);
