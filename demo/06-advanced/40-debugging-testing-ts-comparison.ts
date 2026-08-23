// TypeScript vs JavaScript: Debugging and Testing Comparison
// 📘 For JavaScript examples, see: 40-debugging-testing.js
// This file demonstrates TypeScript-specific debugging and testing features

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: Type-Level Debugging
// ============================================

console.log("=== Type-Level Debugging ===\n");

// TypeScript provides compile-time error detection
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  // Missing property would be caught at compile time
};

// Hover over variables to see inferred types
const inferredType = { x: 10, y: 20 };
// Hover shows: const inferredType: { x: number; y: number; }

console.log(`
TypeScript debugging advantages:
- Compile-time type errors
- Hover to see inferred types
- Go to definition/references
- Rename symbol across codebase
- Find all implementations
`);

// Type assertions for debugging
const data: unknown = { value: 42 };
console.log((data as { value: number }).value);

// Type guards for runtime checks
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}

const maybeUser: unknown = { id: 1, name: "Bob", email: "bob@example.com" };
if (isUser(maybeUser)) {
  // TypeScript knows maybeUser is User here
  console.log("User ID:", maybeUser.id);
}

// ============================================
// Section 2: Source Maps
// ============================================

console.log("\n=== Source Maps ===\n");

console.log(`
TypeScript source map configuration (tsconfig.json):
{
  "compilerOptions": {
    "sourceMap": true,           // Generate .js.map files
    "inlineSourceMap": false,    // Embed source map in .js file
    "inlineSources": false,      // Embed source content in map
    "sourceRoot": "",            // Root path for sources
    "mapRoot": ""                // Root path for maps
  }
}

Source maps allow:
- Debugging TypeScript in browser DevTools
- Seeing original TypeScript in stack traces
- Setting breakpoints in TypeScript files
- Step debugging through TypeScript code
`);

// ============================================
// Section 3: Testing with Types
// ============================================

console.log("\n=== Testing with Types ===\n");

// Type-safe test functions
type TestFn = () => void | Promise<void>;

interface TestCase {
  description: string;
  fn: TestFn;
}

function test(description: string, fn: TestFn): void {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result
        .then(() => console.log(`✓ ${description}`))
        .catch((error: Error) => {
          console.error(`✗ ${description}`);
          console.error(`  ${error.message}`);
        });
    } else {
      console.log(`✓ ${description}`);
    }
  } catch (error) {
    console.error(`✗ ${description}`);
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
    }
  }
}

// Type-safe expect function
interface Matchers<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeGreaterThan(expected: number): void;
  toBeLessThan(expected: number): void;
  toContain(item: T extends Array<infer U> ? U : never): void;
}

function expect<T>(actual: T): Matchers<T> {
  return {
    toBe(expected: T): void {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual(expected: T): void {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`
        );
      }
    },
    toBeGreaterThan(expected: number): void {
      if (typeof actual !== "number") {
        throw new Error("Value must be a number");
      }
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThan(expected: number): void {
      if (typeof actual !== "number") {
        throw new Error("Value must be a number");
      }
      if (actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toContain(item: T extends Array<infer U> ? U : never): void {
      if (!Array.isArray(actual)) {
        throw new Error("Value must be an array");
      }
      if (!actual.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    },
  };
}

// Type-safe tests
function add(a: number, b: number): number {
  return a + b;
}

test("add() should sum two numbers", () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
});

test("add() with type safety", () => {
  const result: number = add(2, 3);
  expect(result).toBe(5);
  // expect(result).toBe("5"); // Error: Argument of type 'string' is not assignable
});

// ============================================
// Section 4: Type Testing
// ============================================

console.log("\n=== Type Testing ===\n");

// Testing types with expectTypeOf (Vitest)
console.log(`
Type testing with Vitest:

import { expectTypeOf } from 'vitest';

test('type tests', () => {
  expectTypeOf(add(1, 2)).toBeNumber();
  expectTypeOf(add).parameter(0).toBeNumber();
  expectTypeOf(add).returns.toBeNumber();
  
  expectTypeOf<User>().toHaveProperty('id');
  expectTypeOf<User>().toMatchTypeOf<{ id: number }>();
});
`);

// Testing type errors (note: @ts-expect-error only applies within real TS
// source, not inside a template-literal string demo, so no directive is needed here).
console.log(`
Testing type errors:

// @ts-expect-error - Should error because string is not assignable to number
const invalid: number = "not a number";

// If the next line doesn't error, TypeScript will report an error
`);

// ============================================
// Section 5: Custom Error Types
// ============================================

console.log("\n=== Custom Error Types ===\n");

// Type-safe custom errors
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

// Type-safe error handling
function validateAge(age: number): void {
  if (age < 0) {
    throw new ValidationError("Age cannot be negative", "age", age);
  }
  if (age > 150) {
    throw new ValidationError("Age seems unrealistic", "age", age);
  }
}

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed for ${error.field}:`, error.message);
    console.log("Invalid value:", error.value);
  } else if (error instanceof NetworkError) {
    console.log(`Network error (${error.statusCode}):`, error.message);
  } else {
    console.log("Unexpected error:", error);
  }
}

// Result type pattern for error handling
type Result<T, E = Error> =
  { success: true; value: T } | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error("Division by zero") };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log("Result:", result.value);
} else {
  console.error("Error:", result.error.message);
}

