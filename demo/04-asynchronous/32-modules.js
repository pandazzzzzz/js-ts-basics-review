// Modules Demo
// 📘 For TypeScript comparison, see: 32-modules-ts-comparison.ts
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file covers JavaScript modules:
// 1. Module scope and ES6 import/export syntax
// 2. Named exports, default exports, re-exports
// 3. Dynamic imports (ES2020) and import attributes (ES2025)
// 4. ES Modules vs CommonJS comparison
// 5. Module loading, caching, and circular dependencies
// 6. Practical patterns and best practices

// ============================================
// Table of Contents
// ============================================
// 1. Module Scope
// 2. Named Exports
// 3. Default Exports
// 4. Import Syntax
// 5. Namespace Imports (* as)
// 6. Re-exporting Modules
// 7. Dynamic Imports (ES2020)
// 8. ES Modules vs CommonJS
// 9. Module Loading & Caching
// 10. Circular Dependencies
// 11. Import Hoisting
// 12. Import Attributes (ES2025)
// ============================================

console.log("=== JavaScript Modules Demo ===\n");

// ============================================
// 1. Module Scope
// ============================================
console.log("1. Module Scope:");

// Each module has its own scope — variables are private by default
const privateVariable = "I'm private to this module";

// Top-level 'this' is undefined in modules (not the global object)
console.log("  Top-level 'this' in module:", this); // undefined

console.log("  Variables are private unless explicitly exported");
console.log("  Strict mode is enabled by default in modules\n");

// ============================================
// 2. Named Exports
// ============================================
console.log("2. Named Exports:");

// Inline named exports
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export class Calculator {
  constructor() {
    this.result = 0;
  }
  add(n) {
    this.result += n;
    return this;
  }
  subtract(n) {
    this.result -= n;
    return this;
  }
  getResult() {
    return this.result;
  }
}

// Export list at the end
const MAX_SIZE = 100;
const MIN_SIZE = 1;

function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

export { MAX_SIZE, MIN_SIZE, multiply, divide };

// Rename on export
const internalName = "secret";
export { internalName as publicName };

console.log("  Constants: PI, E, MAX_SIZE, MIN_SIZE");
console.log("  Functions: add, subtract, multiply, divide");
console.log("  Class: Calculator");
console.log("  Renamed: publicName (from internalName)\n");

// ============================================
// 3. Default Exports
// ============================================
console.log("3. Default Exports:");

// Default export — one per module
const DEFAULT_VALUE = 42;
export default DEFAULT_VALUE;

// Named + default can coexist
export const version = "1.0.0";

console.log("  Default export: DEFAULT_VALUE (42)");
console.log("  Named export: version");
console.log(
  "  ⚠️  `export default const x = ...` is a syntax error — declare first, then export\n"
);

// ============================================
// 4. Import Syntax
// ============================================
console.log("4. Import Syntax:");
console.log("  Named:      import { add, subtract } from './math.js';");
console.log("  Default:    import defaultValue from './module.js';");
console.log("  Mixed:      import calc, { version } from './calc.js';");
console.log("  Renamed:    import { add as plus } from './math.js';");
console.log("  Side effect: import './polyfills.js';");
console.log("  ⚠️  File extensions are required in native ESM (works in bundlers without)\n");

// ============================================
// 5. Namespace Imports (* as)
// ============================================
console.log("5. Namespace Imports:");
console.log("  Syntax: import * as MathUtils from './math.js';");
console.log("  Usage: MathUtils.add(1, 2); MathUtils.PI;");
console.log("  Imports all exports as a single namespace object\n");

// ============================================
// 6. Re-exporting Modules
// ============================================
console.log("6. Re-exporting (Barrel Files):");
console.log("  Re-export named:  export { add, subtract } from './math.js';");
console.log("  Re-export all:    export * from './utils.js';");
console.log("  Re-export default: export { default as Calculator } from './calc.js';");
console.log("  Default re-export: export { default } from './plugin.js';");
console.log("  Use case: Barrel files (index.js) simplify imports and hide internal structure\n");

// ============================================
// 7. Dynamic Imports (ES2020)
// ============================================
console.log("7. Dynamic Imports (ES2020):");

// Dynamic import() returns a promise — can be used conditionally
async function loadModuleConditionally(condition) {
  if (condition) {
    // const module = await import('./heavy-module.js');
    console.log("  Dynamic import returns a promise: const mod = await import('./module.js');");
  }
}

loadModuleConditionally(false); // won't output, just demonstrates the function exists

console.log("  Use cases: code splitting, lazy loading, conditional loading");
console.log("  Access exports: mod.default for default, mod.namedExport for named\n");

