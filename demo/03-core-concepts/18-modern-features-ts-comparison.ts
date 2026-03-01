// TypeScript vs JavaScript: Modern Features Comparison
// 📘 For JavaScript examples, see: 18-modern-features.js
// This file demonstrates TypeScript-specific typing for modern ES features

export {};

// ============================================================================
// 1. TEMPLATE LITERAL TYPES
// ============================================================================

// JavaScript: Template literals at runtime only
// const greeting = `Hello, ${name}!`;

// TypeScript: Template literal types at type level
type GreetingTemplate<T extends string> = `Hello, ${T}!`;

type Message = GreetingTemplate<"Alice">; // "Hello, Alice!"

// Union types with template literals
type EventType = "click" | "scroll" | "keydown";
type EventName = `${EventType}Event`; // "clickEvent" | "scrollEvent" | "keydownEvent"

console.log("=== Template Literal Types ===");
const event: EventName = "clickEvent";
console.log(event);

// Complex template literal types
type HttpStatusCode = 200 | 301 | 404 | 500;
type StatusResponse<T extends HttpStatusCode> = {
  status: T;
  message: T extends 200 ? "OK" :
           T extends 301 ? "Moved" :
           T extends 404 ? "Not Found" : "Error";
};

const okResponse: StatusResponse<200> = { status: 200, message: "OK" };
const notFound: StatusResponse<404> = { status: 404, message: "Not Found" };


// ============================================================================
// 2. OPTIONAL CHAINING TYPES
// ============================================================================

// JavaScript: Optional chaining at runtime
// const value = obj?.property?.nested;

// TypeScript: Optional chaining with proper null handling
interface NestedObject {
  a?: {
    b?: {
      c: string;
    };
  };
}

function safeAccess(obj: NestedObject): string | undefined {
  return obj?.a?.b?.c;
}

console.log("\n=== Optional Chaining Types ===");
console.log(safeAccess({ a: { b: { c: "value" } } })); // "value"
console.log(safeAccess({})); // undefined

// Optional chaining with method calls
interface ApiClient {
  getData?(): Promise<{ value: string }>;
}

async function fetchData(client: ApiClient): Promise<string | undefined> {
  return (await client.getData?.())?.value;
}


// ============================================================================
// 3. NULLISH COALESCING WITH TYPES
// ============================================================================

// JavaScript: Nullish coalescing operator
// const value = input ?? defaultValue;

// TypeScript: Proper type inference with nullish coalescing
function getConfig(
  userConfig: Partial<{ port: number; timeout: number }> = {},
  defaults: { port: number; timeout: number }
): { port: number; timeout: number } {
  return {
    port: userConfig.port ?? defaults.port,
    timeout: userConfig.timeout ?? defaults.timeout
  };
}

console.log("\n=== Nullish Coalescing Types ===");
const config = getConfig(
  { port: 8080 },
  { port: 3000, timeout: 5000 }
);
console.log(config); // { port: 8080, timeout: 5000 }

// Type narrowing with nullish coalescing
type MaybeString = string | null | undefined;

function getString(value: MaybeString, fallback: string): string {
  return value ?? fallback;
}


// ============================================================================
// 4. CONST ASSERTIONS
// ============================================================================

// JavaScript: Object literals are mutable
// const config = { apiUrl: "https://api.example.com" };

// TypeScript: const assertions create literal types
const mutableConfig = {
  apiUrl: "https://api.example.com",
  methods: ["GET", "POST"]
};

const immutableConfig = {
  apiUrl: "https://api.example.com",
  methods: ["GET", "POST"]
} as const;

console.log("\n=== Const Assertions ===");
// mutableConfig.apiUrl = "changed"; // ✅ OK if type allows
// immutableConfig.apiUrl = "changed"; // ❌ Error: readonly property

// Type inference difference
type MutableType = typeof mutableConfig;
// { apiUrl: string; methods: string[] }

type ImmutableType = typeof immutableConfig;
// { readonly apiUrl: "https://api.example.com"; readonly methods: readonly ["GET", "POST"] }


// ============================================================================
// 5. SATISFIES OPERATOR (TS 4.9+)
// ============================================================================

// TypeScript: satisfies operator for type validation without widening
type RouteConfig = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: (req: unknown) => Promise<void>;
};

// Without satisfies - type is widened
const routesWithoutSatisfies: Record<string, RouteConfig> = {
  "/users": {
    path: "/users",
    method: "GET",
    handler: async () => {}
  }
};
// routesWithoutSatisfies["/users"].method is just "GET" | "POST" | "PUT" | "DELETE"

// With satisfies - preserves literal types
const routes = {
  "/users": {
    path: "/users",
    method: "GET",
    handler: async () => {}
  },
  "/posts": {
    path: "/posts",
    method: "POST",
    handler: async () => {}
  }
} satisfies Record<string, RouteConfig>;

console.log("\n=== Satisfies Operator ===");
// routes["/users"].method has literal type "GET"
// routes["/posts"].method has literal type "POST"


