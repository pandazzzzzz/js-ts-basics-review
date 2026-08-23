// Scope - TDZ and Strict Mode TypeScript Comparison
// 📘 Complementary to: 13.2-scope-tdz-strict.js

export {};

console.log("=== Scope - TDZ and Strict Mode TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. TDZ (TEMPORAL DEAD ZONE) TYPE CHECKING
 *    JS:  TDZ is runtime behavior (throws ReferenceError)
 *    TS:  Static type checking detects TDZ access at compile time:
 *         console.log(x); // TS Error: Block-scoped variable 'x' used before its declaration
 *         let x = 10;
 *
 * 2. STRICT MODE DEFAULT
 *    JS:  Strict mode requires explicit "use strict" directive
 *    TS:  Strict mode is enabled by default when compiling to ES6+
 *         'strict' tsconfig flag enables additional strict type checking rules
 *
 * 3. EVAL TYPE SAFETY
 *    JS:  eval() returns any value, no type safety
 *    TS:  eval() returns 'any' type by default; type casting required for safety:
 *         const result = eval("1 + 2") as number;
 *         eval() is discouraged in TS (use safer alternatives)
 *
 * 4. WITH STATEMENT PROHIBITION
 *    JS:  with is deprecated but allowed in non-strict mode
 *    TS:  with statement is disallowed entirely (compiler error)
 *
 * 5. STRICT COMPILER OPTIONS
 *    TS:  tsconfig.json 'strict' flag enables strict type checking:
 *         - strictNullChecks: null/undefined must be handled explicitly
 *         - noImplicitAny: disallows implicit 'any' types
 *         - strictFunctionTypes: stricter function type checking
 *         - strictPropertyInitialization: class properties must be initialized
 */

// Example 1: TDZ static checking
console.log("1. TDZ static checking:");
// Uncomment below to see TS error:
// console.log(tdzVar); // ❌ TS Error: Block-scoped variable 'tdzVar' used before its declaration
let tdzVar = 42;
console.log("✓ TS catches TDZ access at compile time");

// Example 2: Strict mode in TS
console.log("\n2. Strict mode in TS:");
console.log("✓ TS enables strict mode by default for ES6+ targets");
console.log("✓ tsconfig 'strict' flag enables comprehensive type checking");

// Example 3: eval() in TS
console.log("\n3. eval() in TS:");
const evalResult = eval("2 + 3") as number; // Type casting required
console.log("  eval('2 + 3') as number:", evalResult);
console.log("⚠️  eval() returns 'any' type - use with caution");

// Example 4: with statement disallowed in TS
console.log("\n4. with statement:");
console.log("❌ with statement is completely disallowed in TS (compiler error)");
console.log("✅ Use destructuring instead");

// Example 5: Strict compiler options
console.log("\n5. Common strict compiler options:");
const options = [
  "strictNullChecks",
  "noImplicitAny",
  "strictFunctionTypes",
  "strictPropertyInitialization",
  "noImplicitReturns",
  "noUnusedLocals",
  "noUnusedParameters",
];
console.log("  Recommended strict flags:", options.join(", "));

/**
 * 📋 Key Takeaways:
 * - TS catches TDZ errors at compile time before runtime
 * - Strict mode is enabled by default for modern targets
 * - eval() is discouraged and returns 'any' type (cast explicitly if used)
 * - with statement is completely disallowed in TS
 * - Enable 'strict' flag in tsconfig for maximum type safety
 */
