// Storage & Network API Demo
// 📘 For TypeScript comparison, see: 43-storage-network-ts-comparison.ts
// 📘 javascript.info Part 3 > "Storing data", "Network requests"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
// ⚠️ Most content is browser-specific

// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file covers:
// 1. Browser storage options (localStorage, sessionStorage, Cookies, IndexedDB)
// 2. History API for SPA routing
// 3. Advanced Fetch patterns
// 4. Real-time communication (WebSocket, SSE)
// 5. Cross-tab communication (BroadcastChannel)

// ============================================
// Table of Contents
// ============================================
// 1. localStorage & sessionStorage
// 2. Cookies
// 3. IndexedDB
// 4. History API
// 5. Fetch API Advanced Patterns
// 6. WebSocket API
// 7. Server-Sent Events (SSE)
// 8. BroadcastChannel API
// ============================================

console.log("=== Storage & Network API Demo ===\n");

// ============================================
// 1. localStorage & sessionStorage
// ============================================
console.log("1. localStorage & sessionStorage:");
console.log("  localStorage: persistent across sessions, 5-10MB limit, sync API");
console.log("  sessionStorage: per-tab, cleared on tab close, 5-10MB limit");
console.log("  API: setItem(key, value), getItem(key), removeItem(key), clear()");
console.log("  ⚠️  Only stores strings; use JSON.stringify/parse for objects");

// Browser-only code (commented for Node.js compatibility):
// localStorage.setItem('username', 'Alice');
// console.log('Get item:', localStorage.getItem('username')); // "Alice"
// localStorage.removeItem('username');
// localStorage.clear(); // Remove all items
// sessionStorage.setItem('sessionId', '12345');

// ============================================
// 2. Cookies
// ============================================
console.log("\n2. Cookies:");
console.log("  Small text data (4KB limit) sent with every HTTP request to the server");
console.log(
  "  Attributes: HttpOnly (prevent XSS access), Secure (HTTPS only), SameSite (CSRF protection), Max-Age/Expires, Path, Domain"
);
console.log("  Use cases: session management, user preferences, tracking");
console.log("  Limitations: small size, sent with every request, security risks if misconfigured");

// ============================================
// 3. IndexedDB
// ============================================
console.log("\n3. IndexedDB:");
console.log(
  "  Asynchronous client-side database for large structured data (unlimited size, browser-dependent)"
);
console.log("  Use cases: offline apps, large dataset storage, complex queries");
console.log("  Comparison: vs localStorage (sync, small) | vs Cookies (sent to server)");
console.log("  API: indexedDB.open(), object stores, transactions, indexes, cursors");
console.log("  ⚠️  Event-driven and promise-based (modern) API; non-blocking");

// IndexedDB is a browser-only API. Shown as illustrative (runnable in a browser):
/*
// --- Open/create a database ---
// Returns an IDBOpenDBRequest (event-based)
const request = indexedDB.open("my-db", 1);

// Runs when the DB is created or upgraded (set up object stores here)
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // Create an object store "users" with auto-increment keys
  const store = db.createObjectStore("users", { keyPath: "id" });
  // Add an index on the "email" field for fast lookups
  store.createIndex("by_email", "email", { unique: true });
};

// Runs on success; use the db handle for all subsequent operations
request.onsuccess = (event) => {
  const db = event.target.result;
  // ... do reads/writes with transactions
};

// --- Write data (in a transaction) ---
const tx = db.transaction("users", "readwrite");   // readwrite | readonly
const store = tx.objectStore("users");
store.add({ id: 1, name: "Alice", email: "a@x.com" });
store.put({ id: 2, name: "Bob", email: "b@x.com" }); // put = add or update
tx.oncomplete = () => console.log("Transaction complete");

// --- Read data by key ---
const getReq = store.get(1);
getReq.onsuccess = () => console.log("User:", getReq.result);

// --- Query by index ---
const idxReq = store.index("by_email").get("a@x.com");
idxReq.onsuccess = () => console.log("By email:", idxReq.result);

// --- Iterate with a cursor ---
const cursorReq = store.openCursor();
cursorReq.onsuccess = (event) => {
  const cursor = event.target.result;
  if (cursor) {
    console.log(cursor.key, cursor.value.name);
    cursor.continue(); // next record
  }
};

// --- Delete a record ---
store.delete(1);

// --- Modern promise wrapper (browser support: Chrome 91+, FF 92+, Safari 15+) ---
async function idbGet(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// --- Close the DB when done ---
db.close();
*/

