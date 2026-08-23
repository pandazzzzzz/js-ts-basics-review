// TypeScript vs JavaScript: Scope and Closures Comparison
// 📘 For JavaScript examples, see: 13-scope-closures.js
// This file demonstrates TypeScript-specific type features for scope and closures

export {};

// ============================================================================
// 1. BLOCK-SCOPED VARIABLES WITH TYPES
// ============================================================================

// JavaScript: let/const without type checking
// let count = 5;
// count = "string"; // No error in JS!

// TypeScript: Type inference for let/const
let inferredCount = 5; // Type inferred as number
const inferredName = "Alice"; // Type inferred as string

// Explicit type annotations
let explicitCount: number = 5;
let explicitName: string = "Alice";

console.log("=== Block-scoped Variables with Types ===");
console.log(inferredCount, explicitCount);

// ⚠️ PITFALL: Type cannot be changed after inference
// inferredCount = "string"; // ❌ Error: Type 'string' is not assignable to type 'number'

// ✅ BEST PRACTICE: Let TypeScript infer types when obvious
const pi = 3.14159; // Inferred as number
const greeting = "Hello"; // Inferred as string

// ============================================================================
// 2. CLOSURE TYPE CAPTURES
// ============================================================================

// JavaScript: Closures capture variables without type safety
// function jsCreateCounter() {
//   let count = 0;
//   return () => ++count;
// }

// TypeScript: Closures with typed captures
function tsCreateCounter(): () => number {
  let count: number = 0;

  return (): number => {
    count++;
    return count;
  };
}

console.log("\n=== Closure Type Captures ===");
const counter = tsCreateCounter();
console.log(counter()); // 1
console.log(counter()); // 2

// ✅ TypeScript ensures captured variable types are preserved
const capturedClosure = ((initialValue: number) => {
  let value = initialValue;

  return {
    increment: (amount: number): number => {
      value += amount;
      return value;
    },
    getValue: (): number => value,
  };
})(10);

console.log(capturedClosure.increment(5)); // 15
console.log(capturedClosure.getValue()); // 15

// ============================================================================
// 3. GENERIC FUNCTIONS IN CLOSURES
// ============================================================================

// JavaScript: No generics, must handle any type
// function jsMemoize(fn) {
//   const cache = {};
//   return (...args) => { ... };
// }

