// Fetch API - Practical Patterns Demo
// 📘 For TypeScript comparison, see: 33-fetch-api-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers practical Fetch patterns:
// 1. API client wrapper with base URL and defaults
// 2. Retry logic with exponential backoff
// 3. AbortController deep dive (cancellation, timeout, search-as-you-type)
// 4. Sequential dependent API calls

// ============================================
// Table of Contents
// ============================================

// 1. API Client Wrapper
// 2. Retry with Exponential Backoff
// 3. AbortController Deep Dive
// 4. Sequential Dependent API Calls

// ============================================

console.log("=== Fetch API Practical Patterns Demo ===\n");

const API_BASE = "https://jsonplaceholder.typicode.com";

// ============================================
// 1. API Client Wrapper
// ============================================
/**
 * API Client - Reusable wrapper with base URL and defaults
 *
 * Benefits:
 * - Consistent error handling
 * - Shared headers
 * - Base URL configuration
 * - Can extend with auth interceptors, logging, etc.
 */

console.log("1. API client wrapper:");

const createApiClient = (baseURL, defaultHeaders = {}) => {
  // - API 客户端封装，基于 async/await (ES2017) 和 fetch
  return {
    async get(endpoint, options = {}) {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...defaultHeaders,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },

    async post(endpoint, data, options = {}) {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...defaultHeaders,
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    }
  };
};

async function useApiClient() {
  const api = createApiClient(API_BASE, {
    "X-Custom-Header": "MyApp/1.0"
  });

  try {
    const posts = await api.get("/posts/1");
    console.log("   Via API client:", posts.title);

    const created = await api.post("/posts", {
      title: "New Post",
      body: "Post content",
      userId: 1
    });
    console.log("   Created via API client, ID:", created.id);
  } catch (error) {
    console.error("   API client error:", error.message);
  }
}

useApiClient();

// ============================================
// 2. Retry with Exponential Backoff
// ============================================
/**
 * Retry Pattern - Retry failed requests with exponential delay
 *
 * Key rules:
 * - Don't retry client errors (4xx) - they won't succeed
 * - Retry server errors (5xx) and network errors - may be temporary
 * - Use exponential backoff: 1s, 2s, 4s, 8s...
 */

console.log("\n2. Retry with exponential backoff:");

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Server errors (5xx) might be temporary, retry
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error;

      // Network errors might be temporary, retry
      if (error instanceof TypeError) {
        // Network error, will retry
      } else {
        throw error; // Client error, don't retry
      }
    }

    if (attempt < maxRetries) {
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`   Retry attempt ${attempt}/${maxRetries}, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

async function demonstrateRetry() {
  try {
    const data = await fetchWithRetry(`${API_BASE}/posts/1`, {}, 3);
    console.log("   Fetched with retry logic:", data.id);
  } catch (error) {
    console.error("   All retries exhausted:", error.message);
  }
}

demonstrateRetry();

// ============================================
// 3. AbortController Deep Dive
// ============================================
/**
 * AbortController & AbortSignal - Cancel async operations
 *
 * Characteristics:
 * - Cancel fetch requests
 * - Cancel multiple operations with one signal
 * - Timeout implementation
 * - Event-based cancellation
 * - Works with any API that accepts AbortSignal
 *
 * Use Cases:
 * - Search-as-you-type (cancel previous requests)
 * - Component unmount cleanup
 * - Timeout implementation
 * - User-initiated cancellation
 */

console.log("\n3. AbortController Deep Dive:");

// 3.1 Basic AbortController
async function basicAbortExample() {
  console.log("\n3.1 Basic AbortController:");

  const controller = new AbortController();
  const signal = controller.signal;

  signal.addEventListener('abort', () => {
    console.log("   Signal aborted, reason:", signal.reason);
  });

  try {
    const fetchPromise = fetch(`${API_BASE}/posts/1`, { signal });

    // Abort after 50ms (very fast to demonstrate)
    setTimeout(() => {
      controller.abort('Timeout after 50ms');
    }, 50);

    const response = await fetchPromise;
    const data = await response.json();
    console.log("   Completed before abort:", data.id);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✓ Request was aborted");
    } else {
      console.error("   Fetch error:", error.message);
    }
  }
}

basicAbortExample();

// 3.2 Timeout with AbortController
function fetchWithAbortTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const { signal: originalSignal, ...restOptions } = options;

  // Combine with existing signal if provided
  if (originalSignal) {
    originalSignal.addEventListener('abort', () => {
      controller.abort(originalSignal.reason);
    });
  }

  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Request timeout after ${timeoutMs}ms`));
  }, timeoutMs);

  return fetch(url, {
    ...restOptions,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

async function demonstrateAbortTimeout() {
  console.log("\n3.2 Timeout with AbortController:");

  try {
    const response = await fetchWithAbortTimeout(`${API_BASE}/posts/1`, {}, 10000);
    const data = await response.json();
    console.log("   ✓ Fetched within timeout:", data.id);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✗ Request timed out");
    } else {
      console.error("   Error:", error.message);
    }
  }
}

demonstrateAbortTimeout();

// 3.3 Cancel multiple operations with one signal
async function cancelMultipleOperations() {
  console.log("\n3.3 Cancel multiple operations:");

  const controller = new AbortController();
  const { signal } = controller;

  try {
    const requests = [
      fetch(`${API_BASE}/posts/1`, { signal }),
      fetch(`${API_BASE}/posts/2`, { signal }),
      fetch(`${API_BASE}/posts/3`, { signal })
    ];

    // Cancel all after 50ms
    setTimeout(() => {
      console.log("   Aborting all requests...");
      controller.abort('User cancelled');
    }, 50);

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map(r => r.json()));
    console.log("   ✓ All completed:", data.map(d => d.id));
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✓ All requests cancelled");
    }
  }
}