// ============================================
// Section 6: JSDoc vs TypeScript
// ============================================

console.log("\n=== JSDoc vs TypeScript ===\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JSDOC VS TYPESCRIPT                                                 │
├─────────────────────────────────────────────────────────────────────┤
│ JSDoc (JavaScript):                                                 │
│   /**                                                               │
│    * @param {number} a - First number                              │
│    * @param {number} b - Second number                             │
│    * @returns {number} Sum of a and b                              │
│    */                                                               │
│   function sum(a, b) {                                             │
│     return a + b;                                                   │
│   }                                                                 │
│                                                                     │
│ TypeScript:                                                         │
│   function sum(a: number, b: number): number {                     │
│     return a + b;                                                   │
│   }                                                                 │
│                                                                     │
│ TypeScript advantages:                                             │
│   ✓ Native type system                                             │
│   ✓ Better IDE support                                             │
│   ✓ Compile-time checking                                          │
│   ✓ Generics, unions, intersections                                │
│   ✓ Type inference                                                 │
│   ✓ Refactoring support                                            │
└─────────────────────────────────────────────────────────────────────┘
`);

// ============================================
// Section 7: Linting with TypeScript
// ============================================

console.log("\n=== Linting with TypeScript ===\n");

console.log(`
TypeScript ESLint configuration:

npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin

.eslintrc.json:
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-floating-promises": "error"
  }
}

Type-aware rules:
- @typescript-eslint/no-floating-promises
- @typescript-eslint/no-misused-promises
- @typescript-eslint/await-thenable
- @typescript-eslint/no-unnecessary-type-assertion
- @typescript-eslint/strict-boolean-expressions
`);

// ============================================
// Section 8: Testing Frameworks
// ============================================

console.log("\n=== Testing Frameworks with TypeScript ===\n");

console.log(`
Jest with TypeScript:

npm install --save-dev jest @types/jest ts-jest

jest.config.js:
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\\\.ts$': 'ts-jest'
  }
};

Vitest with TypeScript:

npm install --save-dev vitest

vite.config.ts:
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  }
});

Type-safe test example:

import { describe, it, expect } from 'vitest';

describe('Calculator', () => {
  it('should add numbers', () => {
    const result: number = add(2, 3);
    expect(result).toBe(5);
  });
  
  it('should have correct types', () => {
    expectTypeOf(add).parameter(0).toBeNumber();
    expectTypeOf(add).returns.toBeNumber();
  });
});
`);

// ============================================
// Section 9: Mock Types
// ============================================

console.log("\n=== Type-Safe Mocking ===\n");

// Type-safe mock function
type MockFn<T extends (...args: any[]) => any> = T & {
  mock: {
    calls: Parameters<T>[];
    results: ReturnType<T>[];
  };
};

function createMock<T extends (...args: any[]) => any>(
  implementation?: T
): MockFn<T> {
  const calls: Parameters<T>[] = [];
  const results: ReturnType<T>[] = [];

  const mockFn = ((...args: Parameters<T>) => {
    calls.push(args);
    const result = implementation?.(...args);
    results.push(result);
    return result;
  }) as MockFn<T>;

  mockFn.mock = { calls, results };
  return mockFn;
}

// Usage
interface UserService {
  getUser(id: number): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
}

const mockUserService: UserService = {
  getUser: createMock(async (id: number) => ({
    id,
    name: "Mock User",
    email: "mock@example.com",
  })),
  updateUser: createMock(async (id: number, data: Partial<User>) => ({
    id,
    name: data.name || "Mock User",
    email: data.email || "mock@example.com",
  })),
};

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Enable strict mode in tsconfig.json");
console.log("2. Use type guards for runtime type checking");
console.log("3. Leverage type inference instead of explicit types");
console.log("4. Use Result types for error handling");
console.log("5. Enable source maps for debugging");
console.log("6. Write type tests for complex types");
console.log("7. Use @typescript-eslint for type-aware linting");

console.log("\n❌ DON'T:");
console.log("1. Don't use any type (use unknown instead)");
console.log("2. Don't disable strict checks without good reason");
console.log("3. Don't ignore TypeScript errors with @ts-ignore");
console.log("4. Don't forget to test edge cases with types");
console.log("5. Don't use type assertions when type guards work");