// TypeScript: Generic memoization with type safety
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for ${key}`);
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

console.log("\n=== Generic Functions in Closures ===");
const memoizedAdd = memoize((a: number, b: number): number => a + b);
console.log(memoizedAdd(2, 3)); // Computes
console.log(memoizedAdd(2, 3)); // Cache hit

// ============================================================================
// 4. FUNCTION TYPE ALIASES FOR CLOSURES
// ============================================================================

// Type alias for closure patterns
type ClosureFactory<T, R> = (input: T) => () => R;
type LazyInitializer<T> = () => T;

// Generic lazy initializer factory
function createLazyInitializer<T>(factory: () => T): LazyInitializer<T> {
  let value: T | undefined;
  let initialized = false;

  return (): T => {
    if (!initialized) {
      value = factory();
      initialized = true;
    }
    return value!;
  };
}

console.log("\n=== Function Type Aliases ===");
const lazyExpensive = createLazyInitializer(() => {
  console.log("Computing expensive value...");
  return { data: [1, 2, 3], timestamp: Date.now() };
});

console.log(lazyExpensive()); // Computes
console.log(lazyExpensive()); // Returns cached

// ============================================================================
// 5. CONST ASSERTIONS FOR IMMUTABLE VALUES
// ============================================================================

// JavaScript: Object literals are mutable by default
// const config = { apiUrl: "https://api.example.com" };

// TypeScript: const assertions create deeply readonly types
const jsConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

const tsConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} as const;

console.log("\n=== Const Assertions ===");
console.log(jsConfig.apiUrl); // string type
console.log(tsConfig.apiUrl); // Literal type "https://api.example.com"

// ⚠️ PITFALL: Regular objects allow reassignment
// jsConfig.timeout = 10000; // ✅ OK in TS (if not readonly)
// tsConfig.timeout = 10000; // ❌ Error: Cannot assign to readonly

// ============================================================================
// 6. SATISFIES OPERATOR (TS 4.9+)
// ============================================================================

// TypeScript: satisfies operator for type validation without widening
type ConfigType = {
  name: string;
  value: number;
};

// Without satisfies - type is widened
const configWithoutSatisfies: ConfigType = {
  name: "test",
  value: 42,
};
// configWithoutSatisfies.name is just 'string'

// With satisfies - validates against ConfigType, but does NOT preserve literal
// types for properties constrained by the target type: name is still 'string'.
const configWithSatisfies = {
  name: "test",
  value: 42,
} satisfies ConfigType;
// configWithSatisfies.name is 'string' (widened by ConfigType.name: string)

console.log("\n=== Satisfies Operator ===");
console.log(configWithSatisfies.name); // Type: string (not the literal 'test')

// ============================================================================
// 7. TYPE GUARDS IN CLOSURES
// ============================================================================

// Type guard function
function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

// Closure with type narrowing
function createTypedValidator<T>(predicate: (value: unknown) => value is T) {
  return (value: unknown): value is T => {
    return predicate(value);
  };
}

console.log("\n=== Type Guards in Closures ===");
const validateNumber = createTypedValidator(isNumber);
console.log(validateNumber(42)); // true
console.log(validateNumber("42")); // false

// ============================================================================
// 8. TEMPORAL DEAD ZONE WITH TYPES
// ============================================================================

// TypeScript enforces TDZ at compile time for type usage
// Before declaration - type exists but value doesn't

interface Person {
  name: string;
  age: number;
}

function demonstrateTDZ(): void {
  // Type is available, but accessing variable before declaration is error

  // console.log(person); // ❌ ReferenceError if uncommented

  const person: Person = { name: "Bob", age: 30 };
  console.log(person);
}

console.log("\n=== TDZ with Types ===");
demonstrateTDZ();

// ============================================================================
// 9. SCOPE CHAIN TYPE INFERENCE
// ============================================================================

// TypeScript: Type inference through scope chain
interface GlobalContext {
  globalValue: string;
}

// Global scope type
declare const globalContext: GlobalContext;

// Nested scope with type shadowing
function demonstrateScopeChain(): void {
  const outerValue: number = 10;

  function innerFunction(): void {
    const innerValue: number = 20;

    // TypeScript resolves types through scope chain
    const combined = outerValue + innerValue; // number + number
    console.log("Scope chain sum:", combined);
  }

  innerFunction();
  // console.log(innerValue); // Error: innerValue is not accessible here
}

console.log("\n=== Scope Chain Type Inference ===");
demonstrateScopeChain();

// Variable shadowing with types
function demonstrateShadowing(): void {
  const value: string | number = "hello";

  if (true) {
    const value: number = 42; // Shadows outer 'value', different type allowed
    console.log("Inner shadowed value:", value); // Type is number
  }

  console.log("Outer value:", value); // Type is string | number
}

demonstrateShadowing();

// ============================================================================
// 10. MODULE SCOPE AND CLOSURES
// ============================================================================

// Module-level private state (simulated with closure)
const modulePrivateState = (() => {
  // Truly private due to closure
  let _privateData: Map<string, number> = new Map();

  return {
    get: (key: string): number | undefined => _privateData.get(key),
    set: (key: string, value: number): void => {
      _privateData.set(key, value);
    },
    has: (key: string): boolean => _privateData.has(key),
    clear: (): void => {
      _privateData.clear();
    },
  };
})();

console.log("\n=== Module Scope Pattern ===");
modulePrivateState.set("counter", 0);
modulePrivateState.set("max", 100);
console.log(modulePrivateState.get("counter")); // 0

// ============================================================================
// 11. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Scope & Closures ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Type inference             │       ✗         │       ✓         │
│ Generic closures           │       ✗         │       ✓         │
│ Type-safe memoization      │       ✗         │       ✓         │
│ Const assertions           │       ✗         │       ✓         │
│ Satisfies operator         │       ✗         │       ✓         │
│ Type guards                │       ✗         │       ✓         │
│ Function type aliases      │       ✗         │       ✓         │
│ Block-scoped types         │       ✗         │       ✓         │
│ Scope chain type inference │       ✗         │       ✓         │
│ Variable shadowing safety  │  Runtime only   │  Compile-time  │
│ Runtime behavior           │    Same         │    Same         │
│ Closure mechanics          │    Same         │    Same         │
│ TDZ behavior               │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time type safety to closures
2. Runtime behavior is identical to JavaScript
3. Generic closures preserve type information
4. const assertions create deeply immutable types
5. satisfies operator preserves literal types
6. Scope chain type inference through nested functions
7. Type-safe variable shadowing with different types
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
