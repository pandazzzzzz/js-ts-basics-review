// Arrays - Index
// 📘 For TypeScript comparison, see: 06-arrays-ts-comparison.ts
// 📘 Detailed version-specific demo files: 06-1 - 06-5
// This file is the index for the Arrays collection (now split by topic).
// 🎯 Difficulty: Beginner
export {};

// ============================================
// Learning goals
// ============================================
// This file is the index for the Arrays collection, now split into five
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

console.log("=== Arrays - Index ===\n");

console.log(`
Original file: 06-arrays.js (7 sections, all-in-one)
Reorganized into topic-focused demo files:
  06-1-arrays-basics.js        (creation, access, type checks, destructuring)
  06-2-arrays-iteration.js     (forEach/map/filter/reduce/flat/flatMap)
  06-3-arrays-search-sort.js   (find/findIndex/includes/some/every/sort)
  06-4-arrays-manipulation.js  (push/pop/splice/slice/concat/spread)
  06-5-typed-arrays.js         (TypedArray/ArrayBuffer/DataView basics)
Each sub-file has its own -ts-comparison.ts counterpart.
`);

// ============================================
// 2. Sub-file Overview
// ============================================

console.log("--- 06-1-arrays-basics.js ---");
console.log("  1. Array Creation (literal, constructor, of, from, isArray)");
console.log("  2. Access & modification (bracket, length, at(), negative indices)");
console.log("  3. Type checks (Array.isArray, typeof)");
console.log("  4. Destructuring (ES6)");
console.log("  5. Sparse arrays & holes");

console.log("\n--- 06-2-arrays-iteration.js ---");
console.log("  1. forEach");
console.log("  2. map");
console.log("  3. filter");
console.log("  4. reduce / reduceRight");
console.log("  5. flat / flatMap (ES2019)");

console.log("\n--- 06-3-arrays-search-sort.js ---");
console.log("  1. find / findIndex");
console.log("  2. findLast / findLastIndex (ES2023)");
console.log("  3. includes (ES2016)");
console.log("  4. some / every");
console.log("  5. indexOf / lastIndexOf");
console.log("  6. sort / toSorted (ES2023) / reverse / toReversed (ES2023)");
console.log("  7. at() (ES2022), with (ES2023), toSpliced (ES2023)");

console.log("\n--- 06-4-arrays-manipulation.js ---");
console.log("  1. Mutating: push/pop/shift/unshift, splice, fill, copyWithin, sort, reverse");
console.log("  2. Non-mutating: slice, concat, join, spread");

console.log("\n--- 06-5-typed-arrays.js ---");
console.log("  1. TypedArray types (Int8/Unit8/Int16/.../Float64)");
console.log("  2. ArrayBuffer & views");
console.log("  3. DataView basics");

// ============================================
// 3. Study Path
// ============================================

console.log(
  "\nRecommended order: 06-1 (basics) → 06-2 (iteration) → 06-3 (search/sort) → 06-4 (manipulation) → 06-5 (typed arrays)"
);
console.log("Beginners should complete 06-1 before moving on; 06-2 assumes destructuring (06-1).");

// ============================================
// 4. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");
console.log("⚠️  sort() without compare function sorts lexicographically → 06-3");
console.log("⚠️  indexOf cannot find NaN (includes can, SameValueZero) → 06-3");
console.log("⚠️  Mutating vs non-mutating methods (sort/reverse mutate) → 06-3/06-4");
console.log("⚠️  new Array(5) vs Array.of(5) ambiguity → 06-1");
console.log("⚠️  Sparse array holes behave differently across methods → 06-1");

// ============================================
// 5. Best Practices
// ============================================

console.log("\n=== Best Practices ===");
console.log("✅ Use const for arrays (prevents reassignment) → 06-1");
console.log("✅ Use spread for shallow copies → 06-4");
console.log("✅ Prefer immutable methods (toSorted/toReversed/with) when possible → 06-3");
console.log(
  "✅ Use the right tool: forEach side-effects, map transform, filter select, reduce accumulate → 06-2"
);

// ============================================
// 6. Cross-references
// ============================================

console.log("\n=== Cross-references ===");
console.log("📘 07-1-functions-basics.js - Callbacks used by iteration methods");
console.log("📘 09-destructuring.js - Array destructuring in depth");
console.log("📘 41-typed-arrays.js - Typed arrays and binary data (advanced)");
console.log("📘 39-3-es2023-features.js - Immutable array methods (ES2023)");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06-arrays-ts-comparison.ts
*/
