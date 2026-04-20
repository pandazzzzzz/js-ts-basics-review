// TypeScript vs JavaScript: Modules Comparison
// 📘 For JavaScript examples, see: 32-modules.js
// This file demonstrates TypeScript-specific typing for modules

// ============================================================================
// 1. TYPE-ONLY IMPORTS AND EXPORTS
// ============================================================================

// TypeScript: import type for type-only imports (avoids runtime import)
import type { Calculator } from "./27-modules";

// Regular import (includes runtime value)
// import { Calculator } from "./27-modules";

// Combined: type-only and value imports
// import Calculator, { type CalculatorOptions } from "./module";

// Type-only export
export type { Calculator };

// Value export
export const moduleInfo = "TypeScript module demo";

console.log("=== Type-Only Imports ===");
console.log("Type-only imports are removed at compile time");
console.log("No runtime overhead for type imports\n");

// ============================================================================
// 2. TYPED NAMED EXPORTS
// ============================================================================

// TypeScript: Explicit type annotations for exports
export const PI: number = 3.14159;
export const E: number = 2.71828;

// Function with typed parameters and return
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

// Generic function export
export function identity<T>(value: T): T {
  return value;
}

// Typed class export
export class TypedCalculator {
  private result: number = 0;

  add(n: number): this {
    this.result += n;
    return this;
  }

  subtract(n: number): this {
    this.result -= n;
    return this;
  }

  getResult(): number {
    return this.result;
  }
}

console.log("=== Typed Named Exports ===");
console.log("PI:", PI);
console.log("add(5, 3):", add(5, 3));
console.log("identity<string>('hello'):", identity("hello"));

const calc = new TypedCalculator();
console.log("Calculator:", calc.add(10).subtract(3).getResult());

// ============================================================================
// 3. EXPORT TYPE ALIASES AND INTERFACES
// ============================================================================

// Export type aliases
export type MathOperation = (a: number, b: number) => number;

export interface MathConstants {
  PI: number;
  E: number;
  GoldenRatio: number;
}

// Export const with interface type
export const mathConstants: MathConstants = {
  PI: 3.14159,
  E: 2.71828,
  GoldenRatio: 1.61803
};

// Export mapped type
export type ReadonlyMathConstants = Readonly<MathConstants>;

console.log("\n=== Export Type Aliases and Interfaces ===");
console.log("Math constants:", mathConstants);

const readonlyConstants: ReadonlyMathConstants = mathConstants;
// readonlyConstants.PI = 3; // ❌ Error - readonly property

// ============================================================================
// 4. DEFAULT EXPORT WITH TYPES
// ============================================================================

// Default export with explicit type
const defaultExport: {
  name: string;
  version: string;
  calculate: (a: number, b: number) => number;
} = {
  name: "MathLib",
  version: "1.0.0",
  calculate: add
};

export default defaultExport;

// Alternative: Export inline
// export default {
//   name: "MathLib",
//   version: "1.0.0"
// };

console.log("\n=== Default Export with Types ===");
console.log("Default export:", defaultExport.name, defaultExport.version);

// ============================================================================
// 5. NAMESPACE EXPORTS (export *)
// ============================================================================

// Re-export all from another module
// export * from "./other-module";

// Re-export with rename
// export { oldName as newName } from "./other-module";

// Re-export only types
// export type { TypeName } from "./other-module";

// Create a namespace-like export object
export const MathUtils = {
  add,
  subtract,
  PI,
  E,
  constants: mathConstants
};

console.log("\n=== Namespace Exports ===");
console.log("MathUtils.add(10, 5):", MathUtils.add(10, 5));
console.log("MathUtils.PI:", MathUtils.PI);

// ============================================================================
// 6. MODULE AUGMENTATION
// ============================================================================

// TypeScript: Module augmentation for extending existing modules
// Note: Module augmentation requires the target module to have TypeScript types
// For JS files without type declarations, augmentation won't work

// Global module augmentation (this works)
declare global {
  interface Array<T> {
    // This would add methods to Array prototype (use carefully!)
    // customMethod(): void;
  }
}

console.log("\n=== Module Augmentation ===");
console.log("Module augmentation requires target module to have TypeScript types");

// ============================================================================
// 7. DECLARATION FILES (.d.ts)
// ============================================================================

// TypeScript: Declaration file pattern
// In a real .d.ts file:
/*
export interface Config {
  apiUrl: string;
  timeout: number;
}

export function createConfig(config: Config): Config;

export type ConfigOption = "apiUrl" | "timeout" | "retries";
*/

// Inline declaration equivalent
interface LocalConfig {
  apiUrl: string;
  timeout: number;
  retries?: number;
}

export function createConfig(config: LocalConfig): LocalConfig {
  return {
    ...config,
    retries: config.retries ?? 3
  };
}

