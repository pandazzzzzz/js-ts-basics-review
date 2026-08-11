// Fetch API - Error Handling & Async/Await Demo
// 📘 For TypeScript comparison, see: 33-fetch-api-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers error handling and async/await patterns:
// 1. Fetch error handling basics (network vs HTTP errors)
// 2. Timeout patterns with Promise.race and AbortController
// 3. Clean async/await syntax for fetch
// 4. Sequential vs parallel fetches
// 5. Cache API integration for offline support

// ============================================
// Table of Contents
// ============================================

// 1. Error Handling Patterns
// 2. Timeout with Promise.race
// 3. Async/Await with Fetch
// 4. Sequential vs Parallel Fetches
// 5. Cache API Integration

// ============================================

console.log("=== Fetch API Error Handling & Async/Await Demo ===\n");

const API_BASE = "https://jsonplaceholder.typicode.com";

// ============================================
// 1. Error Handling Patterns
// ============================================
/**
 * Error Handling Patterns
 *
 * Important: Fetch ONLY rejects on:
 * - Network failure (no internet, DNS failure)
 * - CORS blocking
 * - Request blocked by browser
 *
 * Fetch does NOT reject on:
 * - HTTP 404 Not Found
 * - HTTP 500 Internal Server Error
 * - Any HTTP error status
 *
 * Always check response.ok or response.status!
 */

console.log("=== Error Handling Patterns ===\n");

// Pattern 1: Check response.ok manually
async function handleErrorPattern1() {
  console.log("1. Manual response.ok check:");

  try {
    const response = await fetch(`${API_BASE}/posts/99999`); // Non-existent

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("   Data:", data);
  } catch (error) {
    console.error("   Caught error:", error.message);
  }
}

handleErrorPattern1();

// Pattern 2: Handle network errors separately
async function handleErrorPattern2() {
  console.log("\n2. Separate network vs HTTP errors:");

  try {
    const response = await fetch(`${API_BASE}/invalid-endpoint`);

    if (response.status === 404) {
      console.log("   Resource not found (404)");
      return null;
    }

    if (response.status >= 500) {
      console.log("   Server error (5xx)");
      throw new Error("Server error");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("   Network error:", error.message);
    } else {
      console.error("   HTTP error:", error.message);
    }
  }
}

handleErrorPattern2();

// Pattern 3: Error propagation in chains
async function errorPropagation() {
  console.log("\n3. Error propagation in chains:");

  fetch(`${API_BASE}/posts/1`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("   Chain step 1 - got data");
      return data.title;
    })
    .then(title => {
      console.log("   Chain step 2 - got title:", title);
      throw new Error("Intentional chain error");
    })
    .catch(error => {
      console.error("   Caught in .catch():", error.message);
      return "Fallback title";
    })
    .then(result => {
      console.log("   Chain continues after catch:", result);
    })
    .finally(() => {
      console.log("   Finally: cleanup happens here");
    });
}

errorPropagation();

// ============================================
// 2. Timeout with Promise.race
// ============================================
/**
 * Timeout Pattern - Cancel requests that take too long
 *
 * Using Promise.race between fetch and timeout promise
 */

console.log("\n=== Timeout Patterns ===\n");

async function fetchWithTimeout(url, timeoutMs = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([fetch(url), timeoutPromise]);
}

async function handleTimeout() {
  console.log("4. Timeout pattern with Promise.race:");

  try {
    const response = await fetchWithTimeout(`${API_BASE}/posts/1`, 10000);
    const data = await response.json();
    console.log("   Fetched within timeout:", data.id);
  } catch (error) {
    console.error("   Timeout or fetch error:", error.message);
  }
}

handleTimeout();

// ============================================
// 3. Async/Await with Fetch
// ============================================
/**
 * Async/Await with Fetch - Clean, readable syntax
 *
 * Benefits over Promise chains:
 * - Looks synchronous, easier to read
 * - Try/catch for error handling
 * - Easier debugging with breakpoints
 * - Better for complex conditional logic
 *
 * Note: See file 31-async-await.js for detailed async/await patterns
 */

console.log("\n=== Async/Await with Fetch ===\n");

