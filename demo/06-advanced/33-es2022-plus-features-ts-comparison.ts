// TypeScript vs JavaScript: ES2022+ Features Comparison
// 📘 For JavaScript examples, see: 33-es2022-plus-features.js
// This file demonstrates TypeScript-specific type features for modern ECMAScript

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// ES2022 Features - TypeScript Enhancements
// ============================================

console.log("=== Error.cause - Type Safety ===\n");

// Error.cause with proper typing
interface ErrorWithCause extends Error {
  cause?: unknown;
}

function connectDatabase(): never {
  throw new Error("Connection timeout");
}

function initializeApp(): never {
  try {
    connectDatabase();
  } catch (originalError) {
    // TypeScript knows cause is optional and typed as unknown
    throw new Error("Failed to initialize app", { cause: originalError });
  }
}

try {
  initializeApp();
} catch (error) {
  if (error instanceof Error) {
    console.log("Error message:", error.message);
    console.log("Original cause:", (error as ErrorWithCause).cause);
  }
}

console.log("\n=== Top-level await - Module System ===\n");

// TypeScript enforces module type for top-level await
// tsconfig.json must have: "module": "ES2022" or higher
// File must have .mts extension or "type": "module" in package.json

console.log(`
TypeScript requirements for top-level await:
- module: "ES2022" or "ESNext" in tsconfig.json
- File extension: .mts or .ts with "type": "module"
- Async context is automatically inferred
`);

console.log("\n=== .at() Method - Type Inference ===\n");

const arr: number[] = [10, 20, 30, 40, 50];

// TypeScript infers return type as number | undefined
const first: number | undefined = arr.at(0);
const last: number | undefined = arr.at(-1);

console.log("Type-safe .at() method:");
console.log("arr.at(0):", first);
console.log("arr.at(-1):", last);

// Type narrowing with null check
if (last !== undefined) {
  const doubled: number = last * 2; // TypeScript knows last is number here
  console.log("Doubled:", doubled);
}

console.log("\n=== Object.hasOwn() - Type Predicate ===\n");

interface User {
  name: string;
  age: number;
}

const obj: User = { name: "Alice", age: 30 };

// TypeScript provides type-safe property checking
if (Object.hasOwn(obj, "name")) {
  // TypeScript knows the property exists
  console.log("Name:", obj.name);
}

// Type guard pattern
function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return Object.hasOwn(obj, key);
}

const maybeUser = { name: "Bob" } as object;
if (hasProperty(maybeUser, "name")) {
  // TypeScript narrows the type
  console.log("User name:", (maybeUser as any).name);
}

console.log("\n=== RegExp /d Flag - Typed Indices ===\n");

const text = "2023-12-25";
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/d;
const match = dateRegex.exec(text);

if (match?.indices?.groups) {
  // TypeScript knows indices structure
  const yearIndices: [number, number] = match.indices.groups.year;
  console.log("Year indices:", yearIndices);
}

// ============================================
// ES2023 Features - TypeScript Enhancements
// ============================================

console.log("\n=== Immutable Array Methods - Type Preservation ===\n");

const numbers: readonly number[] = [3, 1, 4, 1, 5];

// TypeScript preserves array type through immutable methods
const sorted: number[] = numbers.toSorted();
const reversed: number[] = numbers.toReversed();
const modified: number[] = numbers.with(2, 99);

console.log("Original:", numbers);
console.log("Sorted:", sorted);
console.log("Reversed:", reversed);
console.log("Modified:", modified);

// Type-safe with readonly arrays
const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.sort(); // Error: Property 'sort' does not exist
const sortedReadonly = readonlyArr.toSorted(); // OK

console.log("\n=== findLast/findLastIndex - Type Inference ===\n");

interface Item {
  id: number;
  active: boolean;
}

const items: Item[] = [
  { id: 1, active: false },
  { id: 2, active: true },
  { id: 3, active: true }
];

// TypeScript infers return type as Item | undefined
const lastActive: Item | undefined = items.findLast(item => item.active);
const lastActiveIndex: number = items.findLastIndex(item => item.active);

console.log("Last active:", lastActive);
console.log("Last active index:", lastActiveIndex);

// ============================================
// ES2024 Features - TypeScript Enhancements
// ============================================

console.log("\n=== Object.groupBy / Map.groupBy - Generic Types ===\n");

interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 }
];

// TypeScript infers grouped type
const groupedByAge: Partial<Record<number, Person[]>> = Object.groupBy(
  people,
  person => person.age
);

// Map.groupBy with proper typing
const mapGrouped: Map<number, Person[]> = Map.groupBy(
  people,
  person => person.age
);

console.log("Grouped by age:", groupedByAge);
console.log("Map grouped:", mapGrouped);

// Type-safe access
const age25Group: Person[] | undefined = groupedByAge[25];
if (age25Group) {
  age25Group.forEach(person => console.log(person.name));
}

console.log("\n=== Promise.withResolvers() - Typed Resolvers ===\n");

// TypeScript provides generic type for Promise.withResolvers
interface TaskResult {
  success: boolean;
  data: string;
}

const { promise, resolve, reject } = Promise.withResolvers<TaskResult>();

// resolve and reject are properly typed
resolve({ success: true, data: "completed" }); // OK
// resolve({ success: true }); // Error: Property 'data' is missing

