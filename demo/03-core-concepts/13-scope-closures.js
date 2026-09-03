// Scope and Closures - Index
// 📘 For TypeScript comparison, see: 13-scope-closures-ts-comparison.ts
// 📘 Detailed version-specific demo files: 13-1 - 13-5
// This file is the index for the Scope & Closures collection (now split by topic).
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file is the index for the Scope & Closures collection, now split into
// five focused sub-files. Use it to navigate; the sub-files carry the runnable code.

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

console.log("=== Scope and Closures - Index ===\n");

console.log(`
Original file: 13-scope-closures.js (12+ sections)
Reorganized into topic-focused demo files:
  13-1-scope-basics.js       (scope fundamentals)
  13-2-scope-tdz-strict.js   (TDZ, strict mode, eval/with)
  13-3-closures-basics.js    (closure principles and data privacy)
  13-4-closures-patterns.js  (factories, partial application, memoization, module, IIFE)
  13-5-scope-pitfalls.js     (pitfalls, memory, performance, best practices)
Each sub-file has its own -ts-comparison.ts counterpart.
`);

// ============================================
// 2. Sub-file Overview
// ============================================

console.log("--- 13-1-scope-basics.js ---");
console.log("  1. Global Scope · 2. Function (Local) Scope · 3. Block Scope");
console.log("  4. Lexical (Static) Scope · 5. Scope Chain · 6. Variable Shadowing");

console.log("\n--- 13-2-scope-tdz-strict.js ---");
console.log("  1. Temporal Dead Zone (TDZ) · 2. Strict Mode Impact on Scope");
console.log("  3. eval() (Avoid) · 4. with Statement (Deprecated, Avoid)");

console.log("\n--- 13-3-closures-basics.js ---");
console.log("  1. What is a Closure? · 2. Closure Principles");
console.log("  3. Closures for Data Privacy · 4. Closure Memory Behavior · 5. Common Patterns");

console.log("\n--- 13-4-closures-patterns.js ---");
console.log("  1. Function Factories · 2. Partial Application · 3. Memoization");
console.log("  4. Module Pattern · 5. IIFE");

console.log("\n--- 13-5-scope-pitfalls.js ---");
console.log("  1. Common Pitfalls · 2. Memory Management Issues");
console.log("  3. Performance Considerations · 4. Best Practices · 5. Summary Table");

// ============================================
// 3. Study Path
// ============================================

console.log("\nRecommended order: 13-1 → 13-2 → 13-3 → 13-4 → 13-5");
console.log("Closures (13-3) build directly on scope chain and shadowing (13-1).");

// ============================================
// 4. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");
console.log("⚠️  Accessing let/const before declaration → TDZ, 13-2");
console.log("⚠️  Capturing loop variables with var in callbacks → 13-5");
console.log("⚠️  Accidental closures over large objects keeping memory alive → 13-5");

// ============================================
// 5. Best Practices
// ============================================

console.log("\n=== Best Practices ===");
console.log("✅ Prefer block-scoped let/const and small function scopes → 13-1");
console.log("✅ Use closures intentionally (privacy, factories), not accidentally → 13-3/13-4");

// ============================================
// 6. Cross-references
// ============================================

console.log("\n=== Cross-references ===");
console.log("📘 14-this-keyword.js - this binding vs lexical scope");
console.log("📘 27-memory-management.js - GC behavior of retained closures");
console.log("📘 07-functions.js (index) - Function mechanics feeding into closures");
console.log("📘 07-2-functions-advanced.js - Closures from the functions angle");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 13-scope-closures-ts-comparison.ts
*/