// ============================================================================
// 6. INFER TYPE KEYWORD
// ============================================================================

// TypeScript: infer keyword for conditional types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type PromiseValue<T> = T extends Promise<infer V> ? V : never;

type ArrayElement<T> = T extends (infer E)[] ? E : never;

// Complex inference
type FirstArgument<T> = T extends (arg: infer A, ...args: any[]) => any ? A : never;

console.log("\n=== Infer Keyword ===");
type MyFunction = (x: number, y: string) => boolean;
type MyReturn = ReturnType<MyFunction>; // boolean
type MyFirstArg = FirstArgument<MyFunction>; // number


// ============================================================================
// 7. CONDITIONAL TYPES
// ============================================================================

// TypeScript: Conditional types for type-level logic
type IsString<T> = T extends string ? true : false;

type StringCheck1 = IsString<"hello">; // true
type StringCheck2 = IsString<42>; // false

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type ArrayOfString = ToArray<string>; // string[]
type ArrayOfUnion = ToArray<string | number>; // string[] | number[]

// Exclude utility type (built-in conditional)
type LiteralUnion = "a" | "b" | "c" | 1 | 2;
type OnlyStrings = Exclude<LiteralUnion, number>; // "a" | "b" | "c"

console.log("\n=== Conditional Types ===");


// ============================================================================
// 8. NON-NULL ASSERTION OPERATOR
// ============================================================================

// TypeScript: Non-null assertion (!) operator
interface User {
  name: string;
  email?: string | null;
}

function getUserEmail(user: User): string {
  // Tell TypeScript we know this isn't null/undefined
  return user.email!;
}

// Use with caution - can cause runtime errors if wrong
function safeGetUserEmail(user: User): string | undefined {
  return user.email ?? undefined;
}

console.log("\n=== Non-null Assertion ===");
console.log("Use ! operator when you know a value isn't null/undefined");
console.log("But prefer proper null checks in most cases");


// ============================================================================
// 9. TYPE PREDICATES AND ASSERTION FUNCTIONS
// ============================================================================

// Type predicate for custom type guards
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird): void {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows pet is Fish
  } else {
    pet.fly(); // TypeScript knows pet is Bird
  }
}

// Assertion functions (TS 3.7+)
function assertIsDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
}

console.log("\n=== Type Predicates and Assertions ===");


// ============================================================================
// 10. AS CONST VS AS TYPE
// ============================================================================

// Different ways to type expressions
const arr1 = [1, 2, 3];           // number[]
const arr2 = [1, 2, 3] as const;  // readonly [1, 2, 3]
const arr3 = [1, 2, 3] as number[]; // number[] (explicit)

const obj1 = { a: 1 };            // { a: number }
const obj2 = { a: 1 } as const;   // { readonly a: 1 }
const obj3 = { a: 1 } as { a: number }; // { a: number } (explicit)

console.log("\n=== as const vs as Type ===");
console.log("as const - Creates deeply readonly literal types");
console.log("as Type - Asserts specific type (use sparingly)");


// ============================================================================
// 11. BRAND/TAGGED TYPES
// ============================================================================

// TypeScript: Branding types for nominal typing
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getOrder(id: OrderId): void {
  console.log(`Getting order ${id}`);
}

console.log("\n=== Brand/Tagged Types ===");
const userId = createUserId("user-123");
// getOrder(userId); // ❌ Error: UserId is not assignable to OrderId


// ============================================================================
// 12. OPAQUE TYPES PATTERN
// ============================================================================

// TypeScript: Opaque types using unique symbols
declare const opaque: unique symbol;

type Opaque<T, Tag> = T & { [opaque]: Tag };

type Celsius = Opaque<number, "Celsius">;
type Fahrenheit = Opaque<number, "Fahrenheit">;

function createCelsius(value: number): Celsius {
  return value as Celsius;
}

function createFahrenheit(value: number): Fahrenheit {
  return value as Fahrenheit;
}

function celsiusToFahrenheit(c: Celsius): Fahrenheit {
  return ((c as number) * 9/5 + 32) as Fahrenheit;
}

console.log("\n=== Opaque Types Pattern ===");
const temp = createCelsius(25);
console.log(celsiusToFahrenheit(temp));


// ============================================================================
// 13. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Modern Features ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Template literal types     │       ✗         │       ✓         │
│ Optional chaining types    │  Runtime only   │  Type narrowing│
│ Nullish coalescing types   │  Runtime only   │  Type inference│
│ Const assertions           │       ✗         │       ✓         │
│ Satisfies operator         │       ✗         │       ✓         │
│ Infer keyword              │       ✗         │       ✓         │
│ Conditional types          │       ✗         │       ✓         │
│ Type predicates            │       ✗         │       ✓         │
│ Brand/opaque types         │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Optional chaining          │    Same         │    Same         │
│ Nullish coalescing         │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds type-level template literals
2. Optional chaining integrates with null checking
3. Const assertions preserve literal types
4. Satisfies operator validates without widening
5. Runtime behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
