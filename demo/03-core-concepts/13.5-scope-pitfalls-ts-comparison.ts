// Scope & Closures Pitfalls TypeScript Comparison
// 📘 Complementary to: 13.5-scope-pitfalls.js

// 🎯 Difficulty: Intermediate
export {};

console.log("=== Scope & Closures Pitfalls TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. STATIC TYPE CHECKING CATCHES ERRORS EARLY
 *    JS:  Most scope-related issues are runtime errors (ReferenceError, etc.)
 *    TS:  Many issues caught at compile time:
 *         - Undefined variables
 *         - TDZ access
 *         - Type mismatches in closures
 *         - Shadowed variables (configurable)
 *
 * 2. noImplicitAny
 *    JS:  Variables without declaration are implicitly global (bad!)
 *    TS:  noImplicitAny flag catches untyped references:
 *         function foo(x) { return x; }
 *         // ❌ Error: Parameter 'x' implicitly has an 'any' type
 *
 * 3. noUnusedLocals / noUnusedParameters
 *    TS:  Compiler flags to detect dead code:
 *         function example(a: number, b: number) {
 *           return a * 2;
 *           // ❌ Warning: 'b' is declared but its value is never read
 *         }
 *
 * 4. DECLARATION MERGING PITFALLS
 *    TS:  Interface and namespace declarations merge across same-scope
 *         declarations. This TS-only behavior can be surprising:
 *         interface User { name: string }
 *         interface User { age: number }
 *         // Merged! User has both name and age
 *
 * 5. ENUM SCOPE CONFUSION
 *    TS:  Enums create both type-level AND value-level scoped bindings:
 *         enum Direction { Up, Down, Left, Right }
 *         - Type scope: Direction type
 *         - Value scope: Direction object at runtime
 *    This is different from type aliases which are compile-time only.
 *
 * 6. BEST PRACTICES FOR TS
 *    - Enable 'strict' mode in tsconfig.json
 *    - Use const assertions (as const) for literal types
 *    - Prefer type aliases over interfaces for union types
 *    - Use never to ensure exhaustive checks
 *    - Use --noImplicitReturns to catch missing returns
 */

// Example 1: Static error detection
console.log("1. Static error detection:");
console.log("✓ TS catches undefined variables at compile time");
console.log("✓ TS catches TDZ access at compile time");
console.log("✓ TS catches type mismatches in closures");

// Example 2: noImplicitAny
console.log("\n2. noImplicitAny:");
console.log("✓ 'noImplicitAny' catches untyped parameters");
console.log("✓ Prevents 'any' from spreading through code");

// Example 3: noUnusedLocals / noUnusedParameters
console.log("\n3. Unused detection:");
console.log("✓ 'noUnusedLocals' detects unused variables");
console.log("✓ 'noUnusedParameters' detects unused function parameters");

// Example 4: Declaration merging
console.log("\n4. Declaration merging:");
interface User {
  name: string;
}
interface User {
  age: number;
}
// Merged! User now has both name and age
const user: User = { name: "Alice", age: 30 };
console.log("  Merged interface User:", user);
console.log("  ⚠️  Interfaces with same name in same scope automatically merge");

// Example 5: Enum scope
console.log("\n5. Enum scope:");
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
const dir: Direction = Direction.Up;
console.log("  Direction.Up:", dir);
console.log("  ⚠️  Enums create both type AND value bindings");
console.log("  (Unlike type aliases which are compile-time only)");

// Example 6: TS-specific best practices
console.log("\n6. TypeScript best practices:");
const bestPractices = [
  "Enable 'strict' in tsconfig",
  "Use as const for literal type narrowing",
  "Use never for exhaustive checks",
  "Avoid 'any' - use 'unknown' instead",
  "Enable noUnusedLocals/noUnusedParameters",
];
bestPractices.forEach((practice, i) => {
  console.log(`  ${i + 1}. ${practice}`);
});

/**
 * 📋 Key Takeaways:
 * - TS catches many scope/closure issues at compile time
 * - Enable strict mode and related flags for maximum safety
 * - Be aware of TS-specific behaviors (declaration merging, enums)
 * - Use compiler options to enforce code quality
 * - Type safety extends through closures naturally
 */
