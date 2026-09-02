// TypeScript vs JavaScript: JSON Comparison
// 📘 For JavaScript examples, see: 11-json.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
// 🎯 Difficulty: Beginner
export {};

// ============================================================================
// 1. JSON.PARSE RETURNS any — ANNOTATE unknown FOR SAFETY
// ============================================================================

// JavaScript: Returns any type, no type information
// const jsParsed = JSON.parse('{"name": "Alice", "age": 30}');
// jsParsed.anything; // No error, but might be undefined at runtime

// TypeScript: JSON.parse() is declared to return any (lib.es5.d.ts), so by
// default it gives NO type safety. Annotate the result as unknown to opt in:
const jsonString = '{"name": "Alice", "age": 30}';
const parsed: unknown = JSON.parse(jsonString); // explicit unknown annotation

console.log("=== JSON.parse Returns any (annotate as unknown) ===");
console.log("Parsed value:", parsed);

// ⚠️ With the unknown annotation you can't use the value without narrowing:
// console.log(parsed.name); // ❌ Error: Object is of type 'unknown'
// (Without the annotation, parsed would be any and this would silently compile.)

// ✅ SOLUTION: Type assertion (quick but less safe)
interface Person {
  name: string;
  age: number;
}

const personAsserted = JSON.parse(jsonString) as Person;
console.log("With assertion:", personAsserted.name, personAsserted.age);

// ============================================================================
// 2. TYPE ASSERTIONS FOR PARSED JSON
// ============================================================================

console.log("\n=== Type Assertions for Parsed JSON ===");

// Simple type assertion
interface User {
  id: number;
  username: string;
  email: string;
}

const userJson = '{"id": 1, "username": "alice", "email": "alice@example.com"}';
const user = JSON.parse(userJson) as User;
console.log("User:", user);

// Array type assertion
const usersJson = '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]';
interface SimpleUser {
  id: number;
  name: string;
}
const users = JSON.parse(usersJson) as SimpleUser[];
console.log("Users array:", users);

// Nested type assertion
interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Customer {
  id: number;
  name: string;
  address: Address;
}

const customerJson = `{
  "id": 1,
  "name": "Alice",
  "address": {
    "street": "123 Main St",
    "city": "NYC",
    "zipCode": "10001"
  }
}`;
const customer = JSON.parse(customerJson) as Customer;
console.log("Customer address:", customer.address.city);

// ⚠️ PITFALL: Type assertions don't validate at runtime
const invalidJson = '{"id": "not-a-number", "username": 123}';
const wronglyTyped = JSON.parse(invalidJson) as User; // No error at parse time
console.log("Wrongly typed (no runtime error):", wronglyTyped);
// But accessing wronglyTyped.id as number would fail

// ============================================================================
// 3. TYPE GUARDS FOR JSON VALIDATION
// ============================================================================

console.log("\n=== Type Guards for JSON Validation ===");

// Basic type guard function
function isPerson(obj: unknown): obj is Person {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    typeof (obj as Record<string, unknown>).name === "string" &&
    "age" in obj &&
    typeof (obj as Record<string, unknown>).age === "number"
  );
}

const maybePerson = JSON.parse('{"name": "Alice", "age": 30}');
if (isPerson(maybePerson)) {
  console.log("Valid person:", maybePerson.name, maybePerson.age);
} else {
  console.log("Invalid person data");
}

// More comprehensive user type guard
function isUser(obj: unknown): obj is User {
  if (typeof obj !== "object" || obj === null) return false;

  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === "number" &&
    typeof record.username === "string" &&
    typeof record.email === "string"
  );
}

const maybeUser = JSON.parse(userJson);
if (isUser(maybeUser)) {
  console.log("Valid user:", maybeUser.username);
} else {
  console.log("Invalid user data");
}

// Array type guard
function isUserArray(obj: unknown): obj is User[] {
  return Array.isArray(obj) && obj.every(isUser);
}

const maybeUsers = JSON.parse('[{"id": 1, "username": "a", "email": "a@a.com"}]');
if (isUserArray(maybeUsers)) {
  console.log("Valid users count:", maybeUsers.length);
}

// ============================================================================
// 4. INTERFACE DEFINITIONS FOR JSON DATA
// ============================================================================

console.log("\n=== Interface Definitions for JSON Data ===");

// API Response interfaces
interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  error?: string;
  timestamp: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

