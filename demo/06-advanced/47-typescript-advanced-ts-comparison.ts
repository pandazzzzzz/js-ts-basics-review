// TypeScript vs JavaScript: TypeScript Advanced Comparison
// 📘 For JavaScript foundations, see: 47-typescript-advanced.js
// This file demonstrates TypeScript-specific advanced features

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// JSDoc vs TypeScript Type System
// ============================================

console.log("=== JSDoc vs TypeScript ===\n");

// JavaScript with JSDoc:
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function addJs(a: number, b: number) {
  return a + b;
}

// TypeScript:
function addTs(a: number, b: number): number {
  return a + b;
}

console.log("JSDoc: Type hints in comments");
console.log("TypeScript: Native type annotations");
console.log("Key difference: TypeScript provides compile-time checking");

// JSDoc types:
/**
 * @typedef {Object} UserJs
 * @property {number} id
 * @property {string} name
 */

// TypeScript:
interface UserTs {
  id: number;
  name: string;
}

console.log("\nJSDoc vs TypeScript Interfaces:");
console.log("JSDoc: @typedef in comments");
console.log("TypeScript: 'interface' keyword");

// ============================================
// Generic Constraints - TypeScript
// ============================================

console.log("\n=== Generic Constraints ===\n");

// JavaScript:
// No generic type-safe property access
function getPropertyJs(obj: Record<string, unknown>, key: string) {
  return obj[key];
}
const userJs = { name: "Alice", age: 30 };
const nameJs = getPropertyJs(userJs, "name"); // any type

// TypeScript:
function getPropertyTs<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const userTs = { name: "Alice", age: 30 };
const nameTs = getPropertyTs(userTs, "name"); // type: string
const ageTs = getPropertyTs(userTs, "age");   // type: number

console.log("JavaScript: Returns 'any' type, no type safety");
console.log("TypeScript: Returns correct type, type-safe");
console.log("Name:", nameTs, "Age:", ageTs);

// ============================================
// Conditional Types - TypeScript Only
// ============================================

console.log("\n=== Conditional Types ===\n");

// TypeScript-only feature
type IsString<T> = T extends string ? true : false;
type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Infer keyword (example of how ReturnType utility type works under the hood)
// NOTE: This is a demonstration only — ReturnType is a built-in utility type!
type ReturnTypeDemo<T> = T extends (...args: any[]) => infer R ? R : never;
type Fn = () => string;
type FunctionReturn = ReturnTypeDemo<Fn>; // string

console.log("Conditional types: Type-level ternary operator");
console.log("IsString<string>: true");
console.log("IsString<number>: false");

// ============================================
// Mapped Types - TypeScript Only
// ============================================

console.log("\n=== Mapped Types ===\n");

// JavaScript: Manual type transformation
// TypeScript: Built-in mapped types
interface User {
  name: string;
  age: number;
}

// TypeScript built-in utility types
type PartialUser = Partial<User>;     // All properties optional
type RequiredUser = Required<User>;   // All properties required
type ReadonlyUser = Readonly<User>;   // All properties readonly

console.log("JavaScript: No built-in type transformation");
console.log("TypeScript: Built-in utility types");
console.log("Partial, Required, Readonly, Pick, Omit");

// Custom mapped type in TypeScript
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; }

console.log("Custom mapped types: Transform object types");

// ============================================
// Template Literal Types - TypeScript Only
// ============================================

console.log("\n=== Template Literal Types ===\n");

// TypeScript-only: String manipulation at type level
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

console.log("Template literal types: String manipulation at type level");
console.log("Event handlers: onClick, onFocus, onBlur");

// ============================================
// Decorators - TypeScript Legacy (Experimental)
// ============================================

console.log("\n=== Decorators ===\n");

console.log("JavaScript: Stage 2.7 proposal (nearing Stage 3, not yet standardized)");
console.log("TypeScript: Legacy syntax requires --experimentalDecorators flag");
console.log("TS 5.0+: Stage 2.7 syntax available with experimentalDecorators: false");

// Legacy TypeScript decorator example (requires experimentalDecorators: true)
function LogTs(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  return descriptor;
}

console.log("Decorators: Add metadata, modify behavior");

// ============================================
// Type Guards - TypeScript
// ============================================

console.log("\n=== Type Guards ===\n");

// JavaScript:
function isStringJs(value: unknown) {
  return typeof value === "string";
}

// TypeScript: Type predicate
function isStringTs(value: unknown): value is string {
  return typeof value === "string";
}

const value: unknown = "hello";
if (isStringTs(value)) {
  console.log(value.toUpperCase()); // TypeScript knows value is string here
}

console.log("Type guards: Type predicates with 'is' operator");

// ============================================
// Declaration Merging - TypeScript Only
// ============================================

console.log("\n=== Declaration Merging ===\n");

// TypeScript-only: Interface merging
interface Box {
  height: number;
  width: number;
}

interface Box {
  depth: number;
}

const box: Box = { height: 10, width: 20, depth: 30 };
console.log("Declaration merging: Multiple interfaces merge");
console.log("Box:", box);

// ============================================
// Namespaces - TypeScript
// ============================================

console.log("\n=== Namespaces ===\n");

// TypeScript namespace
namespace ValidationTs {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    }
  }
}

const validator = new ValidationTs.EmailValidator();
console.log("Namespaces: TypeScript-specific organization");
console.log("Valid email:", validator.isValid("test@example.com"));

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use TypeScript native types over JSDoc");
console.log("2. Leverage generic constraints");
console.log("3. Use utility types");
console.log("4. Prefer unknown over any");
console.log("5. Use type guards for narrowing");

console.log("\n❌ DON'T:");
console.log("1. Don't use any unless necessary");
console.log("2. Don't overcomplicate types");
console.log("3. Don't ignore type inference");

console.log("\n📊 JavaScript vs TypeScript Summary:");
console.log(`
┌──────────────────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                              │   JavaScript    │   TypeScript    │
├──────────────────────────────────────────┼─────────────────┼─────────────────┤
│ Type system                          │   JSDoc (opt   │   Native types  │
│ Generic constraints                  │   No            │   Yes           │
│ Conditional types                  │   No            │   Yes           │
│ Mapped types                     │   No            │   Yes           │
│ Template literal types              │   No            │   Yes           │
│ Decorators                     │   Proposal      │   Experimental  │
│ Declaration merging            │   No            │   Yes           │
│ Type guards                      │   Runtime       │   Type predicates│
│ Namespaces                   │   No            │   Yes           │
└──────────────────────────────────────────┴─────────────────┴─────────────────┘
`);
