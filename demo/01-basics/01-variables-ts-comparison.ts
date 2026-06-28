// TypeScript vs JavaScript: Variables and Types Comparison
// This file demonstrates TypeScript-specific features for variables
// 📘 For JavaScript runtime behavior, see: 01-variables.js

// Make this file a module to avoid global scope conflicts
export {};

// ============================================
// 1. Type Annotations (TS Feature)
// ============================================

// JavaScript: No type checking
// let jsNumber = 42;
// jsNumber = "string"; // OK in JS, runtime error potential

// TypeScript: Explicit type annotations
let tsNumber: number = 42;
// tsNumber = "string"; // ❌ Error: Type 'string' is not assignable to type 'number'

// ⚠️ PITFALL: Type inference vs explicit annotation
let inferredNumber = 42; // TypeScript infers type as 'number'
let explicitNumber: number = 42; // Explicitly typed as 'number'
// Both are equivalent, but explicit is clearer for function parameters

// ============================================
// 2. Null and Undefined Handling (Major Difference!)
// ============================================

// 🔴 CRITICAL: strictNullChecks setting changes behavior

// Without strictNullChecks (default in some configs):
// let maybeNumber: number = null; // OK (dangerous!)
// let maybeString: string = undefined; // OK (dangerous!)

// With strictNullChecks: true (recommended):
let strictNumber: number = 42;
// strictNumber = null; // ❌ Error: Type 'null' is not assignable to type 'number'
// strictNumber = undefined; // ❌ Error: Type 'undefined' is not assignable to type 'number'

// ✅ BEST PRACTICE: Use union types for nullable values
let nullableNumber: number | null = 42;
nullableNumber = null; // ✅ OK

let optionalString: string | undefined = "hello";
optionalString = undefined; // ✅ OK

let flexibleValue: string | null | undefined = "value";
flexibleValue = null; // ✅ OK
flexibleValue = undefined; // ✅ OK

// ⚠️ CONFUSION POINT: null vs undefined in TypeScript
// - Use `undefined` for optional/missing values
// - Use `null` for intentionally empty values
// - Use union types to be explicit about nullability

// ============================================
// 3. Any vs Unknown vs Never (TS Special Types)
// ============================================

// 'any' - Disables type checking (avoid when possible)
let anyValue: any = 42;
anyValue = "string"; // ✅ OK
anyValue = true; // ✅ OK
anyValue.nonExistentMethod(); // ✅ No error (dangerous!)
// ⚠️ PITFALL: 'any' defeats the purpose of TypeScript

// 'unknown' - Type-safe alternative to 'any'
let unknownValue: unknown = 42;
unknownValue = "string"; // ✅ OK
// unknownValue.toUpperCase(); // ❌ Error: Object is of type 'unknown'

// ✅ BEST PRACTICE: Use type guards with 'unknown'
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // ✅ OK after type guard
}

// 'never' - Represents values that never occur
function throwError(message: string): never {
  throw new Error(message);
  // Function never returns normally
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}

// ============================================
// 4. Type Assertions (Type Casting)
// ============================================

// JavaScript: No type assertions
// let jsValue = getSomeValue();
// let length = jsValue.length; // Hope it has length property!

// TypeScript: Type assertions (use carefully!)
let someValue: unknown = "hello world";

// Method 1: 'as' syntax (preferred)
let strLength1: number = (someValue as string).length;

// Method 2: Angle-bracket syntax (not usable in JSX)
let strLength2: number = (<string>someValue).length;

// ⚠️ PITFALL: Type assertions don't perform runtime checks
let wrongAssertion = (42 as any) as string;
// wrongAssertion.toUpperCase(); // Runtime error! TypeScript won't catch this

// ✅ BEST PRACTICE: Use type guards instead of assertions
function getLength(value: unknown): number {
  if (typeof value === "string") {
    return value.length; // Type guard ensures safety
  }
  return 0;
}

// ============================================
// 5. Literal Types (TS Feature)
// ============================================

// JavaScript: Variables can hold any value of their type
// let jsStatus = "pending";
// jsStatus = "invalid-status"; // OK in JS, might cause bugs

// TypeScript: Literal types restrict to specific values
let tsStatus: "pending" | "approved" | "rejected" = "pending";
tsStatus = "approved"; // ✅ OK
// tsStatus = "invalid"; // ❌ Error: Type '"invalid"' is not assignable

// ⚠️ CONFUSION POINT: const vs literal types
const constValue = "hello"; // Type: "hello" (literal type)
let letValue = "hello"; // Type: string (widened type)

// ✅ BEST PRACTICE: Use 'as const' for literal types
let literalValue = "hello" as const; // Type: "hello"

// ============================================
// 6. Type Widening and Narrowing
// ============================================

// Type Widening: TypeScript infers broader types
let widenedNull = null; // Type: any (in some configs)
let widenedUndefined = undefined; // Type: any (in some configs)

// ✅ BEST PRACTICE: Be explicit with null/undefined
let explicitNull: null = null; // Type: null
let explicitUndefined: undefined = undefined; // Type: undefined