export type ConfigOption = keyof LocalConfig;

console.log("\n=== Declaration Files ===");
const config = createConfig({ apiUrl: "https://api.example.com", timeout: 5000 });
console.log("Created config:", config);

const option: ConfigOption = "apiUrl";
console.log("Config option:", option);

// ============================================================================
// 8. DYNAMIC IMPORTS WITH TYPES
// ============================================================================

// TypeScript: Typed dynamic imports
async function loadModule(): Promise<void> {
  console.log("\n=== Dynamic Imports ===");

  // Dynamic import with type assertion
  const module = await import("./32-modules.js") as {
    default?: unknown;
    [key: string]: unknown;
  };

  console.log("Dynamic import keys:", Object.keys(module));

  // Type-safe access
  if ("Calculator" in module) {
    console.log("Calculator exported");
  }
}

// loadModule();

// ============================================================================
// 9. GENERIC MODULE PATTERNS
// ============================================================================

// Generic module interface
export interface Repository<T, ID = number> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

// Generic module factory
export function createRepository<T, ID = number>(
  entities: Map<ID, T>
): Repository<T, ID> {
  return {
    async findById(id: ID): Promise<T | null> {
      return entities.get(id) ?? null;
    },
    async findAll(): Promise<T[]> {
      return Array.from(entities.values());
    },
    async save(entity: T): Promise<T> {
      // Simplified - assumes entity has 'id' property
      const id = (entity as unknown as { id: ID }).id;
      entities.set(id, entity);
      return entity;
    },
    async delete(id: ID): Promise<boolean> {
      return entities.delete(id);
    }
  };
}

console.log("\n=== Generic Module Patterns ===");

interface User {
  id: number;
  name: string;
}

const userMap = new Map<number, User>([
  [1, { id: 1, name: "Alice" }],
  [2, { id: 2, name: "Bob" }]
]);

const userRepository = createRepository<User>(userMap);
userRepository.findAll().then(users => {
  console.log("Users:", users.map(u => u.name));
});

// ============================================================================
// 10. CONST ASSERTIONS FOR MODULE CONSTANTS
// ============================================================================

// TypeScript: 'as const' for literal type inference
export const API_ENDPOINTS = {
  users: "/api/users",
  posts: "/api/posts",
  comments: "/api/comments"
} as const;

// Type is now:
// {
//   readonly users: "/api/users";
//   readonly users: "/api/posts";
//   readonly comments: "/api/comments";
// }

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const;

// Inferred type preserves literal values
type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
// Type is: 200 | 201 | 404 | 500

console.log("\n=== Const Assertions ===");
console.log("API Endpoints:", API_ENDPOINTS);
console.log("HTTP Status OK:", HTTP_STATUS.OK);

const status: HttpStatus = 200;
console.log("Status type check:", status);

// ============================================================================
// 11. SATISFIES OPERATOR (TypeScript 4.9+)
// ============================================================================

// TypeScript: 'satisfies' keyword for type checking without widening
interface RouteConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: string;
}

// Using satisfies - type checks but preserves literal types
export const routes = {
  getUsers: {
    path: "/users",
    method: "GET" as const,
    handler: "getUsers"
  },
  createUser: {
    path: "/users",
    method: "POST" as const,
    handler: "createUser"
  }
} satisfies Record<string, RouteConfig>;

// Type is preserved with literal values
// routes.getUsers.method is "GET" (not just string)

console.log("\n=== Satisfies Operator ===");
console.log("Route method:", routes.getUsers.method); // Type: "GET"

// ============================================================================
// 12. EXPORT EQUALS (CommonJS compatibility)
// ============================================================================

// TypeScript: export = for CommonJS default export
// In a .ts file using CommonJS:
// export = { name: "MyModule", version: "1.0.0" };

// Import with: import mod = require("./module");

// Modern ES modules prefer:
export const esModuleExport = {
  name: "ESModule",
  version: "1.0.0"
};

console.log("\n=== Export Equals ===");
console.log("ES module export:", esModuleExport);

// ============================================================================
// 13. CIRCULAR DEPENDENCY TYPES
// ============================================================================

// TypeScript: Forward declarations for circular dependencies
// Use interface or type to break circular reference

interface NodeLike {
  next: NodeLike | null;
  value: unknown;
}

class ListNode implements NodeLike {
  next: NodeLike | null = null;
  value: unknown;

  constructor(value: unknown) {
    this.value = value;
  }
}

export { ListNode, type NodeLike };

console.log("\n=== Circular Dependency Types ===");
const node1 = new ListNode(1);
const node2 = new ListNode(2);
node1.next = node2;
console.log("Linked list node:", node1.value, "->", node1.next?.value);

// ============================================================================
// 14. COMMONJS VS ES MODULES IN TYPESCRIPT
// ============================================================================

