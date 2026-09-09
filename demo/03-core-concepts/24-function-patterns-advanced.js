// Function Patterns - Advanced Index
// 📘 For TypeScript comparison, see: 24-function-patterns-advanced-ts-comparison.ts
// 📘 Detailed version-specific demo files: 24-1 - 24-3
// This file is the index for the Advanced Function Patterns collection (now split by topic).
// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// This file is the index for the Advanced Function Patterns collection, now
// split into three focused sub-files. Use it to navigate; the sub-files carry
// the runnable code.

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

console.log("=== Function Patterns - Advanced Index ===\n");

console.log(`
Original file: 24-function-patterns-advanced.js (recursion + composition + rate-limiting + caching)
Reorganized into topic-focused demo files:
  24-1-function-composition.js   (compose/pipe, currying, partial application, factories, HOF)
  24-2-debounce-throttle.js      (debounce/throttle implementations and variants)
  24-3-memoization-cache.js      (memoization, LRU cache, trampolines, recursion patterns, point-free)
Each sub-file has its own -ts-comparison.ts counterpart.
`);

// ============================================
// 2. Sub-file Overview
// ============================================

console.log("--- 24-1-function-composition.js ---");
console.log("  1. Function Composition (compose/pipe)");
console.log("  2. Currying");
console.log("  3. Partial Application");
console.log("  4. Factories");
console.log("  5. Higher-Order Functions");

console.log("\n--- 24-2-debounce-throttle.js ---");
console.log("  1. Debounce");
console.log("  2. Throttle");
console.log("  3. Variants (leading/trailing edge)");
console.log("  4. Cancellation & maxWait");

console.log("\n--- 24-3-memoization-cache.js ---");
console.log("  1. Memoization");
console.log("  2. LRU cache");
console.log("  3. Trampolines (tail-recursion optimization)");
console.log("  4. Recursion patterns (linear, tail, tree, reducer)");
console.log("  5. Point-free style");

// ============================================
// 3. Study Path
// ============================================

console.log(
  "\nRecommended order: 24-1 (composition) → 24-2 (rate-limiting) → 24-3 (caching + recursion)"
);
console.log("24-3 assumes closure and recursion fundamentals; 24-1 is the foundation.");

// ============================================
// 4. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");
console.log("⚠️  Deep recursion overflows without tail calls → 24-3 (trampolines)");
console.log("⚠️  Unbounded caching leaks memory → 24-3 (LRU eviction)");
console.log("⚠️  Wrong debounce/throttle delays hurt UX → 24-2");
console.log("⚠️  Over-composing hides data flow → 24-1");

// ============================================
// 5. Best Practices
// ============================================

console.log("\n=== Best Practices ===");
console.log("✅ Use trampolines for deep/mutual recursion → 24-3");
console.log("✅ Prefer tail recursion when recursion is required → 24-3");
console.log("✅ Use point-free style only where it improves intent → 24-3");
console.log("✅ Pick debounce vs throttle by use case → 24-2");
console.log("✅ Keep composition chains short and readable → 24-1");

// ============================================
// 6. Cross-references
// ============================================

console.log("\n=== Cross-references ===");
console.log("📘 07-3-functions-patterns.js - Pure functions, TCO, IIFE");
console.log("📘 26-optimization-performance.js - Tail-call optimization, performance");
console.log("📘 44-design-patterns.js - Higher-order patterns in design context");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 24-function-patterns-advanced-ts-comparison.ts
*/