// Type Narrowing: TypeScript narrows types in conditionals
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}

// ============================================
// 7. Common Pitfalls: TS-Specific
// ============================================

console.log("\n=== TypeScript-Specific Pitfalls ===\n");

// ⚠️ PITFALL 1: Type assertions don't perform runtime checks
// (Same idea as the `wrongAssertion` example above, restated in the pitfalls section.)
let redundantAssertion = (42 as any) as string;
// redundantAssertion.toUpperCase(); // Runtime error! TypeScript won't catch this
console.log("Type assertions bypass compile-time checks");

// PITFALL 2: Array type confusion
let tsArrayExample: number[] = [1, 2, 3];
// tsArrayExample.push("string"); // ❌ Error in TS
console.log("Typed arrays prevent mixed types");

// PITFALL 3: Object property access
interface Person {
  name: string;
  age: number;
}

const person: Person = { name: "Alice", age: 30 };
console.log(person.name); // ✅ OK
// console.log(person.email); // ❌ Error: Property 'email' does not exist

// PITFALL 4: Non-null assertion can cause runtime errors
// (The dedicated section 10 below covers the non-null assertion operator
//  in depth; here we reuse the same idea under different identifiers.)
interface UserProfile {
  name: string;
  age: number;
}

function fetchProfile(): UserProfile | null {
  return { name: "Bob", age: 25 };
}

const maybeProfile = fetchProfile();

// Safe way:
const safeName = maybeProfile?.name; // ✅ Safe: string | undefined
console.log("Safe access:", safeName);

// Dangerous way (non-null assertion):
const forcedName = maybeProfile!.name; // ⚠️ Tells TS "trust me, it's not null"
console.log("Non-null assertion:", forcedName);

// ✅ BEST PRACTICE: Use optional chaining or explicit null checks

// ============================================
// 8. Best Practices Summary
// ============================================

/*
✅ DO:
1. Enable strictNullChecks in tsconfig.json
2. Use union types for nullable values (string | null)
3. Prefer 'unknown' over 'any'
4. Use type guards instead of type assertions
5. Be explicit with types in function parameters
6. Use literal types for fixed sets of values
7. Use 'const' for values that won't change

❌ DON'T:
1. Use 'any' unless absolutely necessary
2. Disable strict mode options
3. Use type assertions without validation
4. Ignore TypeScript errors with @ts-ignore
5. Mix null and undefined carelessly
6. Rely on implicit type widening
7. Use 'var' (use 'const' or 'let')

⚠️ WATCH OUT FOR:
1. Type assertions don't perform runtime checks
2. Non-null assertion (!) can cause runtime errors
3. Type widening with const vs let
4. any defeats TypeScript's purpose
5. Optional chaining (?.) vs null checks
6. Difference between null and undefined

📘 See related:
- 01-variables.js (JavaScript runtime behavior)
- 02-operators-ts-comparison.ts (Operator type safety)
*/

// ============================================
// 9. Optional Chaining and Nullish Coalescing
// ============================================

// Optional Chaining (?.) - ES2020, supported in TS
interface Config {
  server?: {
    port?: number;
  };
}

const config: Config = {};

// JavaScript (old way):
// const port = config.server && config.server.port;

// TypeScript/Modern JS (new way):
const port = config.server?.port; // undefined if any part is null/undefined
console.log("\nOptional chaining:", port);

// Nullish Coalescing (??) - ES2020, supported in TS
const defaultPort = port ?? 3000; // Use 3000 if port is null or undefined
console.log("With nullish coalescing:", defaultPort);

// ⚠️ CONFUSION POINT: ?? vs ||
const orValue = 0 || 100; // 100 (0 is falsy)
const nullishValue: number | null = 0;
const coalescingValue = nullishValue ?? 100; // 0 (0 is not null/undefined)
console.log("|| operator:", orValue);
console.log("?? operator:", coalescingValue);

// ✅ BEST PRACTICE: Use ?? for null/undefined checks, || for falsy checks

// ============================================
// 10. Non-null Assertion Operator (!)
// ============================================

interface UserProfile {
  name: string;
  age: number;
}

function getUserProfile(): UserProfile | null {
  return { name: "Bob", age: 25 };
}

const maybeUserProfile = getUserProfile();

// Without assertion:
// const userName = maybeUserProfile.name; // ❌ Error: Object is possibly 'null'

// With null check:
const userName1 = maybeUserProfile?.name; // ✅ Safe: string | undefined

// With non-null assertion (use carefully!):
const userName2 = maybeUserProfile!.name; // ⚠️ Tells TS "trust me, it's not null"

// ⚠️ PITFALL: Non-null assertion can cause runtime errors
// ✅ BEST PRACTICE: Prefer optional chaining or explicit null checks

console.log("\n=== TypeScript provides compile-time type safety ===");
console.log("=== Runtime behavior follows JavaScript rules ===");
console.log("=== See 01-variables.js for runtime behavior ===");