console.log("\n=== CommonJS vs ES Modules in TypeScript ===");

// TypeScript supports both module systems
// Configure in tsconfig.json:
/*
{
  "compilerOptions": {
    "module": "commonjs",  // or "es2015", "es2020", "esnext"
    "moduleResolution": "node",
    "esModuleInterop": true,  // Better CommonJS interop
    "allowSyntheticDefaultImports": true
  }
}
*/

// CommonJS in TypeScript (when module: "commonjs")
// export = { value: 42 };
// import mod = require("./module");

// ES Modules in TypeScript (when module: "es2015"+)
// export const value = 42;
// import { value } from "./module";

console.log("TypeScript module system configuration:");
console.log("  - Set 'module' in tsconfig.json");
console.log("  - Use esModuleInterop for better CommonJS compatibility");
console.log("  - Prefer ES modules for new projects");

// Interoperability
interface CommonJSModule {
  default?: unknown;
  [key: string]: unknown;
}

// Import CommonJS module in TypeScript
// const cjsModule: CommonJSModule = require("./cjs-module");

// Import ES module in TypeScript
// import { named } from "./es-module";

console.log("\nTypeScript handles both module systems:");
console.log("  - Compile-time type checking");
console.log("  - Runtime compatibility");
console.log("  - esModuleInterop for seamless interop");

// ============================================================================
// 15. IMPORT MAPS IN TYPESCRIPT
// ============================================================================

console.log("\n=== Import Maps in TypeScript ===");

// TypeScript doesn't directly support import maps
// But you can configure path mapping in tsconfig.json:
/*
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"],
      "lodash": ["../node_modules/lodash-es/lodash.js"]
    }
  }
}
*/

// Usage with path mapping:
// import { Button } from "@components/Button";
// import { formatDate } from "@utils/date";
// import _ from "lodash";

console.log("TypeScript path mapping (tsconfig.json):");
console.log("  - baseUrl: Base directory for resolution");
console.log("  - paths: Map module names to locations");
console.log("  - Similar to import maps but compile-time");

// For browser import maps, TypeScript compiles normally
// Import maps are resolved at runtime by the browser

console.log("\nBrowser import maps with TypeScript:");
console.log("  1. Write TypeScript with bare specifiers");
console.log("  2. Compile to JavaScript");
console.log("  3. Use import maps in HTML for runtime resolution");

// Example workflow:
/*
// TypeScript source
import React from 'react';
import { debounce } from 'lodash';

// Compiles to JavaScript
import React from 'react';
import { debounce } from 'lodash';

// Browser resolves with import map
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.skypack.dev/react",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
*/

console.log("\nTypeScript + Import Maps workflow:");
console.log("  - TypeScript: Type checking and compilation");
console.log("  - Import Maps: Runtime module resolution");
console.log("  - Best of both worlds: types + flexible loading");

// ============================================================================
// 16. BARREL EXPORTS (index.ts pattern)
// ============================================================================

// TypeScript: Barrel files for clean public API
// In index.ts:
/*
export * from "./calculator";
export * from "./constants";
export { default as DefaultExport } from "./default";

// Re-export with rename
export { oldName as newName } from "./module";
*/

// Consolidated export object
export const MathLibrary = {
  constants: mathConstants,
  operations: {
    add,
    subtract
  },
  types: {
    Calculator: TypedCalculator,
    Repository: createRepository
  }
};

console.log("\n=== Barrel Exports ===");
console.log("MathLibrary exported with consolidated API");

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Modules ===\n");
console.log(`
1. USE 'import type' for type-only imports
   - Avoids runtime overhead
   - Clear intent in code

2. EXPORT TYPES EXPLICITLY
   - export type { TypeName }
   - export interface InterfaceName

3. USE 'as const' FOR LITERAL CONSTANTS
   - Preserves literal types
   - Better type inference

4. USE 'satisfies' FOR TYPE CHECKING
   - TypeScript 4.9+
   - Preserves literal types while checking

5. PREFER ES MODULES OVER COMMONJS
   - export = is legacy pattern
   - Use export default for single exports

6. CREATE BARREL FILES FOR PUBLIC API
   - Clean, consolidated exports
   - Better developer experience

7. USE GENERIC TYPES FOR REUSABLE MODULES
   - Repository<T>, Factory<T>, etc.

8. TYPE DYNAMIC IMPORTS
   - await import("./module") as ModuleType

⚠️ COMMON PITFALLS:

1. Importing types with regular import
   - Use 'import type' to avoid runtime import

2. Not using 'as const' for constant objects
   - Loses literal type information

3. Circular dependencies without forward declarations
   - Use interfaces to break cycles

4. Exporting 'any' types
   - Always use explicit types

5. Mixing CommonJS and ES modules
   - Stick to one module system

📘 See 32-modules.js for JavaScript fundamentals!
`);
