// Scope Basics TypeScript Comparison
// 📘 Complementary to: 13.1-scope-basics.js

export {};

console.log("=== Scope Basics TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. SCOPE
 *    JS:  var (function-scoped), let/const (block-scoped)
 *    TS:  Same scoping rules as JS; adds type-level scope (type, interface, namespace)
 *         - Type aliases and interfaces are block-scoped
 *         - Namespaces create their own scope
 *         - Module scope via import/export (same as JS)
 *
 * 2. BLOCK-LEVEL TYPES
 *    TS:  Types declared in blocks are scoped to that block:
 *         if (true) { type T = string; let x: T = "hello"; }
 *         // T is not accessible here
 *
 * 3. TYPE SCOPE VS VALUE SCOPE
 *    TS:  Types and values exist in separate scopes:
 *         type User = { id: number; name: string }; // Type scope
 *         const User = { id: 1, name: "Alice" }; // Value scope (no conflict!)
 *
 * 4. NAMESPACES
 *    TS:  Namespaces create isolated scopes for both types and values:
 *         namespace Utils {
 *           export function add(a: number, b: number): number {
 *             return a + b;
 *           }
 *         }
 *         // Access as Utils.add()
 *
 * 5. AMBIENT DECLARATIONS
 *    TS:  'declare' keyword adds to type scope without generating runtime code:
 *         declare var process: NodeJS.Process;
 *         // TypeScript knows process exists, but no code is emitted
 */

// Example 1: Block-scoped types
console.log("1. Block-scoped types:");
if (Math.random() > 0.5) {
  type Status = "success" | "error";
  const result: Status = "success";
  console.log("Block-scoped type Status:", result);
  // Status is only accessible inside this block
}

// Example 2: Type vs value scope
console.log("\n2. Type vs value scope:");
type User = { id: number; name: string }; // Type scope
const User = { id: 1, name: "Alice" }; // Value scope (no conflict!)
console.log("Type 'User' and value 'User' can coexist:");
console.log("  Value User:", User);
console.log("  Type User: { id: number; name: string } (compile-time only)");

// Example 3: Namespaces
console.log("\n3. Namespaces:");
namespace MathUtils {
  export const PI = 3.14;
  export function add(a: number, b: number): number {
    return a + b;
  }
}
console.log("  MathUtils.PI:", MathUtils.PI);
console.log("  MathUtils.add(2, 3):", MathUtils.add(2, 3));

// Example 4: declare keyword (ambient declarations)
console.log("\n4. Ambient declarations:");
console.log("  'declare var process' adds type info without runtime code");
console.log(
  "  Used for type safety with global variables not defined in your code"
);

/**
 * 📋 Key Takeaways:
 * - TS follows JS scoping rules for values
 * - TS adds additional type-level scoping rules
 * - Types and values exist in separate scopes (no naming conflicts)
 * - Namespaces and modules create isolated scopes
 * - 'declare' keyword adds type information without emitting code
 */
