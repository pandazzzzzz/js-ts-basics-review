// Modules Demo
// 📘 For TypeScript comparison, see: 32-modules-ts-comparison.ts

// ============================================
// 1. INTRODUCTION TO MODULES
// ============================================

/**
 * JavaScript Modules - Code organization system
 * 
 * ES Specification: ES6/ES2015 (static imports/exports)
 *                   ES2020 (dynamic imports)
 * 
 * Characteristics:
 * - Each module has its own scope
 * - Explicit imports and exports
 * - Strict mode by default
 * - Top-level 'this' is undefined
 * - Deferred execution (like defer attribute)
 * - Loaded only once (cached)
 * 
 * Use Cases:
 * - Code organization and reusability
 * - Dependency management
 * - Namespace isolation
 * - Lazy loading with dynamic imports
 * 
 * Common Pitfalls:
 * - Circular dependencies
 * - Import hoisting confusion
 * - Default vs named export confusion
 * - File extension requirements
 */

console.log("=== JavaScript Modules Demo ===\n");

// ============================================
// 2. MODULE SCOPE
// ============================================

/**
 * Module Scope - Each module has its own scope
 * 
 * Characteristics:
 * - Variables are private by default
 * - Must explicitly export to share
 * - No global namespace pollution
 * - Top-level variables don't become global
 */

console.log("=== Module Scope ===\n");

// This variable is private to this module
const privateVariable = "I'm private to this module";

// Top-level 'this' is undefined in modules (not window/global)
console.log("Top-level 'this' in module:", this); // undefined

// In non-module scripts, 'this' would be the global object
// In browsers: window
// In Node.js: global

console.log("Module scope example:");
console.log("  privateVariable:", privateVariable);
console.log("  This variable is NOT accessible from other modules");
console.log("  unless explicitly exported\n");

// ============================================
// 3. NAMED EXPORTS
// ============================================

/**
 * Named Exports - Export multiple values by name
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Can export multiple values
 * - Must import with exact name (or use 'as')
 * - Can export inline or separately
 * - Can rename on export
 * 
 * Use Cases:
 * - Exporting multiple utilities
 * - Library APIs with multiple functions
 * - Configuration objects
 */

console.log("=== Named Exports ===\n");

// Method 1: Inline named exports
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

// Method 2: Export list at the end
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

// Method 3: Rename on export
const internalName = "secret";
export { internalName as publicName };

console.log("Named exports defined:");
console.log("  - Constants: PI, E, MAX_SIZE, MIN_SIZE");
console.log("  - Functions: add, subtract, multiply, divide");
console.log("  - Class: Calculator");
console.log("  - Renamed: publicName (from internalName)\n");

// ============================================
// 4. DEFAULT EXPORTS
// ============================================

/**
 * Default Export - Export a single main value
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Only one default export per module
 * - Can import with any name
 * - Can be combined with named exports
 * - Common for classes and main functions
 * 
 * Use Cases:
 * - Main class or function of a module
 * - Single configuration object
 * - React components
 * 
 * Common Pitfalls:
 * - Can't use 'export default const' (syntax error)
 * - Confusion between default and named exports
 */

console.log("=== Default Exports ===\n");

// Method 1: Inline default export
// export default class User {
//   constructor(name) {
//     this.name = name;
//   }
// }

// Method 2: Export existing value as default
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getInfo() {
    return `${this.name} <${this.email}>`;
  }
}

// Note: In a real module, you'd have only ONE default export
// This is just for demonstration
// export default User;

console.log("Default export pattern:");
console.log("  - Typically used for main class or function");
console.log("  - Can be imported with any name");
console.log("  - Only one per module\n");

// Combining default and named exports
// export default User;
// export { PI, add, subtract }; // Named exports alongside default

// ============================================
// 5. IMPORT SYNTAX
// ============================================

/**
 * Import Statements - Bring in exported values
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Hoisted to top of module
 * - Read-only bindings (live connections)
 * - Static analysis possible
 * - Executed before module code
 * 
 * Common Pitfalls:
 * - Import hoisting can be confusing
 * - Can't use imports conditionally
 * - Must use exact names for named imports
 */

console.log("=== Import Syntax Examples ===\n");

// These are examples of import syntax (commented out since we can't import in this demo)

// Method 1: Named imports
// import { add, subtract, PI } from './math.js';

// Method 2: Rename on import
// import { add as sum, subtract as diff } from './math.js';

// Method 3: Default import
// import User from './user.js';

// Method 4: Default + named imports
// import User, { PI, add } from './module.js';

// Method 5: Import everything as namespace
// import * as MathUtils from './math.js';
// MathUtils.add(1, 2);
// MathUtils.PI;

// Method 6: Import for side effects only (no bindings)
// import './polyfills.js';

