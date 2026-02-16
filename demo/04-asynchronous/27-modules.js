// Modules Demo
// 📘 For TypeScript comparison, see: 15-modules-ts-comparison.ts

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
// 9. ES MODULES VS COMMONJS
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

console.log("=== ES Modules vs CommonJS ===\n");

console.log("ES Modules (ESM):");
console.log("  Syntax: import/export");
console.log("  Loading: Asynchronous");
console.log("  Analysis: Static (compile-time)");
console.log("  Tree-shaking: Yes");
console.log("  Top-level await: Yes (ES2022)");
console.log("  File extension: .mjs or .js with type: module");
console.log("  Example:");
console.log("    import { fn } from './module.js';");
console.log("    export const value = 42;");

console.log("\nCommonJS (CJS):");
console.log("  Syntax: require/module.exports");
console.log("  Loading: Synchronous");
console.log("  Analysis: Dynamic (runtime)");
console.log("  Tree-shaking: No");
console.log("  Top-level await: No");
console.log("  File extension: .cjs or .js (default in Node.js)");
console.log("  Example:");
console.log("    const { fn } = require('./module.js');");
console.log("    module.exports = { value: 42 };");

console.log("\nKey Differences:");
console.log("  1. ESM imports are hoisted, CJS requires are not");
console.log("  2. ESM imports are read-only, CJS exports can be modified");
console.log("  3. ESM supports top-level await, CJS doesn't");
console.log("  4. ESM enables tree-shaking, CJS doesn't");
console.log("  5. ESM is the future standard, CJS is legacy\n");

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
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE IMPORTS/EXPORTS
   JS:  import { User } from './user.js';
   TS:  import { User } from './user'; // No .js extension
        import type { User } from './user'; // Type-only import
   
   Benefits:
   - Type-only imports are erased at runtime
   - Better tree-shaking
   - Explicit type vs value imports

2. MODULE TYPES
   JS:  // No type information
   TS:  // user.ts
        export interface User {
          name: string;
          email: string;
        }
        export class UserService {
          getUser(id: number): User { ... }
        }
   
   Benefits:
   - Type safety across modules
   - Better IDE support
   - Compile-time error checking

3. NAMESPACE IMPORTS WITH TYPES
   JS:  import * as Utils from './utils.js';
   TS:  import * as Utils from './utils';
        // Utils is typed namespace
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
        // Or:
        export type { User as default };
   
   Benefits:
   - Type-safe default exports
   - Better refactoring support
   - Clear type information

5. RE-EXPORT WITH TYPES
   JS:  export * from './module.js';
   TS:  export * from './module';
        export type * from './types';
        export { type User, type Product } from './models';
   
   Benefits:
   - Separate type and value exports
   - Better tree-shaking
   - Clearer intent

6. DYNAMIC IMPORT TYPES
   JS:  const module = await import('./module.js');
   TS:  const module = await import('./module');
        // module is typed automatically
        type ModuleType = typeof import('./module');
   
   Benefits:
   - Type-safe dynamic imports
   - Better IDE support
   - Compile-time checking

⚠️ COMMON CONFUSION POINTS:

1. FILE EXTENSIONS
   - JS: Must include .js extension
   - TS: Omit extension (TypeScript resolves it)
   
   // TypeScript
   import { fn } from './module'; // ✅
   import { fn } from './module.ts'; // ❌

2. TYPE-ONLY IMPORTS
   - Use 'import type' for types only
   - Prevents runtime imports of types
   - Better for tree-shaking
   
   import type { User } from './types'; // ✅ Type only
   import { User } from './types'; // ❌ Runtime import

3. NAMESPACE VS MODULE
   - ES Modules: import/export
   - TS Namespaces: namespace keyword (legacy)
   
   // ✅ Use ES Modules
   export const Utils = { ... };
   
   // ❌ Avoid TS namespaces
   namespace Utils { ... }

4. DECLARATION FILES
   - .d.ts files for type declarations
   - Separate types from implementation
   - Better for libraries
   
   // user.d.ts
   export interface User {
     name: string;
   }

5. MODULE RESOLUTION
   - TypeScript has multiple resolution strategies
   - Configure in tsconfig.json
   - Affects how imports are resolved
   
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "baseUrl": "./src",
       "paths": {
         "@/*": ["*"]
       }
     }
   }

6. IMPORT ASSERTIONS
   - Import JSON with type assertion
   - TypeScript supports import assertions
   
   import data from './data.json' assert { type: 'json' };

📘 See 15-modules-ts-comparison.ts for detailed examples!
*/

console.log("\n=== Module Demo Complete ===");
console.log("Covered: imports, exports, dynamic imports, module scope,");
console.log("ES Modules vs CommonJS, circular dependencies, and best practices\n");
