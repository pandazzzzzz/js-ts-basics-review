// TypeScript vs JavaScript: Scope and Closures - Index
// 📘 For JavaScript index, see: 13-scope-closures.js
// 📘 Detailed version-specific comparison files: 13-1 - 13-5 -ts-comparison.ts
// This file is the TypeScript index for the Scope & Closures collection (now split by topic).
// 🎯 Difficulty: Intermediate
export {};

console.log("=== TypeScript Scope & Closures - Index ===\n");

console.log(`
The Scope & Closures collection is split into five focused sub-files, each with
its own -ts-comparison.ts counterpart showing the TypeScript angle:

  13-1-scope-basics-ts-comparison.ts       → let/const scoping, block-scoped types
  13-2-scope-tdz-strict-ts-comparison.ts   → TDZ/strict mode notes, no eval typing
  13-3-closures-basics-ts-comparison.ts    → readonly for privacy, closure typing
  13-4-closures-patterns-ts-comparison.ts  → typed factories, generics, modules
  13-5-scope-pitfalls-ts-comparison.ts     → compiler catches for classic pitfalls
`);

console.log("--- What TypeScript adds per sub-file ---");
console.log("13-1: block-scoped declarations pair with narrowed types inside blocks");
console.log("13-3: readonly/private modifiers enforce data privacy at compile time");
console.log("13-5: the compiler turns scope pitfalls into build-time errors");

console.log("\nRecommended order: 13-1 → 13-2 → 13-3 → 13-4 → 13-5 (matching the JS demos)");

console.log("\n=== Cross-references ===");
console.log("📘 14-this-keyword-ts-comparison.ts - this typing vs lexical scope");
console.log("📘 27-memory-management-ts-comparison.ts - WeakRef typing");