console.log("Import patterns:");
console.log("  1. Named: import { add, subtract } from './math.js'");
console.log("  2. Renamed: import { add as sum } from './math.js'");
console.log("  3. Default: import User from './user.js'");
console.log("  4. Mixed: import User, { PI } from './module.js'");
console.log("  5. Namespace: import * as Utils from './utils.js'");
console.log("  6. Side effects: import './setup.js'\n");

// ============================================
// 6. IMPORT * AS (NAMESPACE IMPORTS)
// ============================================

/**
 * Namespace Imports - Import everything as an object
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Creates a namespace object
 * - All exports become properties
 * - Useful for large modules
 * - Prevents naming conflicts
 * 
 * Use Cases:
 * - Importing utility libraries
 * - Avoiding name collisions
 * - Clearer code organization
 */

console.log("=== Namespace Imports ===\n");

// Example: import * as MathUtils from './math.js';
// Usage:
//   MathUtils.add(1, 2)
//   MathUtils.PI
//   new MathUtils.Calculator()

console.log("Namespace import pattern:");
console.log("  import * as Utils from './utils.js'");
console.log("  Utils.function1()");
console.log("  Utils.function2()");
console.log("  Utils.CONSTANT\n");

// Benefits:
console.log("Benefits:");
console.log("  - Clear origin of functions");
console.log("  - No naming conflicts");
console.log("  - Easy to see module dependencies\n");

// ============================================
// 7. RE-EXPORTING MODULES
// ============================================

/**
 * Re-exports - Export from another module
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Create barrel files (index.js)
 * - Aggregate exports from multiple modules
 * - Can rename while re-exporting
 * - Simplifies import paths
 * 
 * Use Cases:
 * - Creating public APIs
 * - Organizing large codebases
 * - Hiding internal structure
 */

console.log("=== Re-exporting Modules ===\n");

// Pattern 1: Re-export everything
// export * from './math.js';

// Pattern 2: Re-export specific items
// export { add, subtract } from './math.js';

// Pattern 3: Re-export with rename
// export { add as sum } from './math.js';

// Pattern 4: Re-export default as named
// export { default as User } from './user.js';

// Pattern 5: Re-export named as default
// export { User as default } from './user.js';

console.log("Re-export patterns:");
console.log("  1. All: export * from './module.js'");
console.log("  2. Specific: export { fn1, fn2 } from './module.js'");
console.log("  3. Renamed: export { fn as newName } from './module.js'");
console.log("  4. Default to named: export { default as Name } from './m.js'");
console.log("  5. Named to default: export { Name as default } from './m.js'\n");

// Barrel file example (index.js):
// export * from './user.js';
// export * from './product.js';
// export * from './order.js';
// 
// Usage:
// import { User, Product, Order } from './models';
// Instead of:
// import { User } from './models/user.js';
// import { Product } from './models/product.js';
// import { Order } from './models/order.js';

console.log("Barrel file pattern:");
console.log("  Create index.js that re-exports from multiple files");
console.log("  Simplifies imports for consumers\n");

// ============================================
// 8. DYNAMIC IMPORTS
// ============================================

/**
 * Dynamic Imports - Load modules at runtime
 * 
 * ES Specification: ES2020
 * 
 * The import() function enables dynamic module loading at runtime.
 * 
 * Characteristics:
 * - Returns a Promise
 * - Can be used conditionally
 * - Enables code splitting
 * - Not hoisted (executed when reached)
 * - Can use expressions for module path
 * 
 * Use Cases:
 * - Lazy loading
 * - Conditional module loading
 * - Code splitting for performance
 * - Loading modules based on user action
 * 
 * Common Pitfalls:
 * - Forgetting to handle Promise
 * - Not handling import errors
 * - Overusing (can hurt performance)
 */

console.log("=== Dynamic Imports ===\n");

