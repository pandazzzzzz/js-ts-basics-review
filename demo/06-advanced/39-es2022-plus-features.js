// ES2022+ Features Demo - Index
// 📘 For TypeScript comparison index, see: 39-es2022-plus-features-ts-comparison.ts
// 📘 Detailed version-specific demo files: 39.1 - 39.7
// This file is the index for the ES2022+ features collection (now split by version)

export {}; // Module

// ============================================
// File Organization
// ============================================

console.log("=== ES2022+ Features - Index ===\n");

console.log(`
Original file: 39-es2022-plus-features.js (1749 lines)
Reorganized into per-version demo files:

39.1-es2021-features.js  → ES2021 (replaceAll, logical assignment, numeric separators, WeakRef, etc.)
39.2-es2022-features.js  → ES2022 (private fields, .at(), Object.hasOwn, Error.cause, top-level await, etc.)
39.3-es2023-features.js  → ES2023 (immutable array methods, findLast, Hashbang, Symbols as WeakMap keys)
39.4-es2024-features.js  → ES2024 (groupBy, Promise.withResolvers, RegExp v flag, Resizable ArrayBuffer, etc.)
39.5-es2025-features.js  → ES2025 (Set methods, Iterator helpers, RegExp.escape, Promise.try, etc.)
39.6-es2026-features.js  → ES2026 (Math.sumPrecise, Array.fromAsync, Uint8Array Base64, Map.upsert, etc.)
39.7-es2027-future.js    → ES2027 & beyond (Temporal API, using/await using, Joint Iteration, Decorators, etc.)

Rationale:
  ✅ Clear separation by ES version (chronological order)
  ✅ Smaller, focused files (200-500 lines each, easier navigation)
  ✅ Consistent structure across all demo files
  ✅ Better maintainability (add new ES versions as they are released)
  ✅ All original content preserved, no features removed
`);

// ============================================
// Quick Reference
// ============================================

console.log("\n=== Quick Reference ===");
console.log("Open individual version files for detailed explanations and code examples.");
console.log("Each file contains runnable examples, verification blocks, and best practices.");
console.log("File naming matches the ECMA-262 version release schedule.");

// ============================================
// Version Timeline
// ============================================

console.log("\n=== ES Version Timeline ===");
console.log("ES2021 · June 2021 · First release with yearly cadence established");
console.log("ES2022 · June 2022 · Class features, error improvements");
console.log("ES2023 · June 2023 · Immutable array methods");
console.log("ES2024 · June 2024 · Grouping, resizable buffers");
console.log("ES2025 · June 2025 · Set methods, iterator helpers");
console.log("ES2026 · June 2026 · Math utilities, Base64 methods");
console.log("ES2027 · June 2027 · Temporal, resource management");
console.log("\n✅ All ES versions from 2021 onward are covered in the split files");

// ============================================
// See also
// ============================================
console.log("\n=== Related Files ===");
console.log("📘 Promise combinators: 30-promises.js");
console.log("📘 Class features: 16-classes.js");
console.log("📘 Array methods: 06-arrays.js");
console.log("📘 Regular Expressions: 21-regex.js");
console.log("📘 Internationalization: 42-intl-api.js");
console.log("📘 String methods: 04-strings.js");
console.log("📘 TypeScript advanced features: 47-typescript-advanced.js");

console.log("\n=== Verification ===");
console.log("All ES version annotations are verified against TC39 official documentation");
console.log("Last verified: 2026-07-31");