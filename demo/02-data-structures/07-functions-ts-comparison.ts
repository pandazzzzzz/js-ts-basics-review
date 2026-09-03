// TypeScript vs JavaScript: Functions - Index
// 📘 For JavaScript index, see: 07-functions.js
// 📘 Detailed version-specific comparison files: 07-1/07-2/07-3 -ts-comparison.ts
// This file is the TypeScript index for the Functions collection (now split by topic).
// 🎯 Difficulty: Beginner
export {};

console.log("=== TypeScript Functions - Index ===\n");

console.log(`
The Functions collection is split into three focused sub-files, each with its
own -ts-comparison.ts counterpart showing the TypeScript angle:

  07-1-functions-basics-ts-comparison.ts      → typed parameters/returns,
                                                void vs undefined, optional params
  07-2-functions-advanced-ts-comparison.ts    → function types, generics for
                                                HOFs, typed generators
  07-3-functions-patterns-ts-comparison.ts    → this-parameter typing, overloads,
                                                readonly and pure-function patterns
`);

console.log("--- What TypeScript adds per sub-file ---");
console.log("07-1: explicit parameter and return types catch call-site mistakes early");
console.log("07-2: generics keep higher-order functions type-safe end to end");
console.log("07-3: this parameters and overloads document binding and polymorphism");

console.log("\nRecommended order: 07-1 → 07-2 → 07-3 (matching the JS demos)");

console.log("\n=== Cross-references ===");
console.log("📘 14-this-keyword-ts-comparison.ts - this typing rules");
console.log("📘 24-function-patterns-advanced-ts-comparison.ts - typed composition/currying");