const successResponse: ApiResponse<Product> = {
  status: "success",
  data: {
    id: 1,
    name: "Laptop",
    price: 999.99,
    inStock: true,
  },
  timestamp: new Date().toISOString(),
};

// Serialize with known structure
const serialized = JSON.stringify(successResponse);
console.log("Serialized response:", serialized.slice(0, 100) + "...");

// Parse with proper typing
const parsedResponse = JSON.parse(serialized) as ApiResponse<Product>;
if (parsedResponse.status === "success" && parsedResponse.data) {
  console.log("Product:", parsedResponse.data.name, "-", parsedResponse.data.price);
}

// Discriminated union for response handling
type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

function handleApiResult<T>(json: string): ApiResult<T> {
  try {
    const parsed = JSON.parse(json) as {
      success: boolean;
      data?: T;
      error?: string;
    };
    if (parsed.success && parsed.data !== undefined) {
      return { success: true, data: parsed.data };
    } else {
      return { success: false, error: parsed.error || "Unknown error" };
    }
  } catch (e) {
    return { success: false, error: "Invalid JSON" };
  }
}

// ============================================================================
// 5. JSON.STRINGIFY RETURN TYPE
// ============================================================================

console.log("\n=== JSON.stringify Return Type ===");

// TypeScript knows JSON.stringify always returns string
const obj = { name: "Alice", age: 30 };
const json: string = JSON.stringify(obj);
console.log("Type is string:", typeof json);

// With indentation
const prettyJson: string = JSON.stringify(obj, null, 2);
console.log("Pretty JSON:\n", prettyJson);

// Replacer function with types
interface SensitiveData {
  name: string;
  password: string;
  apiKey: string;
  email: string;
}

const sensitive: SensitiveData = {
  name: "Alice",
  password: "secret123",
  apiKey: "sk-xxx",
  email: "alice@example.com",
};

type ReplacerFn = (key: string, value: unknown) => unknown;

const safeReplacer: ReplacerFn = (key, value) => {
  if (key === "password" || key === "apiKey") {
    return "[REDACTED]";
  }
  return value;
};

const safeJson = JSON.stringify(sensitive, safeReplacer, 2);
console.log("Sanitized JSON:\n", safeJson);

// ============================================================================
// 6. HANDLING UNKNOWN TYPES FROM JSON
// ============================================================================

console.log("\n=== Handling Unknown Types from JSON ===");

// Safe parsing with unknown
function safeParse<T>(json: string, validator: (obj: unknown) => obj is T): T | null {
  try {
    const parsed: unknown = JSON.parse(json);
    if (validator(parsed)) {
      return parsed;
    }
    console.error("Validation failed");
    return null;
  } catch (e) {
    console.error("Parse error:", e);
    return null;
  }
}

// Usage
const validJson = '{"name": "Alice", "age": 30}';
const invalidPersonJson = '{"name": "Bob"}'; // Missing age

const validPerson = safeParse(validJson, isPerson);
console.log("Valid parse:", validPerson);

const invalidPerson = safeParse(invalidPersonJson, isPerson);
console.log("Invalid parse:", invalidPerson);

// Assertion function for strict validation
function assertPerson(obj: unknown): asserts obj is Person {
  if (!isPerson(obj)) {
    throw new Error("Object is not a valid Person");
  }
}

// Usage with try-catch
try {
  const parsed: unknown = JSON.parse(validJson);
  assertPerson(parsed);
  console.log("Asserted person:", parsed.name); // Type-safe access
} catch (e) {
  console.error("Assertion failed");
}

// ============================================================================
// 7. REVIVER/REPLACER FUNCTION TYPES
// ============================================================================

console.log("\n=== Reviver/Replacer Function Types ===");

// Reviver function - restore Date objects
type ReviverFn = (key: string, value: unknown) => unknown;

const dateReviver: ReviverFn = (key, value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
};

const dateJson = '{"title": "Meeting", "date": "2024-06-15T10:00:00.000Z"}';
const withDate = JSON.parse(dateJson, dateReviver);
console.log("Restored date:", withDate.date instanceof Date);
console.log("Date value:", withDate.date);

// Generic reviver for multiple types
interface TypeTagged {
  __type: string;
  [key: string]: unknown;
}

const genericReviver: ReviverFn = (key, value) => {
  if (value && typeof value === "object" && "__type" in value) {
    const tagged = value as TypeTagged;
    switch (tagged.__type) {
      case "Date":
        return new Date(tagged.value as string);
      case "RegExp":
        return new RegExp(tagged.source as string, tagged.flags as string);
      case "Set":
        return new Set(tagged.values as unknown[]);
      case "Map":
        return new Map(tagged.entries as [unknown, unknown][]);
      default:
        return value;
    }
  }
  return value;
};