// Type-safe async queue
class TypedAsyncQueue<T> {
  private queue: Array<{
    item: T;
    resolve: (value: T) => void;
  }> = [];

  enqueue(item: T): Promise<T> {
    const { promise, resolve } = Promise.withResolvers<T>();
    this.queue.push({ item, resolve });
    return promise;
  }

  dequeue(): T | null {
    const entry = this.queue.shift();
    if (entry) {
      entry.resolve(entry.item);
      return entry.item;
    }
    return null;
  }
}

// ============================================
// ES2025 Features - TypeScript Enhancements
// ============================================

console.log("\n=== ES2025 Features - TypeScript Enhancements ===\n");

console.log("Set Methods - Type Preservation:\n");

// Note: ES2025 Set methods require lib: ["ESNext"] in tsconfig.json
const setA: Set<number> = new Set([1, 2, 3, 4]);
const setB: Set<number> = new Set([3, 4, 5, 6]);

// TypeScript preserves Set<number> type (requires ESNext)
// const union: Set<number> = setA.union(setB);
// const intersection: Set<number> = setA.intersection(setB);
// const difference: Set<number> = setA.difference(setB);

console.log("Set methods (union, intersection, difference) require ESNext lib");
console.log("Example: setA.union(setB) returns Set<number>");

// Type-safe with generic sets
class TypedSet<T> extends Set<T> {
  // Additional type-safe methods
  hasAll(...items: T[]): boolean {
    return items.every(item => this.has(item));
  }
}

const typedSet = new TypedSet<number>([1, 2, 3]);
console.log("Has all [1, 2]:", typedSet.hasAll(1, 2));

console.log("\n=== Iterator Helpers - Type Inference ===\n");

// TypeScript infers types through iterator chain
function* numbersIterator(): Generator<number> {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

// Type inference works through chained operations
const iter = numbersIterator();
// const result: number[] = iter
//   .map(x => x * 2)
//   .filter(x => x > 5)
//   .take(2)
//   .toArray();

console.log("Iterator helpers provide full type inference");

console.log("\n=== Resource Management - Disposable Interface ===\n");

// TypeScript 5.2+ Disposable interface (requires lib: ["ESNext"])
// Note: Symbol.dispose and Symbol.asyncDispose require ESNext target
// interface Disposable {
//   [Symbol.dispose](): void;
// }

// interface AsyncDisposable {
//   [Symbol.asyncDispose](): Promise<void>;
// }

// Example Disposable class (requires ESNext lib)
console.log(`
Disposable pattern example (requires lib: ["ESNext"]):

class TypedFileHandle implements Disposable {
  constructor(private filename: string) {
    console.log(\`Opening file: \${filename}\`);
  }

  write(data: string): void {
    console.log(\`Writing to \${this.filename}: \${data}\`);
  }

  [Symbol.dispose](): void {
    console.log(\`Closing file: \${this.filename}\`);
  }
}
`);

// using declaration with type safety
// {
//   using file = new TypedFileHandle("data.txt");
//   file.write("Hello, World!");
//   // file is automatically disposed at end of block
// }

// Async disposal example (requires ESNext lib)
console.log(`
Async Disposable example:

class TypedDatabaseConnection implements AsyncDisposable {
  async [Symbol.asyncDispose](): Promise<void> {
    console.log('Disconnecting from database');
  }
}
`);

// DisposableStack with type safety
// const stack = new DisposableStack();
// stack.use(new TypedFileHandle("file1.txt"));
// stack.defer(() => console.log("Custom cleanup"));

// ============================================
// TypeScript-Specific Features
// ============================================

console.log("\n=== TypeScript-Specific Enhancements ===\n");

// 1. satisfies operator (TS 4.9)
type Config = {
  port: number;
  host: string;
};

const config = {
  port: 8080,
  host: "localhost"
} satisfies Config;

// Preserves literal types while type-checking
// const port: 8080 = config.port; // Literal type preserved with satisfies

console.log("satisfies operator preserves literal types");

// 2. const type parameters (TS 5.0)
function identity<const T>(value: T): T {
  return value;
}

const result = identity([1, 2, 3] as const);
// result type: readonly [1, 2, 3] (literal types preserved)

console.log("const type parameters preserve literal types");

// 3. Type-safe groupBy
function typedGroupBy<T, K extends PropertyKey>(
  items: T[],
  keyFn: (item: T) => K
): Partial<Record<K, T[]>> {
  return Object.groupBy(items, keyFn);
}

// 4. Iterator helper types
type IteratorHelper<T> = {
  map<U>(fn: (value: T) => U): IteratorHelper<U>;
  filter(fn: (value: T) => boolean): IteratorHelper<T>;
  take(n: number): IteratorHelper<T>;
  toArray(): T[];
};

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use satisfies for type-checking without widening");
console.log("2. Use const type parameters to preserve literal types");
console.log("3. Leverage type inference in iterator chains");
console.log("4. Implement Disposable interface for resource management");
console.log("5. Use generic types with groupBy and Promise.withResolvers");

console.log("\n❌ DON'T:");
console.log("1. Don't use any with new ES features");
console.log("2. Don't ignore undefined in .at() return type");
console.log("3. Don't forget to enable ES2022+ in tsconfig.json");
console.log("4. Don't use type assertions when type inference works");