async function fetchPostClean(postId) {
  const response = await fetch(`${API_BASE}/posts/${postId}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

async function demonstrateAsyncAwait() {
  console.log("5. Clean async/await syntax:");

  try {
    const post = await fetchPostClean(1);
    console.log("   Fetched post:", post.title);
  } catch (error) {
    console.error("   Error:", error.message);
  }
}

demonstrateAsyncAwait();

// ============================================
// 4. Sequential vs Parallel Fetches
// ============================================
/**
 * Sequential vs Parallel Requests
 *
 * Sequential: await each fetch one at a time (slower)
 * Parallel: use Promise.all (faster, all requests start together)
 */

console.log("\n=== Sequential vs Parallel Fetches ===\n");

async function sequentialVsParallel() {
  console.log("6. Sequential vs Parallel fetches:");

  // Sequential (slower - waits for each request)
  console.log("   Sequential approach:");
  const startSeq = Date.now();

  try {
    const post1 = await fetch(`${API_BASE}/posts/1`).then(r => r.json());
    const post2 = await fetch(`${API_BASE}/posts/2`).then(r => r.json());
    const post3 = await fetch(`${API_BASE}/posts/3`).then(r => r.json());

    const endSeq = Date.now();
    console.log("   Sequential time:", endSeq - startSeq, "ms");
    console.log("   Got posts:", post1.id, post2.id, post3.id);
  } catch (error) {
    console.error("   Sequential error:", error.message);
  }

  // Parallel (faster - all requests start together)
  console.log("\n   Parallel approach (Promise.all):");
  const startPar = Date.now();

  try {
    const [post1, post2, post3] = await Promise.all([
      fetch(`${API_BASE}/posts/1`).then(r => r.json()),
      fetch(`${API_BASE}/posts/2`).then(r => r.json()),
      fetch(`${API_BASE}/posts/3`).then(r => r.json())
    ]);

    const endPar = Date.now();
    console.log("   Parallel time:", endPar - startPar, "ms");
    console.log("   Got posts:", post1.id, post2.id, post3.id);
  } catch (error) {
    console.error("   Parallel error:", error.message);
  }
}

sequentialVsParallel();

// ============================================
// 5. Cache API Integration
// ============================================
/**
 * Cache API — Store Request/Response pairs for offline and performance
 *
 * Part of the Service Worker API but also available in window context.
 * Stores Request → Response mappings for programmatic caching.
 *
 * Key methods:
 * - caches.open(name): Open (or create) a named cache
 * - cache.put(request, response): Store a response
 * - cache.match(request): Find a matching cached response
 * - cache.add(url): Fetch + store (shortcut)
 * - cache.addAll(urls): Fetch + store multiple
 * - cache.delete(request): Remove from cache
 * - cache.keys(): List all cached requests
 * - caches.delete(name): Delete entire cache
 * - caches.keys(): List all cache names
 */

console.log("\n=== Cache API Integration ===\n");

console.log("Cache API example code (browser-only):\n");
console.log(`
// Open a cache (creates if doesn't exist)
const myCache = await caches.open('api-cache-v1');

// Fetch and cache pattern — network-first with cache fallback
async function fetchWithCache(url) {
  try {
    // Try network first
    const response = await fetch(url);
    // Cache the fresh response (clone because body can only be read once)
    const cache = await caches.open('dynamic-cache');
    cache.put(url, response.clone());
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(url);
    if (cachedResponse) {
      console.log('Serving from cache:', url);
      return cachedResponse;
    }
    throw new Error('Network failed and no cache available');
  }
}

// Cache-first pattern — check cache first, fall back to network
async function cacheFirst(url) {
  const cached = await caches.match(url);
  if (cached) return cached;

  const response = await fetch(url);
  const cache = await caches.open('static-cache');
  cache.put(url, response.clone());
  return response;
}

// Pre-cache resources (typically in Service Worker install event)
// const cache = await caches.open('app-shell-v1');
// await cache.addAll([
//   '/',
//   '/styles/main.css',
//   '/scripts/app.js',
//   '/images/logo.png'
// ]);

// Clean up old caches (version management)
const cacheNames = await caches.keys();
for (const name of cacheNames) {
  if (name !== 'api-cache-v2') {
    await caches.delete(name); // Remove outdated caches
    console.log('Deleted old cache:', name);
  }
}

// Check cache size
const cache = await caches.open('api-cache-v1');
const keys = await cache.keys();
console.log('Cached entries:', keys.length);

// Cache API vs other storage:
// - localStorage: synchronous, string-only, 5-10MB, simple key-value
// - IndexedDB: async, structured data, large capacity, complex API
// - Cache API: async, Request/Response pairs, designed for HTTP caching
// - Best for: API responses, static assets, offline support
`);

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log("\nPitfall 1 - Assuming fetch rejects on 404:");
console.log("❌ .catch() only catches network errors, NOT HTTP errors");
console.log("✅ Always check response.ok or response.status");

console.log("\nPitfall 2 - Forgetting try/catch with async/await:");
console.log("❌ Unhandled promise rejection crashes in Node.js strict mode");
console.log("✅ Wrap await in try/catch blocks");

console.log("\nPitfall 3 - Sequential awaits when parallel is possible:");
console.log("❌ Multiple awaits in sequence = slow");
console.log("✅ Use Promise.all for independent requests");

console.log("\nPitfall 4 - Consuming body twice:");
console.log("❌ Calling response.json() twice throws TypeError");
console.log("✅ Store parsed result or use response.clone()");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Always check response.ok or response.status");
console.log("✅ Use async/await for cleaner code");
console.log("✅ Wrap fetch in try/catch for error handling");
console.log("✅ Use Promise.all for parallel requests");
console.log("✅ Implement timeout for all fetch calls");
console.log("✅ Handle network errors separately from HTTP errors");
console.log("✅ Use Cache API for offline support and performance");
console.log("⚠️ Fetch only rejects on network errors, not HTTP errors");
console.log("⚠️ Response body can only be read once (use clone() if needed)");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 30-promises.js - Promise fundamentals and Promise.all/race");
console.log("📘 31-async-await.js - Async/await syntax and error handling");
console.log("📘 33.1-fetch-basics.js - Fetch basics and request methods");
console.log("📘 33.3-fetch-practical-patterns.js - Advanced patterns and AbortController");
console.log("📘 33.4-fetch-streams-advanced.js - Stream API and common pitfalls");
console.log("📘 34-async-error-handling.js - Circuit breaker and retry patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 33-fetch-api-ts-comparison.ts
*/