const complexJson = JSON.stringify({
  created: { __type: "Date", value: "2024-01-15T10:00:00.000Z" },
  pattern: { __type: "RegExp", source: "test", flags: "g" },
  tags: { __type: "Set", values: ["a", "b", "c"] },
});

const restored = JSON.parse(complexJson, genericReviver);
console.log("Restored types:", {
  date: restored.created instanceof Date,
  regex: restored.pattern instanceof RegExp,
  set: restored.tags instanceof Set,
});

// ============================================================================
// 8. UTILITY TYPES FOR JSON
// ============================================================================

console.log("\n=== Utility Types for JSON ===");

// JSON-safe type (serializable types)
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

// Helper to ensure values are JSON-safe
function ensureJsonSafe<T extends Record<string, unknown>>(obj: T): JSONValue {
  return JSON.parse(JSON.stringify(obj)) as JSONValue;
}

// Jsonify type - converts to JSON-safe version
type Jsonify<T> = T extends { toJSON(): infer J }
  ? J
  : T extends object
    ? { [K in keyof T]: Jsonify<T[K]> }
    : T;

// Usage example
interface ComplexObject {
  name: string;
  date: Date;
  regex: RegExp;
  func: () => void;
}

const complex: ComplexObject = {
  name: "test",
  date: new Date(),
  regex: /test/g,
  func: () => {},
};

const jsonified = JSON.parse(JSON.stringify(complex)) as Jsonify<ComplexObject>;
// date becomes string, regex becomes {}, func is omitted
console.log("Jsonified:", jsonified);

// ============================================================================
// 9. COMMON PITFALLS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Runtime vs compile-time type mismatch
interface StrictUser {
  id: number;
  name: string;
}

const badJson = '{"id": "abc", "name": 123}';
const badUser = JSON.parse(badJson) as StrictUser;
// No compile error, but types are wrong at runtime
console.log("Wrong types (id is string):", typeof badUser.id);
console.log("Wrong types (name is number):", typeof badUser.name);

// PITFALL 2: undefined becomes null in arrays
const withUndefined = { items: [1, undefined, 3] };
const serializedUndefined = JSON.stringify(withUndefined);
console.log("undefined in object:", serializedUndefined); // omitted

const arrayWithUndefined = [1, undefined, 3];
const serializedArray = JSON.stringify(arrayWithUndefined);
console.log("undefined in array:", serializedArray); // becomes null

// PITFALL 3: Circular references
const circular: Record<string, unknown> = { name: "Circular" };
circular.self = circular;
try {
  JSON.stringify(circular);
} catch (e) {
  console.log("Circular reference error:", (e as Error).message);
}

// PITFALL 4: BigInt serialization
const withBigInt = { id: 9007199254740993n };
try {
  JSON.stringify(withBigInt);
} catch (e) {
  console.log("BigInt error:", (e as Error).message);
}

// ✅ SOLUTION: Custom toJSON for BigInt
// (BigInt.prototype as any).toJSON = function() {
//   return { __type: "BigInt", value: this.toString() };
// };

// PITFALL 5: Loss of methods and prototypes
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  greet() {
    return `Hello, ${this.name}`;
  }
}

const person = new Person("Alice");
const personJson = JSON.stringify(person);
const restoredPerson = JSON.parse(personJson) as { name: string };
console.log("Restored person (no methods):", restoredPerson);
// restoredPerson.greet(); // ❌ Error: greet doesn't exist

// ============================================================================
// 10. VALIDATION LIBRARY PATTERNS (Conceptual)
// ============================================================================

console.log("\n=== Validation Patterns ===");

// Simple validation schema type
type Validator<T> = (value: unknown) => value is T;

// Schema builder interface
interface Schema<T> {
  parse: (value: unknown) => T;
  safeParse: (value: unknown) => { success: true; data: T } | { success: false; error: string };
}

// Example: Simple string validator
const stringSchema: Schema<string> = {
  parse: value => {
    if (typeof value !== "string") throw new Error("Expected string");
    return value;
  },
  safeParse: value => {
    if (typeof value !== "string") {
      return { success: false, error: "Expected string" };
    }
    return { success: true, data: value };
  },
};

