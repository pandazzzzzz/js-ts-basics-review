// Fetch API - Index
// 📘 For TypeScript comparison, see: 33-fetch-api-ts-comparison.ts
// 📘 Detailed version-specific demo files: 33-1 - 33-4
// This file is the index for the Fetch API collection (now split by topic).
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file is the index for the Fetch API collection, now split into four
// focused sub-files. Use it to navigate; the sub-files carry the runnable code.

// ============================================
// Table of Contents
// ============================================
// 1. File Organization
// 2. Sub-file Overview
// 3. Study Path
// 4. Common Pitfalls
// 5. Best Practices
// 6. Cross-references

// ============================================
// 1. File Organization
// ============================================

console.log("=== Fetch API - Index ===\n");

console.log(`
Original file: 33-fetch-api.js (9 sections, all-in-one)
Reorganized into topic-focused demo files:
  33-1-fetch-basics.js              (GET, Response methods, HTTP methods, FormData)
  33-2-fetch-error-handling.js      (error handling, async/await patterns)
  33-3-fetch-practical-patterns.js  (API client, retry, AbortController)
  33-4-fetch-streams-advanced.js    (Stream API, progress, cancellation)
Each sub-file has its own -ts-comparison.ts counterpart.
`);

// ============================================
// 2. Sub-file Overview
// ============================================

console.log("--- 33-1-fetch-basics.js ---");
console.log("  1. GET requests & Response methods (json/text/ok/status)");
console.log("  2. HTTP methods (POST/PUT/DELETE) & headers");
console.log("  3. FormData & body payloads");

console.log("\n--- 33-2-fetch-error-handling.js ---");
console.log("  1. Network vs HTTP errors (fetch rejects only on network failure)");
console.log("  2. async/await with fetch");
console.log("  3. Timeout & retry handling");

console.log("\n--- 33-3-fetch-practical-patterns.js ---");
console.log("  1. API client abstraction");
console.log("  2. AbortController & cancellation");
console.log("  3. Retry with backoff");

console.log("\n--- 33-4-fetch-streams-advanced.js ---");
console.log("  1. ReadableStream & streaming responses");
console.log("  2. Progress tracking");
console.log("  3. Cancellation & partial consumption");

// ============================================
// 3. Study Path
// ============================================

console.log(
  "\nRecommended order: 33-1 (basics) → 33-2 (error handling) → 33-3 (practical) → 33-4 (streams)"
);
console.log("Beginners should complete 33-1 and 33-2 before exploring streams in 33-4.");

// ============================================
// 4. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");
console.log("⚠️  Assuming fetch rejects on HTTP 4xx/5xx (it does not) → 33-2");
console.log("⚠️  Forgetting to check res.ok / res.status → 33-1");
console.log("⚠️  Not handling AbortController for cancelled requests → 33-3");
console.log("⚠️  Misreading stream consumption as one-shot → 33-4");

// ============================================
// 5. Best Practices
// ============================================

console.log("\n=== Best Practices ===");
console.log("✅ Always check res.ok before parsing → 33-1");
console.log("✅ Use AbortController for timeouts & cancellation → 33-3");
console.log("✅ Handle both network errors and HTTP errors distinctly → 33-2");
console.log("✅ Prefer streaming for large payloads → 33-4");

// ============================================
// 6. Cross-references
// ============================================

console.log("\n=== Cross-references ===");
console.log("📘 31-async-await.js - async/await used throughout fetch patterns");
console.log("📘 30-promises.js - Promise chaining and error propagation");
console.log("📘 45-web-apis.js - Other web platform APIs");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 33-fetch-api-ts-comparison.ts
*/