// ============================================
// 8. ES Modules vs CommonJS
// ============================================
console.log("8. ES Modules vs CommonJS:");

console.log(
  "  CJS (Node.js traditional):  const mod = require('./mod'); module.exports = { ... };"
);
console.log("  ESM (ES6 standard):          import mod from './mod.js'; export const x = ...;");

console.log("\n  Key differences:");
console.log("  Syntax       | CJS uses require()/module.exports | ESM uses import/export");
console.log("  Loading      | CJS sync / blocking              | ESM async / non-blocking");
console.log(
  "  Analysis     | CJS dynamic (runtime)            | ESM static (parse-time, tree-shakeable)"
);
console.log(
  "  Exports      | CJS exports are copies           | ESM imports are live bindings (read-only)"
);
console.log("  Top-level    | CJS this === module.exports      | ESM this === undefined");
console.log(
  '  Extensions   | CJS .js/.cjs                     | ESM .mjs or .js + "type":"module"'
);
console.log("  Top-level await | CJS: not supported           | ESM: supported (ES2022)");

console.log("\n  Interop:");
console.log(
  "  ESM can import CJS: import cjs from './module.cjs'; (default import = module.exports)"
);
console.log(
  "  CJS can import ESM only via dynamic import: const esm = await import('./module.mjs');"
);

console.log("\n  Migration tips:");
console.log('  1. Add "type": "module" to package.json');
console.log("  2. Replace require → import, module.exports → export");
console.log(
  "  3. Replace __dirname: const __dirname = fileURLToPath(new URL('.', import.meta.url));"
);
console.log("  4. Add .js extensions to all relative imports");
console.log("  5. JSON imports need: with { type: 'json' }\n");

// ============================================
// 9. Module Loading & Caching
// ============================================
console.log("9. Module Loading & Caching:");

// Modules are loaded once and cached — all imports share the same instance
let instanceCounter = 0;

export class Singleton {
  constructor() {
    instanceCounter++;
    this.id = instanceCounter;
  }
  getId() {
    return this.id;
  }
}

console.log("  Module code executes once on first import");
console.log("  Subsequent imports return the cached module instance");
console.log("  This makes the singleton pattern simple: export a shared object\n");

// ============================================
// 10. Circular Dependencies
// ============================================
console.log("10. Circular Dependencies:");
console.log("  Problem: Module A imports B, B imports A → values may be undefined during init");
console.log("  ES Modules handle circular deps better than CJS via live bindings");
console.log(
  "  Solutions: extract shared code to third module, use dependency injection, redesign\n"
);

// ============================================
// 11. Import Hoisting
// ============================================
console.log("11. Import Hoisting:");
console.log("  Static imports are hoisted — they run before any other code in the module");
console.log("  Cannot use static import conditionally or inside functions");
console.log("  Use dynamic import() for conditional or runtime-dependent loading\n");

// ============================================
// 12. Import Attributes (ES2025)
// ============================================

/*
 * verification:
 *   feature: Import Attributes
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

console.log("12. Import Attributes (ES2025):");
console.log("  Syntax: import data from './data.json' with { type: 'json' };");
console.log("  `with` provides import metadata to the module loader");
console.log("  Renamed from Import Assertions (`assert`) — the old keyword is deprecated/removed");
console.log("  Dynamic: const mod = await import('./data.json', { with: { type: 'json' } });");

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");
console.log("❌ Default vs named export mismatch (check what the module actually exports)");
console.log("❌ Forgetting .js extensions in native ESM imports");
console.log("❌ Trying to reassign imported bindings (they're read-only live bindings)");
console.log("❌ Not handling circular dependencies (values can be undefined during init)");
console.log("❌ Side effects on module load (makes modules harder to test and tree-shake)");
console.log("❌ `export default const x = ...` is a syntax error");
console.log("❌ Using `assert` instead of `with` for import attributes (deprecated)");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");
console.log("✅ Prefer named exports over default exports (better refactoring & tree-shaking)");
console.log("✅ Use barrel files (index.js) for clean public APIs");
console.log("✅ Keep modules focused on a single responsibility");
console.log("✅ Use dynamic imports for code splitting and lazy loading");
console.log("✅ Always include file extensions in relative imports");
console.log("✅ Avoid circular dependencies — extract shared code instead");
console.log("✅ Organize by feature, not by type (features/user/ over models/, services/)");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 18-es6-plus-syntax.js - ES6+ syntax features");
console.log("📘 33-3-fetch-practical-patterns.js - Dynamic import patterns");
console.log("📘 ../06-advanced/tooling/49-build-tools.js - Build tools and bundling");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 32-modules-ts-comparison.ts
*/