// Example: Object schema builder
function objectSchema<T extends Record<string, Schema<any>>>(
  shape: T
): Schema<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> {
  return {
    parse: value => {
      if (typeof value !== "object" || value === null) {
        throw new Error("Expected object");
      }
      const result: Record<string, unknown> = {};
      for (const [key, schema] of Object.entries(shape)) {
        const objValue = (value as Record<string, unknown>)[key];
        result[key] = (schema as Schema<unknown>).parse(objValue);
      }
      return result as any;
    },
    safeParse: value => {
      try {
        return { success: true, data: objectSchema(shape).parse(value) };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    },
  };
}

// Usage
const userSchema = objectSchema({
  id: stringSchema,
  name: stringSchema,
});

const validData = { id: "123", name: "Alice" };
const result = userSchema.safeParse(validData);
console.log("Schema validation:", result);

// ============================================================================
// 11. BEST PRACTICES SUMMARY
// ============================================================================

/*
✅ DO:
1. Define interfaces for expected JSON structures
2. Use type guards to validate parsed JSON at runtime
3. Handle the unknown return type from JSON.parse()
4. Use discriminated unions for API responses
5. Implement reviver functions for Date restoration
6. Use JSONValue type for JSON-safe data structures
7. Validate external JSON before type assertions
8. Use safeParse patterns with proper error handling
9. Document expected JSON schemas with interfaces
10. Consider validation libraries (Zod, io-ts, Yup) for production

❌ DON'T:
1. Use type assertions without runtime validation
2. Trust JSON from external sources without validation
3. Forget that JSON.parse() returns any (annotate results as unknown)
4. Ignore that type assertions don't validate
5. Try to serialize functions, undefined, or circular references
6. Assume BigInt will serialize (it won't)
7. Forget methods are lost during serialization
8. Use any instead of unknown for parsed JSON
9. Skip error handling for malformed JSON
10. Mix Date objects without reviver/replacer functions

⚠️ WATCH OUT FOR:
1. Runtime type mismatches after type assertions
2. undefined becomes null in arrays, omitted in objects
3. NaN and Infinity become null in JSON
4. Date objects serialize to ISO strings
5. Map, Set, WeakMap, WeakSet serialize to {}
6. Symbol keys are omitted from objects
7. Circular references cause errors
8. BigInt causes serialization errors
9. Prototype chain and methods are lost
10. JSON keys are always strings

🎯 MIGRATION TIPS: JS → TS
1. Replace any with unknown for parsed JSON
2. Define interfaces for all JSON structures
3. Add type guards for runtime validation
4. Use type assertions only after validation
5. Implement proper error handling
6. Use reviver functions for complex types
7. Create safe parsing wrapper functions
8. Document expected JSON schemas
9. Use discriminated unions for API responses
10. Consider validation libraries for complex cases

📘 SUMMARY: TYPESCRIPT BENEFITS FOR JSON
✅ unknown type forces proper handling
✅ Interfaces document expected structures
✅ Type guards enable runtime validation
✅ Catch type errors at compile time
✅ Better IDE autocomplete
✅ Self-documenting code
✅ Discriminated unions for type-safe responses
✅ Generic patterns for reusable validators

⚠️ Type assertions don't validate at runtime
⚠️ Additional code for type guards
⚠️ Learning curve for validation patterns

🎯 RECOMMENDATION: Always validate external JSON!
*/

// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript JSON ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ JSON.parse/stringify       │       ✓         │       ✓         │
│ Opt-in unknown parsing     │       ✗         │       ✓         │
│ Type assertions            │       ✗         │       ✓         │
│ Type guards                │       ✗         │       ✓         │
│ Interface definitions      │       ✗         │       ✓         │
│ Compile-time validation    │       ✗         │       ✓         │
│ Reviver/Replacer types     │       ✗         │       ✓         │
│ Discriminated unions       │       ✗         │       ✓         │
│ Generic validators         │       ✗         │       ✓         │
│ Runtime validation         │  Manual         │  Type guards    │
│ Runtime behavior           │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. JSON.parse() returns any — annotate results as unknown for safety
2. Type assertions provide compile-time safety only
3. Type guards enable runtime validation
4. Interfaces document expected JSON structures
5. Discriminated unions handle API responses safely
6. Runtime behavior is identical to JavaScript
7. Always validate external JSON data
`);

console.log("\n=== TypeScript provides type safety at compile time ===");
console.log("=== But runtime validation is essential for external data ===");
