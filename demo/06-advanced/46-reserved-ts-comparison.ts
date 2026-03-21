// Reserved for Future Extensions - TypeScript Comparison
// 📘 For JavaScript examples, see: 46-reserved.js
// This file demonstrates TypeScript-specific features for upcoming JavaScript

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: TypeScript's Current Advanced Features
// ============================================

console.log("=== TypeScript Advanced Type Features ===\n");

// 1. Template Literal Types
console.log("1. Template Literal Types:");

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = 'users' | 'posts' | 'comments';

type ApiRoute = `/api/${Endpoint}`;
const userRoute: ApiRoute = '/api/users';

type EventName<T extends string> = `${T}Changed` | `${T}Updated`;
type UserEvent = EventName<'user'>; // "userChanged" | "userUpdated"

console.log(`Template literal types create union types from string patterns`);

// 2. Conditional Types
console.log("\n2. Conditional Types:");

type IsString<T> = T extends string ? true : false;
type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Infer keyword in conditional types
type Flatten<T> = T extends Array<infer U> ? U : T;
type C = Flatten<string[]>;        // string
type D = Flatten<Array<{ id: number }>>; // { id: number }

// Extract utility type (built-in)
type E = Extract<'a' | 'b' | 'c', 'a' | 'd'>; // 'a'

console.log("Conditional types enable type-level programming");

// 3. Mapped Types with Key Remapping
console.log("\n3. Mapped Types with Key Remapping:");

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