// ============================================
// 4. History API
// ============================================
console.log("\n4. History API:");
console.log(
  "  Manipulate browser history without page reload: pushState(), replaceState(), popstate event"
);
console.log("  SPA routing core: update URL and UI dynamically without full page refresh");
console.log("  State management: store arbitrary state objects with history entries");
console.log(
  "  Best practices: always handle direct URL access (server-side fallback), update document.title"
);
console.log("  ⚠️  pushState doesn't trigger popstate; handle initial load separately");

// ============================================
// 5. Fetch API Advanced Patterns
// ============================================
console.log("\n5. Fetch API Advanced Patterns:");

/**
 * Fetch with timeout implementation using AbortController
 * @param {string} url - Request URL
 * @param {RequestInit} [options={}] - Fetch options
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Example usage
async function demonstrateFetchTimeout() {
  try {
    const response = await fetchWithTimeout(
      "https://jsonplaceholder.typicode.com/posts/1",
      {},
      3000
    );
    const data = await response.json();
    console.log("  ✅ Fetch with timeout succeeded:", data.title.substring(0, 30) + "...");
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("  ⏱️  Request timed out");
    } else {
      console.error("  ❌ Fetch error:", error.message);
    }
  }
}

demonstrateFetchTimeout();

console.log("  Patterns: timeout, request cancellation (AbortController), retries, API wrappers");
console.log("  📘 See 33-3-fetch-practical-patterns.js for complete implementation examples");

// ============================================
// 6. WebSocket API
// ============================================
console.log("\n6. WebSocket API:");
console.log("  Full-duplex bidirectional communication over a single persistent TCP connection");
console.log("  Usage: const ws = new WebSocket('wss://example.com/ws');");
console.log("  Events: open, message, error, close; Methods: send(data), close()");
console.log("  Use cases: real-time chat, live updates, collaborative editing");
console.log("  ⚠️  Use wss:// (secure) in production; implement heartbeat/reconnection logic");

// ============================================
// 7. Server-Sent Events (SSE)
// ============================================
console.log("\n7. Server-Sent Events (SSE):");
console.log("  One-way server-to-client communication over HTTP, automatic reconnection");
console.log("  API: const es = new EventSource('/events');");
console.log("  Events: 'open', 'message', 'error', custom events; Methods: close()");
console.log("  Use cases: real-time notifications, live feeds, server-sent updates");
console.log("  Comparison: vs WebSocket (bidirectional) | vs polling (lower overhead)");

// ============================================
// 8. BroadcastChannel API
// ============================================
console.log("\n8. BroadcastChannel API:");
console.log("  Cross-tab/frame communication within the same origin");
console.log("  Usage: const channel = new BroadcastChannel('channel-name');");
console.log("  Methods: postMessage(data), close(); Event: 'message'");
console.log("  Use cases: sync state across tabs, notify other tabs of login/logout");

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");
console.log("❌ Storing sensitive data in localStorage: vulnerable to XSS attacks");
console.log("❌ Forgetting JSON.stringify/parse when storing objects in storage APIs");
console.log("❌ Not handling storage quota exceeded errors");
console.log("❌ Using Cookies for large data: wastes bandwidth on every request");
console.log("❌ Not implementing reconnection logic for WebSocket/SSE");
console.log("❌ Not canceling fetch requests when they're no longer needed (memory leaks)");
console.log("❌ Using pushState without server-side routing fallback (404 on direct access)");
console.log("❌ Storing passwords or auth tokens in unencrypted storage");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");
console.log("✅ Use HttpOnly + Secure + SameSite=Strict cookies for authentication tokens");
console.log("✅ Implement proper error handling and fallback for all storage APIs");
console.log("✅ Use IndexedDB for large/offline data; localStorage for small preferences");
console.log("✅ Add AbortController timeouts to all network requests");
console.log("✅ Use secure protocols (wss://, https://) for all network communication");
console.log("✅ Sanitize all data received from network/storage before rendering");
console.log("✅ Clean up event listeners and close connections when no longer needed");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
📘 See TypeScript comparison file: 43-storage-network-ts-comparison.ts
Covers:
- Type definitions for storage APIs
- Typed network request/response interfaces
- Type guards for WebSocket/SSE message payloads
- AbortSignal type safety
*/

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 33-fetch-api.js / 33-3-fetch-practical-patterns.js - Complete Fetch API patterns");
console.log("📘 37-events.js - DOM event handling fundamentals");
console.log("📘 ../architecture/48-security.js - Web security best practices for storage/network");
console.log("📘 36-dom-manipulation.js - DOM update patterns for dynamic data");
