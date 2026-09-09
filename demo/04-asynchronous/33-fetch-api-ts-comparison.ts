// TypeScript vs JavaScript: Fetch API - Index
// 📘 For JavaScript index, see: 33-fetch-api.js
// 📘 Detailed version-specific comparison files: 33-1/33-2/33-3/33-4 -ts-comparison.ts
// This file is the TypeScript index for the Fetch API collection (now split by topic).
// 🎯 Difficulty: Intermediate
export {};

console.log("=== TypeScript Fetch API - Index ===\n");

console.log(`
The Fetch API collection is split into four focused sub-files, each with its
own -ts-comparison.ts counterpart showing the TypeScript angle:

  33-1-fetch-basics-ts-comparison.ts              → typed fetch() and Response/RequestInit
  33-2-fetch-error-handling-ts-comparison.ts      → typed error handling and type guards
  33-3-fetch-practical-patterns-ts-comparison.ts  → generic API client and AbortController types
  33-4-fetch-streams-advanced-ts-comparison.ts    → typed ReadableStream and stream processing
`);

console.log("--- What TypeScript adds per sub-file ---");
console.log("33-1: built-in fetch/Response/RequestInit types catch malformed requests");
console.log("33-2: union types and guards distinguish network vs HTTP errors");
console.log("33-3: generic clients type the response body per endpoint");
console.log("33-4: stream generics make chunk processing type-safe");

console.log("\nRecommended order: 33-1 → 33-2 → 33-3 → 33-4 (matching the JS demos)");

console.log("\n=== Cross-references ===");
console.log("📘 31-async-await-ts-comparison.ts - async/await typing");
console.log("📘 30-promises-ts-comparison.ts - Promise generics");
console.log("📘 45-web-apis-ts-comparison.ts - web platform typing");
