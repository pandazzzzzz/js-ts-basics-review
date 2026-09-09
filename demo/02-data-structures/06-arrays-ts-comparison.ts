// TypeScript vs JavaScript: Arrays - Index
// 📘 For JavaScript index, see: 06-arrays.js
// 📘 Detailed version-specific comparison files: 06-1/06-2/06-3/06-4/06-5 -ts-comparison.ts
// This file is the TypeScript index for the Arrays collection (now split by topic).
// 🎯 Difficulty: Beginner
export {};

console.log("=== TypeScript Arrays - Index ===\n");

console.log(`
The Arrays collection is split into five focused sub-files, each with its
own -ts-comparison.ts counterpart showing the TypeScript angle:

  06-1-arrays-basics-ts-comparison.ts      → typed array annotations, readonly
  06-2-arrays-iteration-ts-comparison.ts   → typed callbacks for map/filter/reduce
  06-3-arrays-search-sort-ts-comparison.ts → typed find/includes/sort comparators
  06-4-arrays-manipulation-ts-comparison.ts → typed push/pop/splice/slice
  06-5-typed-arrays-ts-comparison.ts       → TypedArray/ArrayBuffer typing
`);

console.log("--- What TypeScript adds per sub-file ---");
console.log("06-1: explicit element types and readonly arrays catch mutation mistakes");
console.log("06-2: callback parameter types make iteration logic type-safe end to end");
console.log("06-3: comparator/return types document search and sort intent");
console.log("06-4: return types distinguish mutating vs non-mutating methods");
console.log("06-5: fixed numeric types for binary/performance-critical data");

console.log("\nRecommended order: 06-1 → 06-2 → 06-3 → 06-4 → 06-5 (matching the JS demos)");

console.log("\n=== Cross-references ===");
console.log("📘 07-1-functions-basics-ts-comparison.ts - typed callbacks");
console.log("📘 09-destructuring-ts-comparison.ts - typed destructuring");
console.log("📘 41-typed-arrays-ts-comparison.ts - TypedArrays and binary data");