// Exclude specific keys
type Mutable<T> = {
  -readonly [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

console.log("Mapped types can transform and filter keys");

// 4. Variadic Tuple Types
console.log("\n4. Variadic Tuple Types:");

type StringNumberPair = [string, number];
type StringNumberBoolean = [...StringNumberPair, boolean];
// [string, number, boolean]

// Concatenate tuples
type Arr = [1, 2];
type Arr2 = [...Arr, 3, 4]; // [1, 2, 3, 4]

// Generic variadic tuples
function merge<T extends unknown[]>(...args: T): [...T] {
  return [...args];
}

const result = merge('hello', 42, true);
console.log("Variadic tuples enable precise function typing");

// 5. const Type Parameters (TS 5.0+)
console.log("\n5. const Type Parameters:");

function identity<const T>(value: T): T {
  return value;
}

const arr = identity([1, 2, 3] as const);
// Type: readonly [1, 2, 3] - literal types preserved!

const obj = identity({ x: 1, y: 2 } as const);
// Type: { readonly x: 1; readonly y: 2; }

console.log("const preserves literal types in generics");

// 6. satisfies Operator (TS 4.9+)
console.log("\n6. satisfies Operator:");

type Config = {
  port: number;
  host: string;
};

const config = {
  port: 8080,
  host: "localhost",
  extra: "ignored" // This would error without satisfies
} satisfies Config;

// Port type is preserved as literal 8080, not widened to number
const port: 8080 = config.port; // OK!

console.log("satisfies preserves literal types while type-checking");

// ============================================
// Section 2: TypeScript Decorators (Future JS)
// ============================================

console.log("\n=== TypeScript Decorators ===\n");

// Class decorator
function logged(constructor: Function) {
  console.log(`Class ${constructor.name} is being decorated`);
}

@logged
class Example {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}

// Method decorator
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Calculator {
  @enumerable(false)
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property decorator
function format(pattern: string) {
  return function (target: any, propertyKey: string) {
    console.log(`Decorating ${propertyKey} with pattern ${pattern}`);
  };
}

class Formatted {
  @format('YYYY-MM-DD')
  date!: string;
}

// Accessor decorator
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class ConfigurableExample {
  private _value: number = 0;

  @configurable(false)
  get value(): number {
    return this._value;
  }
}

console.log("Decorators enable metaprogramming patterns");

// ============================================
// Section 3: Import Attributes (TS 5.3+)
// ============================================

console.log("\n=== Import Attributes ===\n");

// JSON modules with type safety
// import config from './config.json' with { type: 'json' };
// TypeScript infers type from JSON structure

interface ConfigType {
  apiUrl: string;
  timeout: number;
}

// Type-safe JSON import
// const typedConfig: ConfigType = config;

console.log("Import attributes provide type-safe module loading");

// ============================================
// Section 4: Utility Types for Future Patterns
// ============================================

console.log("\n=== Utility Types for Future Patterns ===\n");

// NoInfer utility type (TS 5.4+)
function combine<T>(a: T, b: T): T {
  return a || b;
}

// Without NoInfer, both args must be same type
// With NoInfer, can prevent inference in specific positions

// PartialDeep - deep partial (custom utility)
type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends object ? PartialDeep<T[P]> : T[P];
};

interface Nested {
  user: {
    name: string;
    settings: {
      theme: string;
    };
  };
}

type PartialNested = PartialDeep<Nested>;
// All properties optional at every level

// ReadonlyDeep - deep readonly
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};

console.log("Custom utility types extend TypeScript's power");

// ============================================
// Section 5: Branded Types for Type Safety
// ============================================

console.log("\n=== Branded Types ===\n");

// Create nominal types from structural types
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function sendEmail(to: Email, subject: string): void {
  console.log(`Sending to ${to}: ${subject}`);
}

const userId: UserId = createUserId('user-123');
const email: Email = 'test@example.com' as Email;

// Type mismatch caught at compile time
// sendEmail(userId, 'Test'); // Error: UserId is not Email

console.log("Branded types prevent mixing incompatible strings");

// ============================================
// Section 6: Type-Level Programming
// ============================================

console.log("\n=== Type-Level Programming ===\n");

// Type-level string manipulation
type TrimLeft<S extends string> = S extends ` ${infer T}` ? TrimLeft<T> : S;
type TrimRight<S extends string> = S extends `${infer T} ` ? TrimRight<T> : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type Trimmed = Trim<'  hello world  '>; // "hello world"

// Type-level number operations
type Increment<N extends number> = N extends N
  ? [...TupleOf<N>, any]['length'] & number
  : never;

type TupleOf<N extends number, T extends any[] = []> = T['length'] extends N
  ? T
  : TupleOf<N, [...T, any]>;

// Type-level array manipulation
type DropFirst<T extends any[]> = T extends [any, ...infer Rest] ? Rest : [];
type First<T extends any[]> = T extends [infer F, ...any] ? F : never;

console.log("Type-level programming enables complex type logic");

// ============================================
// Section 7: Module Augmentation
// ============================================

console.log("\n=== Module Augmentation ===\n");

// Extend existing module types
declare module './utils' {
  interface Utils {
    newFunction(): void;
  }
}

// Global augmentation
declare global {
  interface String {
    customMethod(): string;
  }
}

console.log("Module augmentation extends third-party types");

// ============================================
// Section 8: Advanced Interface Patterns
// ============================================

console.log("\n=== Advanced Interface Patterns ===\n");

// Interface merging
interface Config {
  debug: boolean;
}

interface Config {
  production: boolean;
}
// Merged: { debug: boolean; production: boolean; }

// Declaration merging with classes
class Logger {
  log(message: string): void {
    console.log(message);
  }
}

namespace Logger {
  export function info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
}

// Intersection types
type A = { a: string };
type B = { b: number };
type C = A & B; // { a: string; b: number; }

console.log("Interface patterns enable flexible type composition");

// ============================================
// Section 9: Performance Considerations
// ============================================

console.log("\n=== TypeScript Performance Tips ===\n");

console.log("✅ DO:");
console.log("1. Use interfaces for object types (faster than types)");
console.log("2. Avoid deeply nested conditional types");
console.log("3. Use type inference where possible");
console.log("4. Limit use of keyof with large unions");
console.log("5. Use satisfies operator instead of assertions");

console.log("\n❌ DON'T:");
console.log("1. Don't use any excessively");
console.log("2. Don't create circular type references");
console.log("3. Don't overuse mapped types on large objects");
console.log("4. Don't use overly complex utility types");

// ============================================
// Section 10: Future TypeScript Directions
// ============================================

console.log("\n=== Future TypeScript Directions ===\n");

console.log("Potential Future Features:");
console.log("- Effect system for tracking side effects");
console.log("- Better async type inference");
console.log("- Improved module resolution");
console.log("- Native decorators when standardized");
console.log("- Records & Tuples support when ES standardizes");
console.log("- Pattern matching support when ES standardizes");

// ============================================
// Summary
// ============================================

console.log("\n=== Summary ===\n");

console.log("TypeScript provides advanced type features today that may become");
console.log("part of future JavaScript standards. Using TypeScript allows you to:");
console.log("1. Write safer code with compile-time checks");
console.log("2. Use future JS features before browser support");
console.log("3. Leverage powerful type-level programming");
console.log("4. Get better IDE support and autocomplete");
console.log("5. Catch errors before runtime");

/*
📘 See related:
- 43-typescript-advanced-ts-comparison.ts (Advanced TS features)
- 33-es2022-plus-features-ts-comparison.ts (ES2022+ features)
- 01-variables-ts-comparison.ts (Basic TS types)
*/
