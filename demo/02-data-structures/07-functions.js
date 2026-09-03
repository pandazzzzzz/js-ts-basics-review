// Functions - Index
// 📘 For TypeScript comparison, see: 07-functions-ts-comparison.ts
// 📘 Detailed version-specific demo files: 07-1 - 07-3
// This file is the index for the Functions collection (now split by topic).
// 🎯 Difficulty: Beginner
export {};

// ============================================
// Learning goals
// ============================================
// This file is the index for the Functions collection, now split into three
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

console.log("=== Functions - Index ===\n");

console.log(`
Original file: 07-functions.js (16 sections)
Reorganized into topic-focused demo files:
  07-1-functions-basics.js     (5 sections: mechanics)
  07-2-functions-advanced.js   (5 sections: advanced behavior, incl. currying)
  07-3-functions-patterns.js   (6 sections: patterns)
Each sub-file has its own -ts-comparison.ts counterpart.
`);

// ============================================
// 2. Sub-file Overview
// ============================================

console.log("--- 07-1-functions-basics.js ---");
console.log("  1. Function Declaration (Function Statement)");
console.log("  2. Function Expression");
console.log("  3. Arrow Function");
console.log("  4. Default Parameters");
console.log("  5. Rest Parameters");

console.log("\n--- 07-2-functions-advanced.js ---");
console.log("  1. Higher-Order Functions");
console.log("  2. Closures");
console.log("  3. Async Functions");
console.log("  4. Generator Functions");
console.log("  5. Currying");

console.log("\n--- 07-3-functions-patterns.js ---");
console.log("  1. Method Definitions");
console.log("  2. Function Binding");
console.log("  3. Function Properties and Methods");
console.log("  4. IIFE Patterns and Use Cases");
console.log("  5. Tail Call Optimization (TCO)");
console.log("  6. Pure Functions and Functional Programming");

// ============================================
// 3. Study Path
// ============================================

console.log("\nRecommended order: 07-1 (mechanics) → 07-2 (behavior) → 07-3 (patterns)");
console.log("Beginners should complete 07-1 before moving on; 07-3 assumes closures (07-2).");

// ============================================
// 4. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");
console.log("⚠️  Losing this when passing methods as callbacks → 07-3 (binding)");
console.log(
  "⚠️  Assuming tail-call optimization exists outside engines like Safari/WebKit → 07-3 (TCO)"
);
console.log(
  "⚠️  Confusing async function return values with plain returns → 07-2 (async functions)"
);

// ============================================
// 5. Best Practices
// ============================================

console.log("\n=== Best Practices ===");
console.log("✅ Use function declarations for hoisted, top-level helpers → 07-1");
console.log("✅ Prefer arrow functions for short callbacks and lexical this → 07-1");
console.log("✅ Keep functions pure where practical; isolate side effects → 07-3");

// ============================================
// 6. Cross-references
// ============================================

console.log("\n=== Cross-references ===");
console.log("📘 06-2-arrays-iteration.js - Functions as array callbacks");
console.log("📘 14-this-keyword.js - this binding rules behind .call/.apply/.bind");
console.log("📘 22-iterators-generators.js - Generators in depth");
console.log(
  "📘 24-function-patterns-advanced.js - Composition, memoization, LRU beyond the basics"
);
console.log("📘 31-async-await.js - Async/await in depth");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 07-functions-ts-comparison.ts
*/