cancelMultipleOperations();

// 3.4 Search-as-you-type pattern
class SearchController {
  constructor() {
    this.currentController = null;
  }

  async search(query) {
    // Cancel previous search
    if (this.currentController) {
      this.currentController.abort('New search started');
    }

    this.currentController = new AbortController();
    const { signal } = this.currentController;

    try {
      const response = await fetch(`${API_BASE}/posts?q=${query}`, { signal });
      const results = await response.json();
      return results;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`   Search for "${query}" was cancelled`);
        return null;
      }
      throw error;
    }
  }
}

async function demonstrateSearchAsYouType() {
  console.log("\n3.4 Search-as-you-type pattern:");

  const searchController = new SearchController();

  // Simulate rapid typing
  searchController.search('java').catch(() => {});
  searchController.search('javasc').catch(() => {});
  const results = await searchController.search('javascript');

  if (results) {
    console.log("   ✓ Search completed for: javascript");
  }
}

demonstrateSearchAsYouType();

// 3.5 Combining multiple AbortSignals
function combineSignals(...signals) {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }

    signal.addEventListener('abort', () => {
      controller.abort(signal.reason);
    }, { once: true });
  }

  return controller.signal;
}

// 3.6 AbortSignal.timeout() and AbortSignal.any() (modern APIs)
console.log("\n3.5 Modern AbortSignal APIs:");
if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
  console.log("   ✓ AbortSignal.timeout() available (one-line timeout)");
  console.log("   Example: fetch(url, { signal: AbortSignal.timeout(5000) })");
}
if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
  console.log("   ✓ AbortSignal.any() available (combine signals)");
  console.log("   Example: AbortSignal.any([userSignal, AbortSignal.timeout(5000)])");
}

// 3.7 AbortController Best Practices
console.log("\n3.6 AbortController Best Practices:");
console.log("  ✅ Always handle AbortError separately from other errors");
console.log("  ✅ Cancel previous requests in search/autocomplete");
console.log("  ✅ Clean up on component unmount (React/Vue)");
console.log("  ✅ Implement timeouts for all network requests");
console.log("  ✅ Use AbortSignal.timeout() when available");
console.log("  ⚠️ Don't reuse AbortController (create new for each operation)");

// ============================================
// 4. Sequential Dependent API Calls
// ============================================
/**
 * Sequential Dependent Calls - Requests that depend on previous results
 *
 * Use case: Get user → get user's posts → get post's comments
 * Each step depends on data from the previous step
 */

console.log("\n4. Sequential dependent API calls:");

async function sequentialDependentCalls() {
  try {
    // First, get a user
    const user = await fetch(`${API_BASE}/users/1`).then(r => r.json());
    console.log("   Got user:", user.name);

    // Then, get posts by that user
    const userPosts = await fetch(`${API_BASE}/posts?userId=${user.id}`).then(r => r.json());
    console.log("   User has", userPosts.length, "posts");

    // Get comments on first post
    if (userPosts.length > 0) {
      const comments = await fetch(`${API_BASE}/posts/${userPosts[0].id}/comments`).then(r => r.json());
      console.log("   First post has", comments.length, "comments");
    }
  } catch (error) {
    console.error("   Sequential calls error:", error.message);
  }
}

sequentialDependentCalls();

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log("\nPitfall 1 - Not cancelling previous requests:");
console.log("❌ Search-as-you-type without cancellation creates race conditions");
console.log("✅ Use AbortController to cancel stale requests");

console.log("\nPitfall 2 - Retrying all errors:");
console.log("❌ Retrying 4xx errors is pointless");
console.log("✅ Only retry network errors and 5xx server errors");

console.log("\nPitfall 3 - Sequential awaits for independent requests:");
console.log("❌ Awaiting independent requests sequentially is slow");
console.log("✅ Use Promise.all for independent parallel requests");

console.log("\nPitfall 4 - Reusing AbortController:");
console.log("❌ Aborting a controller permanently cancels it");
console.log("✅ Create new AbortController for each operation");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Create API client wrappers for consistent error handling");
console.log("✅ Implement retry with exponential backoff for resilience");
console.log("✅ Use AbortController for cancellable requests");
console.log("✅ Use Promise.all for parallel independent requests");
console.log("✅ Always handle AbortError separately");
console.log("✅ Implement timeouts for all fetch calls");
console.log("⚠️ Don't retry 4xx client errors - they won't succeed");
console.log("⚠️ Don't reuse AbortController after abort");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 33.1-fetch-basics.js - Fetch basics and HTTP methods");
console.log("📘 33.2-fetch-error-handling.js - Error handling and async/await");
console.log("📘 33.4-fetch-streams-advanced.js - Stream API and caching");
console.log("📘 34-async-error-handling.js - Circuit breaker and advanced error patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 33-fetch-api-ts-comparison.ts
*/