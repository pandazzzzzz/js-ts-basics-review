// TypeScript vs JavaScript: Advanced Function Patterns - Index
// 📘 For JavaScript index, see: 24-function-patterns-advanced.js
// 📘 Detailed version-specific comparison files: 24-1/24-2/24-3 -ts-comparison.ts
// This file is the TypeScript index for the Advanced Function Patterns collection (now split by topic).
// 🎯 Difficulty: Advanced
export {};

console.log("=== TypeScript Advanced Function Patterns - Index ===\n");

console.log(`
The Advanced Function Patterns collection is split into three focused sub-files,
each with its own -ts-comparison.ts counterpart showing the TypeScript angle:

  24-1-function-composition-ts-comparison.ts  → typed compose/pipe, generic curry
  24-2-debounce-throttle-ts-comparison.ts     → typed timer wrappers and generics
  24-3-memoization-cache-ts-comparison.ts     → typed cache keys, memoize generics
`);

console.log("--- What TypeScript adds per sub-file ---");
console.log("24-1: generic signatures keep currying/partial application type-safe end to end");
console.log("24-2: parameter/return types document debounce/throttle timing intent");
console.log("24-3: key/value generics make memoization and LRU caches type-checked");

console.log("\nRecommended order: 24-1 → 24-2 → 24-3 (matching the JS demos)");

console.log("\n=== Cross-references ===");
console.log("📘 07-3-functions-patterns-ts-comparison.ts - typed this parameters and overloads");
console.log("📘 26-optimization-performance-ts-comparison.ts - TCO and performance typing");