// Dynamic import returns a Promise
async function loadModule() {
  try {
    // Note: This would work in a real module environment
    // const module = await import('./math.js');
    // console.log(module.add(1, 2));
    
    console.log("Dynamic import pattern:");
    console.log("  const module = await import('./module.js');");
    console.log("  module.function();");
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

// Conditional loading
async function loadFeature(featureName) {
  console.log("\nConditional loading example:");
  
  if (featureName === 'advanced') {
    // const advanced = await import('./advanced.js');
    console.log("  Would load: ./advanced.js");
  } else {
    // const basic = await import('./basic.js');
    console.log("  Would load: ./basic.js");
  }
}

loadFeature('advanced');

// Dynamic path
async function loadLanguage(lang) {
  console.log("\nDynamic path example:");
  // const translations = await import(`./i18n/${lang}.js`);
  console.log(`  Would load: ./i18n/${lang}.js`);
}

loadLanguage('en');

// Lazy loading on user action
async function handleButtonClick() {
  console.log("\nLazy loading example:");
  console.log("  User clicked button");
  
  // Load heavy module only when needed
  // const heavyModule = await import('./heavy-feature.js');
  // heavyModule.initialize();
  
  console.log("  Would load heavy module on demand");
}

// Simulate button click
setTimeout(handleButtonClick, 100);

// Benefits of dynamic imports
console.log("\nBenefits of dynamic imports:");
console.log("  - Smaller initial bundle size");
console.log("  - Faster initial page load");
console.log("  - Load features on demand");
console.log("  - Better performance for large apps\n");

// ============================================
// 9. ES MODULES VS COMMONJS (DETAILED COMPARISON)
// ============================================

/**
 * ES Modules vs CommonJS - Two module systems
 * 
 * ES Modules (ESM):
 * - Standard JavaScript modules (ES6+)
 * - Static imports/exports
 * - Asynchronous loading
 * - Tree-shaking friendly
 * - Browser and Node.js support
 * 
 * CommonJS (CJS):
 * - Node.js traditional module system
 * - Dynamic require()
 * - Synchronous loading
 * - No tree-shaking
 * - Primarily Node.js
 */

console.log("=== ES Modules vs CommonJS (Detailed) ===\n");

// ============================================
// 9.1 CommonJS Syntax and Patterns
// ============================================

console.log("--- CommonJS (CJS) Syntax ---\n");

// CommonJS Export Patterns
console.log("CommonJS Export Patterns:");
console.log(`
// Pattern 1: module.exports (single export)
module.exports = function add(a, b) {
  return a + b;
};

// Pattern 2: module.exports object
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  PI: 3.14159
};

// Pattern 3: exports shorthand (adds properties)
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
exports.PI = 3.14159;

// ⚠️ PITFALL: Don't reassign exports
exports = { add }; // ❌ Doesn't work! Use module.exports
module.exports = { add }; // ✅ Correct

// Pattern 4: Exporting class
class Calculator {
  add(a, b) { return a + b; }
}
module.exports = Calculator;

// Pattern 5: Mixed exports
module.exports = Calculator;
module.exports.version = '1.0.0';
module.exports.utils = { format: (n) => n.toFixed(2) };
`);

// CommonJS Import Patterns
console.log("CommonJS Import Patterns:");
console.log(`
// Pattern 1: Import entire module
const math = require('./math');
math.add(1, 2);

// Pattern 2: Destructuring import
const { add, subtract } = require('./math');
add(1, 2);

// Pattern 3: Import default export
const Calculator = require('./calculator');
const calc = new Calculator();

// Pattern 4: Conditional require (dynamic)
if (condition) {
  const feature = require('./feature');
  feature.init();
}

// Pattern 5: Lazy loading
function loadHeavyModule() {
  const heavy = require('./heavy-module');
  return heavy;
}

// Pattern 6: Caching behavior
const module1 = require('./module'); // Loads and caches
const module2 = require('./module'); // Returns cached version
console.log(module1 === module2); // true
`);

// ============================================
// 9.2 ES Modules Syntax (Detailed)
// ============================================

console.log("\n--- ES Modules (ESM) Syntax ---\n");

console.log("ES Modules Export Patterns:");
console.log(`
// Pattern 1: Named exports (inline)
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator { }

// Pattern 2: Named exports (list)
const PI = 3.14159;
function add(a, b) { return a + b; }
export { PI, add };

// Pattern 3: Default export
export default class Calculator { }
// Or:
class Calculator { }
export default Calculator;

// Pattern 4: Mixed exports
export default Calculator;
export const version = '1.0.0';
export const utils = { format: (n) => n.toFixed(2) };

// Pattern 5: Re-exports
export { add, subtract } from './math.js';
export * from './utils.js';
export { default as Calculator } from './calculator.js';
`);

console.log("ES Modules Import Patterns:");
console.log(`
// Pattern 1: Named imports
import { add, subtract } from './math.js';

// Pattern 2: Default import
import Calculator from './calculator.js';

// Pattern 3: Mixed imports
import Calculator, { version, utils } from './calculator.js';

// Pattern 4: Namespace import
import * as Math from './math.js';
Math.add(1, 2);

// Pattern 5: Side effects only
import './polyfills.js';

// Pattern 6: Dynamic import (ES2020)
const module = await import('./module.js');
`);

// ============================================
// 9.3 Key Differences and Comparison
// ============================================

console.log("\n--- Detailed Comparison ---\n");

console.log("1. SYNTAX:");
console.log("  CommonJS:");
console.log("    const module = require('./module');");
console.log("    module.exports = { value: 42 };");
console.log("  ES Modules:");
console.log("    import module from './module.js';");
console.log("    export const value = 42;");

console.log("\n2. LOADING:");
console.log("  CommonJS:");
console.log("    - Synchronous (blocking)");
console.log("    - Loaded at runtime");
console.log("    - Can be called anywhere in code");
console.log("  ES Modules:");
console.log("    - Asynchronous (non-blocking)");
console.log("    - Loaded at parse time");
console.log("    - Hoisted to top of file");

console.log("\n3. STATIC vs DYNAMIC:");
console.log("  CommonJS:");
console.log("    - Dynamic: require() can use variables");
console.log("    - const mod = require(dynamicPath);");
console.log("    - Conditional requires allowed");
console.log("  ES Modules:");
console.log("    - Static: import path must be string literal");
console.log("    - Enables tree-shaking and optimization");
console.log("    - Use dynamic import() for runtime loading");

console.log("\n4. MUTABILITY:");
console.log("  CommonJS:");
console.log("    - Exports are copies (mutable)");
console.log("    - Can modify imported values");
console.log("  ES Modules:");
console.log("    - Imports are live bindings (read-only)");
console.log("    - Cannot reassign imported values");

console.log("\n5. THIS BINDING:");
console.log("  CommonJS:");
console.log("    - 'this' refers to module.exports");
console.log("    - console.log(this === module.exports); // true");
console.log("  ES Modules:");
console.log("    - 'this' is undefined at top level");
console.log("    - console.log(this); // undefined");

console.log("\n6. FILE EXTENSIONS:");
console.log("  CommonJS:");
console.log("    - .js (default in Node.js)");
console.log("    - .cjs (explicit CommonJS)");
console.log("  ES Modules:");
console.log("    - .mjs (explicit ES Module)");
console.log("    - .js with \"type\": \"module\" in package.json");

console.log("\n7. TOP-LEVEL AWAIT:");
console.log("  CommonJS:");
console.log("    - Not supported");
console.log("    - Must use async IIFE or promises");
console.log("  ES Modules:");
console.log("    - Supported (ES2022)");
console.log("    - const data = await fetch(url);");

console.log("\n8. TREE-SHAKING:");
console.log("  CommonJS:");
console.log("    - Not possible (dynamic nature)");
console.log("    - Entire module included in bundle");
console.log("  ES Modules:");
console.log("    - Fully supported");
console.log("    - Unused exports removed by bundlers");

console.log("\n9. CIRCULAR DEPENDENCIES:");
console.log("  CommonJS:");
console.log("    - Returns partial exports");
console.log("    - Can cause undefined values");
console.log("  ES Modules:");
console.log("    - Better handling with live bindings");
console.log("    - Still should be avoided");

console.log("\n10. BROWSER SUPPORT:");
console.log("  CommonJS:");
console.log("    - Not natively supported");
console.log("    - Requires bundler (Webpack, Browserify)");
console.log("  ES Modules:");
console.log("    - Native browser support");
console.log("    - <script type=\"module\" src=\"app.js\"></script>");

// ============================================
// 9.4 Interoperability
// ============================================

console.log("\n--- Interoperability ---\n");

console.log("Using CommonJS in ES Modules:");
console.log(`
// Import CommonJS module in ESM
import cjsModule from './commonjs-module.cjs';
// Default import gets module.exports

// Named imports from CommonJS (Node.js only)
import { named } from './commonjs-module.cjs';
// Works if module.exports = { named }
`);

console.log("\nUsing ES Modules in CommonJS:");
console.log(`
// Dynamic import in CommonJS
async function loadESM() {
  const esmModule = await import('./esm-module.mjs');
  console.log(esmModule.default);
  console.log(esmModule.named);
}

// ❌ Cannot use static import in CommonJS
// import { named } from './esm-module.mjs'; // SyntaxError
`);

console.log("\nNode.js Package.json Configuration:");
console.log(`
// Use ES Modules by default
{
  "type": "module",
  "main": "index.js"
}

// Use CommonJS by default (default behavior)
{
  "type": "commonjs",
  "main": "index.js"
}

// Dual package (both ESM and CJS)
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "exports": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
`);

// ============================================
// 9.5 Module Resolution
// ============================================

console.log("\n--- Module Resolution ---\n");

console.log("Node.js Module Resolution Algorithm:");
console.log(`
1. Core modules (fs, path, http)
   - Highest priority
   - Built into Node.js

2. File modules (./file, ../file, /absolute/path)
   - Relative or absolute paths
   - Tries: .js, .json, .node extensions

3. Folder modules (./folder)
   - Looks for package.json "main" field
   - Falls back to index.js

4. node_modules
   - Searches up directory tree
   - node_modules/package-name
   - Continues to parent directories
`);

console.log("ES Module Resolution:");
console.log(`
1. Must include file extension
   - import './module.js' ✅
   - import './module' ❌ (works in bundlers, not native)

2. Supports package.json "exports" field
   {
     "exports": {
       ".": "./index.js",
       "./feature": "./src/feature.js"
     }
   }

3. Import maps (browser)
   <script type="importmap">
   {
     "imports": {
       "lodash": "/node_modules/lodash-es/lodash.js",
       "react": "https://cdn.skypack.dev/react"
     }
   }
   </script>
`);

// ============================================
// 9.6 Import Maps (Browser)
// ============================================

console.log("\n--- Import Maps ---\n");

console.log("Import Maps enable bare module specifiers in browsers:");
console.log(`
<!-- Define import map -->
<script type="importmap">
{
  "imports": {
    "lodash": "/node_modules/lodash-es/lodash.js",
    "lodash/": "/node_modules/lodash-es/",
    "react": "https://cdn.skypack.dev/react@18",
    "react-dom": "https://cdn.skypack.dev/react-dom@18",
    "@/": "/src/"
  }
}
</script>

<!-- Use bare specifiers -->
<script type="module">
  import _ from 'lodash';
  import { debounce } from 'lodash/debounce.js';
  import React from 'react';
  import { createRoot } from 'react-dom';
  import { utils } from '@/utils.js';
  
  console.log(_.VERSION);
</script>
`);

console.log("Import Maps Features:");
console.log("  - Map bare specifiers to URLs");
console.log("  - Support for scoped packages");
console.log("  - Trailing slash for directory mapping");
console.log("  - CDN integration");
console.log("  - Local path aliases");

console.log("\nImport Maps Browser Support:");
console.log("  - Chrome/Edge: 89+");
console.log("  - Safari: 16.4+");
console.log("  - Firefox: 108+");
console.log("  - Polyfill available: es-module-shims");

console.log("\nImport Maps Use Cases:");
console.log("  - Development without bundler");
console.log("  - CDN-based dependencies");
console.log("  - Path aliases (@/, ~/");
console.log("  - Version management");
console.log("  - Micro-frontend architecture");

// ============================================
// 9.7 Migration Guide
// ============================================

console.log("\n--- Migration: CommonJS to ES Modules ---\n");

console.log("Step-by-step migration:");
console.log(`
1. Update package.json
   {
     "type": "module"
   }

2. Rename files (optional)
   - .js → .mjs (if not using "type": "module")
   - Keep .cjs for CommonJS files

3. Convert require to import
   // Before (CommonJS)
   const fs = require('fs');
   const { readFile } = require('fs');
   const express = require('express');
   
   // After (ES Modules)
   import fs from 'fs';
   import { readFile } from 'fs';
   import express from 'express';

4. Convert module.exports to export
   // Before (CommonJS)
   module.exports = function add(a, b) {
     return a + b;
   };
   
   // After (ES Modules)
   export default function add(a, b) {
     return a + b;
   }
   
   // Before (CommonJS)
   module.exports = { add, subtract };
   
   // After (ES Modules)
   export { add, subtract };

5. Update __dirname and __filename
   // Before (CommonJS)
   console.log(__dirname);
   console.log(__filename);
   
   // After (ES Modules)
   import { fileURLToPath } from 'url';
   import { dirname } from 'path';
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

6. Add file extensions to imports
   // Before (CommonJS)
   const utils = require('./utils');
   
   // After (ES Modules)
   import utils from './utils.js';

7. Convert dynamic requires
   // Before (CommonJS)
   const module = require(dynamicPath);
   
   // After (ES Modules)
   const module = await import(dynamicPath);
`);

console.log("\nCommon Migration Pitfalls:");
console.log("  ⚠️ Forgetting file extensions");
console.log("  ⚠️ Using require() in ESM");
console.log("  ⚠️ Missing __dirname/__filename replacements");
console.log("  ⚠️ Circular dependencies breaking");
console.log("  ⚠️ JSON imports (use import attributes: with { type: 'json' })");

console.log("\nBest Practices:");
console.log("  ✅ Use ES Modules for new projects");
console.log("  ✅ Migrate gradually (dual packages)");
console.log("  ✅ Test thoroughly after migration");
console.log("  ✅ Update tooling (ESLint, Jest, etc.)");
console.log("  ✅ Document breaking changes\n");

// ============================================
// 10. MODULE LOADING AND CACHING
// ============================================

/**
 * Module Loading - How modules are loaded and cached
 * 
 * Characteristics:
 * - Modules are loaded only once
 * - Subsequent imports use cached version
 * - Module code executes only once
 * - All imports share same instance
 * 
 * Use Cases:
 * - Singleton pattern
 * - Shared state across imports
 * - Performance optimization
 */

console.log("=== Module Loading and Caching ===\n");

// Module singleton pattern
let instanceCounter = 0;

export class Singleton {
  constructor() {
    instanceCounter++;
    this.id = instanceCounter;
    console.log(`  Singleton instance ${this.id} created`);
  }
  
  getId() {
    return this.id;
  }
}

// This code runs only once, even if imported multiple times
console.log("Module initialization code runs once");
console.log("All imports share the same module instance\n");

// Example: If this module is imported in multiple files,
// the Singleton class is defined only once
// All imports reference the same class definition

console.log("Module caching behavior:");
console.log("  - Module code executes once on first import");
console.log("  - Subsequent imports use cached version");
console.log("  - All imports share same module scope");
console.log("  - Perfect for singleton pattern\n");

// ============================================
// 11. CIRCULAR DEPENDENCIES
// ============================================

/**
 * Circular Dependencies - Modules that import each other
 * 
 * Characteristics:
 * - Module A imports Module B
 * - Module B imports Module A
 * - Can cause issues if not careful
 * - ES Modules handle better than CommonJS
 * 
 * Common Pitfalls:
 * - Undefined values during initialization
 * - Hard to debug
 * - Sign of poor architecture
 * 
 * Solutions:
 * - Refactor to remove circular dependency
 * - Extract shared code to third module
 * - Use dependency injection
 */

console.log("=== Circular Dependencies ===\n");

console.log("Circular dependency example:");
console.log("  // a.js");
console.log("  import { b } from './b.js';");
console.log("  export const a = 'A';");
console.log("");
console.log("  // b.js");
console.log("  import { a } from './a.js';");
console.log("  export const b = 'B';");

console.log("\nProblems:");
console.log("  - Values may be undefined during initialization");
console.log("  - Execution order is complex");
console.log("  - Hard to reason about code flow");

console.log("\nSolutions:");
console.log("  1. Refactor: Extract shared code to third module");
console.log("  2. Dependency injection: Pass dependencies as parameters");
console.log("  3. Lazy loading: Use dynamic imports");
console.log("  4. Redesign: Rethink module structure\n");

// ============================================
// 12. IMPORT HOISTING
// ============================================

/**
 * Import Hoisting - Imports are moved to top
 * 
 * Characteristics:
 * - Import statements are hoisted
 * - Executed before any other code
 * - Can't be conditional
 * - Static analysis benefit
 * 
 * Common Pitfalls:
 * - Thinking imports execute in order
 * - Trying to use imports conditionally
 */

console.log("=== Import Hoisting ===\n");

// This works even though import is after usage (in source order)
// because imports are hoisted
// console.log(add(1, 2));
// import { add } from './math.js';

console.log("Import hoisting behavior:");
console.log("  - All imports are hoisted to top");
console.log("  - Executed before module code");
console.log("  - Can't use imports conditionally");
console.log("  - Use dynamic import() for conditional loading\n");

// ❌ This doesn't work (syntax error)
// if (condition) {
//   import { feature } from './feature.js';
// }

// ✅ Use dynamic import instead
// if (condition) {
//   const { feature } = await import('./feature.js');
// }

console.log("For conditional imports:");
console.log("  Use dynamic import() instead of static import\n");

// ============================================
// 13. PRACTICAL MULTI-FILE PROJECT STRUCTURE
// ============================================

/**
 * Project Structure - Organizing modules in a real project
 * 
 * Best Practices:
 * - One module per file
 * - Clear naming conventions
 * - Barrel files for public APIs
 * - Separate concerns
 * - Keep modules focused
 */

console.log("=== Practical Project Structure ===\n");

console.log("Example project structure:");
console.log(`
src/
├── index.js              # Entry point
├── config/
│   ├── index.js          # Barrel file
│   ├── database.js       # Database config
│   └── api.js            # API config
├── models/
│   ├── index.js          # Barrel file
│   ├── User.js           # User model
│   ├── Product.js        # Product model
│   └── Order.js          # Order model
├── services/
│   ├── index.js          # Barrel file
│   ├── userService.js    # User business logic
│   ├── productService.js # Product business logic
│   └── orderService.js   # Order business logic
├── utils/
│   ├── index.js          # Barrel file
│   ├── validation.js     # Validation utilities
│   ├── formatting.js     # Formatting utilities
│   └── helpers.js        # General helpers
└── constants/
    ├── index.js          # Barrel file
    ├── errors.js         # Error constants
    └── status.js         # Status constants
`);

console.log("Barrel file pattern (models/index.js):");
console.log("  export * from './User.js';");
console.log("  export * from './Product.js';");
console.log("  export * from './Order.js';");

console.log("\nUsage:");
console.log("  import { User, Product, Order } from './models';");
console.log("  // Instead of separate imports\n");

console.log("Benefits:");
console.log("  - Clean import statements");
console.log("  - Easy to refactor internal structure");
console.log("  - Clear public API");
console.log("  - Better encapsulation\n");

// ============================================
// 14. COMMON PITFALLS & BEST PRACTICES
// ============================================

console.log("=== Common Pitfalls ===\n");

// Pitfall 1: Default vs Named Export Confusion
console.log("Pitfall 1: Default vs Named Export Confusion");
console.log("  ❌ import User from './user.js'; // If User is named export");
console.log("  ✅ import { User } from './user.js';");
console.log("  ❌ import { User } from './user.js'; // If User is default");
console.log("  ✅ import User from './user.js';\n");

// Pitfall 2: Forgetting File Extensions
console.log("Pitfall 2: File Extensions");
console.log("  ❌ import { fn } from './module'; // May not work");
console.log("  ✅ import { fn } from './module.js'; // Explicit extension\n");

// Pitfall 3: Modifying Imports
console.log("Pitfall 3: Imports are Read-Only");
console.log("  import { value } from './module.js';");
console.log("  ❌ value = 42; // Error: Assignment to constant");
console.log("  ✅ Use a function to modify module state\n");

// Pitfall 4: Circular Dependencies
console.log("Pitfall 4: Circular Dependencies");
console.log("  ❌ Module A imports B, B imports A");
console.log("  ✅ Extract shared code to module C");
console.log("  ✅ Use dependency injection");
console.log("  ✅ Use dynamic imports\n");

// Pitfall 5: Side Effects in Modules
console.log("Pitfall 5: Side Effects in Modules");
console.log("  ❌ console.log('Module loaded'); // Runs on import");
console.log("  ✅ Export initialization function instead");
console.log("  ✅ Keep modules pure when possible\n");

// Pitfall 6: Default Export Syntax
console.log("Pitfall 6: Default Export Syntax");
console.log("  ❌ export default const value = 42; // Syntax error");
console.log("  ✅ const value = 42; export default value;");
console.log("  ✅ export default 42;\n");

console.log("=== Best Practices ===\n");

console.log("1. PREFER named exports over default exports");
console.log("   - More explicit");
console.log("   - Better refactoring support");
console.log("   - Easier to find usage");

console.log("\n2. USE barrel files for public APIs");
console.log("   - Simplifies imports");
console.log("   - Hides internal structure");
console.log("   - Clear public interface");

console.log("\n3. KEEP modules focused and small");
console.log("   - Single responsibility");
console.log("   - Easier to test");
console.log("   - Better reusability");

console.log("\n4. AVOID circular dependencies");
console.log("   - Extract shared code");
console.log("   - Use dependency injection");
console.log("   - Rethink architecture");

console.log("\n5. USE dynamic imports for code splitting");
console.log("   - Smaller initial bundle");
console.log("   - Faster page load");
console.log("   - Load on demand");

console.log("\n6. ALWAYS include file extensions");
console.log("   - Works in all environments");
console.log("   - Explicit and clear");
console.log("   - Avoids ambiguity");

console.log("\n7. ORGANIZE by feature, not by type");
console.log("   - features/user/ instead of models/, services/");
console.log("   - Better cohesion");
console.log("   - Easier to understand");

console.log("\n8. DOCUMENT module dependencies");
console.log("   - Clear import statements");
console.log("   - JSDoc comments");
console.log("   - README files\n");

// ============================================
// 15. MODULE PATTERNS AND USE CASES
// ============================================

console.log("=== Module Patterns ===\n");

// Pattern 1: Singleton Pattern
console.log("Pattern 1: Singleton Pattern");
console.log("  // config.js");
console.log("  const config = { apiUrl: 'https://api.example.com' };");
console.log("  export default config;");
console.log("  // All imports share same config object\n");

// Pattern 2: Factory Pattern
console.log("Pattern 2: Factory Pattern");
console.log("  // userFactory.js");
console.log("  export function createUser(name, email) {");
console.log("    return { name, email, createdAt: Date.now() };");
console.log("  }\n");

// Pattern 3: Namespace Pattern
console.log("Pattern 3: Namespace Pattern");
console.log("  // utils.js");
console.log("  export const StringUtils = {");
console.log("    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),");
console.log("    truncate: (str, len) => str.slice(0, len)");
console.log("  };\n");

// Pattern 4: Plugin Pattern
console.log("Pattern 4: Plugin Pattern");
console.log("  // app.js");
console.log("  const plugins = [];");
console.log("  export function registerPlugin(plugin) {");
console.log("    plugins.push(plugin);");
console.log("  }\n");

// Pattern 5: Facade Pattern
console.log("Pattern 5: Facade Pattern");
console.log("  // api/index.js (barrel file)");
console.log("  export * from './users.js';");
console.log("  export * from './products.js';");
console.log("  // Simple interface to complex subsystem\n");

// ============================================
// 16. PERFORMANCE CONSIDERATIONS
// ============================================

console.log("=== Performance Considerations ===\n");

console.log("1. Code Splitting:");
console.log("   - Use dynamic imports for large features");
console.log("   - Load routes on demand");
console.log("   - Reduce initial bundle size");

console.log("\n2. Tree Shaking:");
console.log("   - Use named exports (not default)");
console.log("   - Avoid side effects in modules");
console.log("   - Let bundlers remove unused code");

console.log("\n3. Module Caching:");
console.log("   - Modules are cached after first load");
console.log("   - Subsequent imports are instant");
console.log("   - Share state across imports");

console.log("\n4. Lazy Loading:");
console.log("   - Load modules when needed");
console.log("   - Improve initial page load");
console.log("   - Better user experience");

console.log("\n5. Bundle Size:");
console.log("   - Keep modules small and focused");
console.log("   - Avoid importing entire libraries");
console.log("   - Use import { specific } from 'library'\n");

// ============================================
// 17. DEBUGGING MODULES
// ============================================

console.log("=== Debugging Modules ===\n");

console.log("Common Issues:");
console.log("  1. Module not found");
console.log("     - Check file path and extension");
console.log("     - Verify file exists");
console.log("     - Check case sensitivity");

console.log("\n  2. Undefined imports");
console.log("     - Check export name matches import");
console.log("     - Verify export exists");
console.log("     - Check for circular dependencies");

console.log("\n  3. Syntax errors");
console.log("     - Can't use import in non-module scripts");
console.log("     - Add type='module' to script tag");
console.log("     - Or use .mjs extension in Node.js");

console.log("\n  4. CORS errors (browser)");
console.log("     - Modules must be served over HTTP(S)");
console.log("     - Can't load from file:// protocol");
console.log("     - Use local development server");

console.log("\nDebugging Tips:");
console.log("  - Use browser DevTools Network tab");
console.log("  - Check console for module errors");
console.log("  - Use console.log in module scope");
console.log("  - Verify module execution order\n");

// ============================================
// 18. IMPORT ATTRIBUTES (ES2025)
// ============================================

/**
 * Import Attributes - Provide metadata about how a module should be imported
 *
 * ES Specification: ES2025
 *
 * Characteristics:
 * - Syntax: import data from "./file.json" with { type: "json" };
 * - The `with` keyword passes import attributes to the loader
 * - JSON Modules require the { type: "json" } attribute
 * - Renamed from "Import Assertions" (assert) to "Import Attributes" (with):
 *     assertions were enforce-only and a failed assertion threw; attributes
 *     are advisory metadata that loaders/bundlers can act on
 *
 * Use Cases:
 * - Importing JSON modules (requires type: "json")
 * - Importing CSS/WebAssembly/other non-JS module types in bundlers
 *
 * Common Pitfalls:
 * - Using the old `assert` keyword (deprecated/removed in favor of `with`)
 * - Forgetting the attribute when importing .json (throws in strict loaders)
 */

console.log("=== Import Attributes (ES2025) ===\n");

/*
 * verification:
 *   feature: Import Attributes
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-07-12
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// Import Attributes use the `with` keyword (ES2025), formerly `assert`.
// JSON Modules require the { type: "json" } attribute:
//
//   import data from "./data.json" with { type: "json" };
//   console.log(data); // parsed JSON object
//
// Old (deprecated) Import Assertions syntax — do NOT use:
//
//   import data from "./data.json" assert { type: "json" }; // ❌ removed

console.log("Import Attributes syntax:");
console.log("  import data from './data.json' with { type: 'json' };");
console.log("  - `with` provides import metadata to the module loader");
console.log("  - renamed from Import Assertions (`assert`) to Import Attributes (`with`)");
console.log("  - JSON modules require the { type: 'json' } attribute\n");

console.log("Dynamic import with attributes (ES2025):");
console.log("  const mod = await import('./data.json', { with: { type: 'json' } });");
console.log("  // Second argument carries the import attributes\n");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE IMPORTS/EXPORTS
   JS:  import { User } from './user.js';
   TS:  import { User } from './user';
        import type { User } from './user'; // Type-only import

   Benefits:
   - Type-only imports are erased at runtime
   - Better tree-shaking
   - Explicit type vs value imports

2. MODULE TYPES
   JS:  // No type information
   TS:  export interface User {
          name: string;
          email: string;
        }

   Benefits:
   - Type safety across modules
   - Better IDE support
   - Compile-time error checking

3. NAMESPACE IMPORTS WITH TYPES
   JS:  import * as Utils from './utils.js';
   TS:  import * as Utils from './utils';
        const result: number = Utils.add(1, 2);

   Benefits:
   - Type-safe namespace access
   - Better autocomplete
   - Prevents type errors

4. DEFAULT EXPORT TYPES
   JS:  export default class User { }
   TS:  export default class User {
          constructor(public name: string) {}
        }

   Benefits:
   - Type-safe default exports
   - Better refactoring support
   - Clear type information

5. RE-EXPORT WITH TYPES
   JS:  export * from './module.js';
   TS:  export * from './module';
        export { type User, type Product } from './models';

   Benefits:
   - Separate type and value exports
   - Better tree-shaking
   - Clearer intent

6. DYNAMIC IMPORT TYPES
   JS:  const module = await import('./module.js');
   TS:  const module = await import('./module');

   Benefits:
   - Type-safe dynamic imports
   - Better IDE support
   - Compile-time checking

⚠️ COMMON CONFUSION POINTS:

1. FILE EXTENSIONS
   - JS: Must include .js extension
   - TS: Omit extension (TypeScript resolves it)

   import { fn } from './module.js'; // ✅ JS
   import { fn } from './module';    // ✅ TS

2. TYPE-ONLY IMPORTS
   - Use 'import type' for types only
   - Prevents runtime imports of types

   import type { User } from './types'; // ✅ Type only
   import { User } from './types';      // ❌ Runtime import

3. THIS BINDING IN MODULES
   - ES Modules: top-level 'this' is undefined
   - CommonJS: 'this' refers to module.exports

4. CIRCULAR DEPENDENCIES
   - Can cause undefined values during initialization
   - Extract shared code or use dynamic imports

📘 See 32-modules-ts-comparison.ts for detailed examples!
*/

