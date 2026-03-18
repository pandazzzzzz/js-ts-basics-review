// TypeScript Advanced Features
// 📘 TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
// 📘 Advanced Types: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
// 📌 Covers advanced TypeScript type system features (TypeScript only)

export {}; // Make this file a module

// ============================================
// Section 1: Generic Constraints
// ============================================

console.log("=== Generic Constraints ===\n");

// Basic generic constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const name = getProperty(user, "name"); // Type: string
const age = getProperty(user, "age");   // Type: number
console.log("Name:", name, "Age:", age);

// Multiple constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log("Length:", arg.length);
  return arg;
}

logLength("hello");        // OK: string has length
logLength([1, 2, 3]);      // OK: array has length
// logLength(123);         // Error: number doesn't have length

// Generic defaults
interface Container<T = string> {
  value: T;
}

const stringContainer: Container = { value: "hello" };
const numberContainer: Container<number> = { value: 42 };

console.log("Containers:", stringContainer, numberContainer);

// ============================================
// Section 2: Conditional Types
// ============================================

console.log("\n=== Conditional Types ===\n");

// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArray = ToArray<string | number>; // string[] | number[]


// Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type FunctionReturn = ReturnType<() => string>; // string

type ArrayElement<T> = T extends (infer E)[] ? E : never;
type Element = ArrayElement<number[]>; // number

// Practical example: Unwrap Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;
type Result = Awaited<Promise<string>>; // string

console.log("Conditional types enable type transformations");

// ============================================
// Section 3: Mapped Types
// ============================================

console.log("\n=== Mapped Types ===\n");

// Built-in mapped types
interface User {
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;     // All properties optional
type RequiredUser = Required<User>;   // All properties required
type ReadonlyUser = Readonly<User>;   // All properties readonly
type PickedUser = Pick<User, 'name' | 'age'>; // Pick specific properties
type OmittedUser = Omit<User, 'email'>; // Omit specific properties

// Custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; email: string | null; }

// Mapped type with key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; getEmail: () => string; }

console.log("Mapped types transform object types");

// ============================================
// Section 4: Template Literal Types
// ============================================

console.log("\n=== Template Literal Types ===\n");

// Basic template literal type
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// Event names
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// CSS properties
type CSSProperty = "color" | "background" | "border";
type CSSValue = string | number;
type CSSProperties = {
  [K in CSSProperty]: CSSValue;
};

// Route parameters
type Route = "/users/:id" | "/posts/:postId/comments/:commentId";
type ExtractParams<T extends string> = 
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : T extends `${infer _Start}:${infer Param}`
    ? Param
    : never;

type RouteParams = ExtractParams<Route>; // "id" | "postId" | "commentId"

console.log("Template literal types enable string manipulation at type level");

// ============================================
// Section 5: Decorators
// ============================================

console.log("\n=== Decorators ===\n");

// Class decorator
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@Sealed
class SealedClass {
  name: string = "Sealed";
}

// Method decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

// Property decorator
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

// Parameter decorator
function Required(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} of ${propertyKey} is required`);
}

class DecoratedClass {
  @ReadOnly
  readonly apiUrl: string = "https://api.example.com";

  @Log
  greet(@Required name: string): string {
    return `Hello, ${name}!`;
  }
}

const instance = new DecoratedClass();
console.log(instance.greet("Alice"));

// Decorator factory
function MinLength(min: number) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    Object.defineProperty(target, propertyKey, {
      get() { return value; },
      set(newValue: string) {
        if (newValue.length < min) {
          throw new Error(`${propertyKey} must be at least ${min} characters`);
        }
        value = newValue;
      }
    });
  };
}

// ============================================
// Section 6: Advanced Generics
// ============================================

console.log("\n=== Advanced Generics ===\n");

// Generic inference
function identity<T>(arg: T): T {
  return arg;
}

const result = identity("hello"); // T inferred as string

// Multiple generic parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Alice" }, { age: 30 });
console.log("Merged:", merged);

// Generic constraints with keyof
function pluck<T, K extends keyof T>(objects: T[], key: K): T[K][] {
  return objects.map(obj => obj[key]);
}

const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
];

const names = pluck(users, "name"); // string[]
const ages = pluck(users, "age");   // number[]
console.log("Names:", names, "Ages:", ages);

// Recursive types
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const jsonData: JSONValue = {
  name: "Alice",
  age: 30,
  hobbies: ["reading", "coding"],
  address: {
    city: "New York",
    zip: 10001
  }
};

console.log("JSON data:", jsonData);

// ============================================
// Section 7: Utility Types
// ============================================

console.log("\n=== Utility Types ===\n");

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Partial - all properties optional
type PartialTodo = Partial<Todo>;

// Required - all properties required
type RequiredTodo = Required<PartialTodo>;

// Readonly - all properties readonly
type ReadonlyTodo = Readonly<Todo>;

// Record - construct object type
type TodoRecord = Record<string, Todo>;

// Pick - select properties
type TodoPreview = Pick<Todo, 'title' | 'completed'>;

// Omit - exclude properties
type TodoInfo = Omit<Todo, 'completed'>;

// Exclude - exclude from union
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract - extract from union
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable - exclude null and undefined
type T2 = NonNullable<string | number | undefined>; // string | number

// Parameters - extract function parameters
type T3 = Parameters<(a: string, b: number) => void>; // [string, number]

// ReturnType - extract function return type
type T4 = ReturnType<() => string>; // string

console.log("Utility types provide common type transformations");

// ============================================
// Section 8: Module System
// ============================================

console.log("\n=== Module System ===\n");

// Namespace
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    }
  }

  export class URLValidator implements StringValidator {
    isValid(s: string): boolean {
      try {
        new URL(s);
        return true;
      } catch {
        return false;
      }
    }
  }
}

const emailValidator = new Validation.EmailValidator();
console.log("Valid email:", emailValidator.isValid("test@example.com"));

// Declaration merging
interface Box {
  height: number;
  width: number;
}

interface Box {
  depth: number;
}

const box: Box = { height: 10, width: 20, depth: 30 };
console.log("Box:", box);

// Ambient declarations
declare const API_KEY: string;
declare function fetchData(url: string): Promise<any>;

console.log("Module system enables code organization");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use generic constraints to ensure type safety");
console.log("2. Leverage conditional types for type transformations");
console.log("3. Use mapped types to transform object types");
console.log("4. Apply template literal types for string manipulation");
console.log("5. Use decorators for cross-cutting concerns");
console.log("6. Prefer utility types over manual type definitions");

console.log("\n❌ DON'T:");
console.log("1. Don't overuse complex conditional types");
console.log("2. Don't create deeply nested generic types");
console.log("3. Don't abuse decorators for business logic");
console.log("4. Don't ignore type inference");
console.log("5. Don't use any when advanced types can help");

console.log("\n📊 TypeScript Advanced Features:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ TYPESCRIPT ADVANCED FEATURES                                        │
├─────────────────────────────────────────────────────────────────────┤
│ Generic Constraints:                                                │
│   - extends keyof for property access                               │
│   - Multiple constraints with &                                     │
│   - Generic defaults                                                │
│                                                                      │
│ Conditional Types:                                                  │
│   - T extends U ? X : Y                                             │
│   - infer keyword for type inference                                │
│   - Distributive conditional types                                  │
│                                                                      │
│ Mapped Types:                                                       │
│   - Transform object types                                          │
│   - Key remapping with as                                           │
│   - Built-in: Partial, Required, Readonly, Pick, Omit              │
│                                                                      │
│ Template Literal Types:                                             │
│   - String manipulation at type level                               │
│   - Capitalize, Uppercase, Lowercase, Uncapitalize                  │
│   - Extract patterns from strings                                   │
│                                                                      │
│ Decorators:                                                         │
│   - Class, method, property, parameter decorators                   │
│   - Decorator factories                                             │
│   - Metadata with reflect-metadata                                  │
│                                                                      │
│ Module System:                                                      │
│   - Namespaces for organization                                     │
│   - Declaration merging                                             │
│   - Ambient declarations                                            │
└─────────────────────────────────────────────────────────────────────┘
`);
