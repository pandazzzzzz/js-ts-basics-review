// TypeScript vs JavaScript: Objects Comparison
// 📘 For JavaScript examples, see: 08-objects.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
export {};

// ============================================
// 1. Object Type Annotations
// ============================================

// Basic object type annotation
const person: { name: string; age: number; city: string } = {
  name: "Alice",
  age: 30,
  city: "New York",
};

console.log("=== Object Type Annotations ===");
console.log(person);

// Interface definition (preferred for objects)
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: "Bob",
  age: 25,
  email: "bob@example.com",
};

console.log("User:", user);

// Type alias (alternative to interface)
type Product = {
  id: number;
  name: string;
  price: number;
};

const product: Product = {
  id: 1,
  name: "Laptop",
  price: 999,
};

console.log("Product:", product);

// ⚠️ CONFUSION POINT: Interface vs Type
// - Interfaces can be extended and merged
// - Types are more flexible (unions, intersections)
// - Use interfaces for object shapes, types for complex types

// ============================================
// 2. Optional and Readonly Properties
// ============================================

interface Person {
  readonly id: number; // Cannot be modified
  name: string;
  age: number;
  email?: string; // Optional property
  phone?: string;
}

const alice: Person = {
  id: 1,
  name: "Alice",
  age: 30,
  // email and phone are optional
};

console.log("\n=== Optional and Readonly ===");
console.log("Alice:", alice);

// alice.id = 2; // ❌ Error: Cannot assign to 'id' because it is a read-only property
alice.name = "Alice Smith"; // ✅ OK
alice.email = "alice@example.com"; // ✅ OK (optional property)

console.log("Updated Alice:", alice);

// Readonly utility type
const readonlyConfig: Readonly<{ apiKey: string; endpoint: string }> = {
  apiKey: "abc123",
  endpoint: "https://api.example.com",
};

// readonlyConfig.apiKey = "new-key"; // ❌ Error: Cannot assign to readonly property
console.log("Readonly config:", readonlyConfig);

// ============================================
// 3. Index Signatures
// ============================================

// String index signature
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  hello: "你好",
  goodbye: "再见",
  thanks: "谢谢",
};

console.log("\n=== Index Signatures ===");
console.log("Translation:", translations["hello"]);

// Number index signature
interface NumberArray {
  [index: number]: string;
}

const fruits: NumberArray = ["apple", "banana", "cherry"];
console.log("Fruit:", fruits[0]);

// Mixed index signatures
interface MixedMap {
  [key: string]: string | number;
  name: string; // Specific property must match index signature type
  age: number;
}

const mixed: MixedMap = {
  name: "Alice",
  age: 30,
  city: "NYC",
  zipCode: 10001,
};

console.log("Mixed:", mixed);

// ✅ BEST PRACTICE: Use Record utility type
type TranslationMap = Record<string, string>;

const messages: TranslationMap = {
  success: "Operation successful",
  error: "An error occurred",
};

console.log("Messages:", messages);

// ============================================
// 4. Nested Objects and Type Safety
// ============================================

interface Address {
  street: string;
  city: string;
  country: string;
  zipCode?: string;
}

interface Employee {
  id: number;
  name: string;
  address: Address;
  department: {
    name: string;
    code: string;
  };
}

const employee: Employee = {
  id: 1,
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "NYC",
    country: "USA",
  },
  department: {
    name: "Engineering",
    code: "ENG",
  },
};

console.log("\n=== Nested Objects ===");
console.log("Employee:", employee);
console.log("City:", employee.address.city);
console.log("Department:", employee.department.name);

// Optional chaining with type safety
const zipCode = employee.address.zipCode?.toUpperCase();
console.log("Zip code:", zipCode); // undefined (type: string | undefined)

// ============================================
// 5. Object Methods with Type Safety
// ============================================

interface Calculator {
  value: number;
  add(n: number): number;
  subtract(n: number): number;
  multiply(n: number): number;
  divide(n: number): number;
}

const calculator: Calculator = {
  value: 0,
  add(n: number): number {
    return this.value + n;
  },
  subtract(n: number): number {
    return this.value - n;
  },
  multiply(n: number): number {
    return this.value * n;
  },
  divide(n: number): number {
    if (n === 0) throw new Error("Division by zero");
    return this.value / n;
  },
};

console.log("\n=== Object Methods ===");
calculator.value = 10;
console.log("add(5):", calculator.add(5));
console.log("multiply(3):", calculator.multiply(3));

// Method shorthand with types
interface Counter {
  count: number;
  increment(): void;
  decrement(): void;
  reset(): void;
}

const counter: Counter = {
  count: 0,
  increment() {
    this.count++;
  },
  decrement() {
    this.count--;
  },
  reset() {
    this.count = 0;
  },
};

console.log("Counter:", counter.count);
counter.increment();
console.log("After increment:", counter.count);

// ============================================
// 6. Getters and Setters with Types
// ============================================

interface BankAccount {
  _balance: number;
  readonly accountNumber: string;
  balance: number; // Getter/setter
}

class Account implements BankAccount {
  _balance: number;
  readonly accountNumber: string;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this._balance = initialBalance;
  }

  get balance(): number {
    return this._balance;
  }

  set balance(value: number) {
    if (value < 0) {
      throw new Error("Balance cannot be negative");
    }
    this._balance = value;
  }
}

console.log("\n=== Getters and Setters ===");
const account = new Account("ACC-001", 1000);
console.log("Balance:", account.balance);
account.balance = 1500;
console.log("New balance:", account.balance);
// account.balance = -100; // Throws error

// ============================================
// 7. Object.keys(), values(), entries() with Types
// ============================================

interface Config {
  host: string;
  port: number;
  timeout: number;
}

const serverConfig: Config = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
};

console.log("\n=== Object Methods with Types ===");

// Object.keys() returns string[]
const keys: string[] = Object.keys(serverConfig);
console.log("Keys:", keys);

// Object.values() returns T[keyof T][] (here: (string | number)[]) — typed, not any[]
const values = Object.values(serverConfig);
console.log("Values:", values);

// Object.entries() returns [string, T[keyof T]][] — typed tuples
const entries = Object.entries(serverConfig);
console.log("Entries:", entries);

// ✅ BEST PRACTICE: Type-safe iteration
for (const [key, value] of Object.entries(serverConfig)) {
  console.log(`${key}: ${value}`);
}

// Type-safe key access
type ConfigKey = keyof Config; // "host" | "port" | "timeout"

function getConfigValue(config: Config, key: ConfigKey): string | number {
  return config[key];
}

console.log("Host:", getConfigValue(serverConfig, "host"));
console.log("Port:", getConfigValue(serverConfig, "port"));

// ============================================
// 8. Object Spreading with Type Safety
// ============================================

interface BaseUser {
  name: string;
  email: string;
}

interface ExtendedUser extends BaseUser {
  age: number;
  city: string;
}

const baseUser: BaseUser = {
  name: "Alice",
  email: "alice@example.com",
};

// Spread with type inference
const extendedUser: ExtendedUser = {
  ...baseUser,
  age: 30,
  city: "NYC",
};

console.log("\n=== Object Spreading ===");
console.log("Extended user:", extendedUser);

// Partial updates with type safety
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const originalUser: User = {
  name: "Bob",
  age: 25,
  email: "bob@example.com",
};

const updatedUser = updateUser(originalUser, { age: 26 });
console.log("Updated user:", updatedUser);

// ⚠️ PITFALL: Spread creates shallow copy
interface UserWithAddress {
  name: string;
  address: { city: string; country: string };
}

const user1: UserWithAddress = {
  name: "Alice",
  address: { city: "NYC", country: "USA" },
};

const user2 = { ...user1 };
user2.address.city = "LA";

console.log("\nShallow copy pitfall:");
console.log("user1.address.city:", user1.address.city); // "LA" (modified!)
console.log("user2.address.city:", user2.address.city); // "LA"

// ============================================
// 9. Object Destructuring with Types
// ============================================

interface PointCoord {
  x: number;
  y: number;
  z?: number;
}

const pointCoord: PointCoord = { x: 10, y: 20 };

// Destructuring with type inference
const { x, y, z = 0 } = pointCoord;
console.log("\n=== Object Destructuring ===");
console.log("Coordinates:", { x, y, z });

// Destructuring with renaming
const { x: posX, y: posY } = pointCoord;
console.log("Position:", { posX, posY });

// Nested destructuring
interface UserProfile {
  user: {
    id: number;
    name: string;
    settings: {
      theme: string;
      notifications: boolean;
    };
  };
}

const profile: UserProfile = {
  user: {
    id: 1,
    name: "Alice",
    settings: {
      theme: "dark",
      notifications: true,
    },
  },
};

const {
  user: {
    id,
    settings: { theme },
  },
} = profile;
console.log("User ID:", id);
console.log("Theme:", theme);

// Function parameter destructuring
function greetUser({ name, age }: { name: string; age: number }): string {
  return `${name} is ${age} years old`;
}

console.log(greetUser({ name: "Bob", age: 25 }));

// ============================================
// 10. Utility Types for Objects
// ============================================

interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

console.log("\n=== Utility Types ===");

// Partial<T> - All properties optional
type PartialTodo = Partial<Todo>;
const partialTodo: PartialTodo = {
  title: "Learn TypeScript",
  // Other properties are optional
};
console.log("Partial todo:", partialTodo);

// Required<T> - All properties required (example type)
// type RequiredTodo = Required<Todo>;

// Readonly<T> - All properties readonly
type ReadonlyTodo = Readonly<Todo>;
const readonlyTodo: ReadonlyTodo = {
  title: "Read docs",
  description: "TypeScript documentation",
  completed: false,
  createdAt: new Date(),
};
// readonlyTodo.completed = true; // ❌ Error
console.log("Readonly todo:", readonlyTodo);

// Pick<T, K> - Select specific properties
type TodoPreview = Pick<Todo, "title" | "completed">;
const preview: TodoPreview = {
  title: "Learn TS",
  completed: false,
};
console.log("Preview:", preview);

// Omit<T, K> - Exclude specific properties
type TodoWithoutDate = Omit<Todo, "createdAt">;
const todoNoDate: TodoWithoutDate = {
  title: "Task",
  description: "Description",
  completed: false,
};
console.log("Todo without date:", todoNoDate);

// Record<K, T> - Object with specific key/value types
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
  alice: "admin",
  bob: "user",
  charlie: "guest",
};
console.log("Roles:", roles);

// ============================================
// 11. Discriminated Unions
// ============================================

// Type-safe state management with discriminated unions
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      // TypeScript knows response has data property
      console.log("Data:", response.data);
      break;
    case "error":
      // TypeScript knows response has error property
      console.log("Error:", response.error);
      break;
  }
}

console.log("\n=== Discriminated Unions ===");
handleResponse<string>({ status: "loading" });
handleResponse<string>({ status: "success", data: "Hello" });
handleResponse<string>({ status: "error", error: "Failed" });

// Shape discriminated union
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));
console.log("Square area:", getArea({ kind: "square", size: 4 }));

// ============================================
// 12. Intersection Types
// ============================================

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: number;
}

// Combine multiple types
type Entity = Identifiable &
  Timestamped & {
    name: string;
  };

const entity: Entity = {
  id: 1,
  name: "Item",
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log("\n=== Intersection Types ===");
console.log("Entity:", entity);

// Mixin pattern with intersection types
type Loggable = {
  log(): void;
};

type Serializable = {
  serialize(): string;
};

type LoggableSerializable = Loggable & Serializable;

const obj: LoggableSerializable = {
  log() {
    console.log("Logging...");
  },
  serialize() {
    return JSON.stringify(this);
  },
};

obj.log();
console.log("Serialized:", obj.serialize());

// ============================================
// 13. Mapped Types
// ============================================

// Transform all properties to optional (example type)
// type Optional<T> = {
//   [K in keyof T]?: T[K];
// };
// type OptionalUser = Optional<User>;

// Transform all properties to readonly (example type)
// type ReadonlyUser = {
//   readonly [K in keyof User]: User[K];
// };

// Add prefix to all keys (example type)
// type Prefixed<T, P extends string> = {
//   [K in keyof T as `${P}${K & string}`]: T[K];
// };
// type PrefixedConfig = Prefixed<Config, "app_">;
// { app_host: string; app_port: number; app_timeout: number; }

console.log("\n=== Mapped Types ===");

// Nullable properties
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
const nullableUser: NullableUser = {
  name: "Alice",
  age: null,
  email: "alice@example.com",
};
console.log("Nullable user:", nullableUser);

// ============================================
// 14. Conditional Types with Objects
// ============================================

// Extract function property names (example types)
// type FunctionPropertyNames<T> = {
//   [K in keyof T]: T[K] extends Function ? K : never;
// }[keyof T];

// Extract non-function property names (example types)
// type NonFunctionPropertyNames<T> = {
//   [K in keyof T]: T[K] extends Function ? never : K;
// }[keyof T];

// interface Example {
//   name: string;
//   age: number;
//   greet(): void;
//   calculate(x: number): number;
// }

// type ExampleFunctions = FunctionPropertyNames<Example>; // "greet" | "calculate"
// type ExampleData = NonFunctionPropertyNames<Example>; // "name" | "age"

console.log("\n=== Conditional Types ===");
console.log("Function properties: greet, calculate");
console.log("Data properties: name, age");

// ============================================
// 15. Type Guards for Objects
// ============================================

// typeof type guard (example function)
// function isObject(value: unknown): value is object {
//   return typeof value === "object" && value !== null;
// }

// in operator type guard
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}

function makeSound(animal: Cat | Dog): void {
  if (isCat(animal)) {
    animal.meow();
  } else {
    animal.bark();
  }
}

console.log("\n=== Type Guards ===");
const cat: Cat = { meow: () => console.log("Meow!") };
const dog: Dog = { bark: () => console.log("Woof!") };
makeSound(cat);
makeSound(dog);

// Custom type guard
interface Admin {
  role: "admin";
  permissions: string[];
}

interface RegularUser {
  role: "user";
}

function isAdmin(user: Admin | RegularUser): user is Admin {
  return user.role === "admin";
}

function checkPermissions(user: Admin | RegularUser): void {
  if (isAdmin(user)) {
    console.log("Permissions:", user.permissions);
  } else {
    console.log("Regular user");
  }
}

checkPermissions({ role: "admin", permissions: ["read", "write"] });
checkPermissions({ role: "user" });

// ============================================
// 16. Generic Objects
// ============================================

// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

class Box<T> implements Container<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

console.log("\n=== Generic Objects ===");
const stringBox = new Box<string>("Hello");
console.log("String box:", stringBox.getValue());

const numberBox = new Box<number>(42);
console.log("Number box:", numberBox.getValue());

// Generic object type
type KeyValuePair<K, V> = {
  key: K;
  value: V;
};

const pair: KeyValuePair<string, number> = {
  key: "age",
  value: 30,
};
console.log("Pair:", pair);

// ============================================
// 17. Object Freezing with Types
// ============================================

// Object.freeze() with type safety
const frozenConfig = Object.freeze({
  apiKey: "abc123",
  endpoint: "https://api.example.com",
});

// TypeScript infers readonly properties
// frozenConfig.apiKey = "new-key"; // ❌ Error

console.log("\n=== Object Freezing ===");
console.log("Frozen config:", frozenConfig);

// Deep freeze type
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface NestedConfig {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
    timeout: number;
  };
}

const deepFrozen: DeepReadonly<NestedConfig> = {
  server: {
    host: "localhost",
    port: 3000,
  },
  database: {
    url: "mongodb://localhost",
    timeout: 5000,
  },
};

// deepFrozen.server.host = "new-host"; // ❌ Error
console.log("Deep frozen:", deepFrozen);

// ============================================
// 18. Excess Property Checking
// ============================================

interface Point2D {
  x: number;
  y: number;
}

// ❌ Error: Object literal may only specify known properties
// const point3D: Point2D = {
//   x: 10,
//   y: 20,
//   z: 30 // Error: 'z' does not exist in type 'Point2D'
// };

// ✅ Workarounds:
// 1. Type assertion (example - not used)
// const point3D = {
//   x: 10,
//   y: 20,
//   z: 30
// } as Point2D;

// 2. Intermediate variable (example - not used)
// const tempPoint = { x: 10, y: 20, z: 30 };
// const point2D: Point2D = tempPoint; // ✅ OK

// 3. Index signature
interface FlexiblePoint {
  x: number;
  y: number;
  [key: string]: number;
}

const flexPoint: FlexiblePoint = {
  x: 10,
  y: 20,
  z: 30,
};

console.log("\n=== Excess Property Checking ===");
console.log("Flexible point:", flexPoint);

// ============================================
// 19. This Type
// ============================================

// this type for method chaining
interface Builder {
  value: number;
  add(n: number): this;
  multiply(n: number): this;
  build(): number;
}

class NumberBuilder implements Builder {
  value: number = 0;

  add(n: number): this {
    this.value += n;
    return this;
  }

  multiply(n: number): this {
    this.value *= n;
    return this;
  }

  build(): number {
    return this.value;
  }
}

console.log("\n=== This Type ===");
const result = new NumberBuilder().add(5).multiply(2).add(3).build();
console.log("Result:", result); // 13

// ============================================
// 20. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Object.keys() returns string[]
const obj1 = { a: 1, b: 2, c: 3 };
const keys1 = Object.keys(obj1); // Type: string[]

// Need type assertion for specific keys (example - not used)
// type Obj1Keys = keyof typeof obj1; // "a" | "b" | "c"
// const typedKeys = Object.keys(obj1) as Obj1Keys[];

console.log("Keys:", keys1);

// PITFALL 2: Optional properties can be undefined
interface OptionalProps {
  name: string;
  age?: number;
}

function printAge(obj: OptionalProps): void {
  // obj.age might be undefined
  console.log("Age:", obj.age?.toString() ?? "Unknown");
}

printAge({ name: "Alice" });
printAge({ name: "Bob", age: 25 });

// PITFALL 3: Structural typing (duck typing)
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Color {
  x: number; // red
  y: number; // green
  z: number; // blue
}

// These are structurally identical!
const pointStruct: Point3D = { x: 1, y: 2, z: 3 };
const colorStruct: Color = pointStruct; // ✅ OK (structural typing)

console.log("Color from point:", colorStruct);

// PITFALL 4: Index signature allows any key
interface StringDict {
  [key: string]: string;
}

const dict: StringDict = {
  name: "Alice",
  email: "alice@example.com",
};

// This doesn't error even though property doesn't exist
const value = dict["nonexistent"]; // undefined
console.log("Nonexistent value:", value);

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices ===");

/*
✅ DO:
1. Use interfaces for object shapes
2. Use type aliases for unions and complex types
3. Leverage utility types (Partial, Pick, Omit, etc.)
4. Use readonly for immutable properties
5. Use optional properties (?) for nullable fields
6. Use discriminated unions for type-safe state
7. Use type guards for runtime type checking
8. Use keyof for type-safe property access
9. Use mapped types for transformations
10. Use const assertions for literal types

❌ DON'T:
1. Use any to bypass type checking
2. Ignore excess property checking errors
3. Forget to handle optional properties
4. Use type assertions unnecessarily
5. Modify readonly properties
6. Rely on Object.keys() for typed keys
7. Use index signatures when specific keys are known
8. Forget that spread creates shallow copies
9. Use non-null assertion (!) without validation
10. Mix interfaces and types inconsistently

⚠️ WATCH OUT FOR:
1. Object.keys() returns string[], not literal types
2. Optional properties can be undefined
3. Structural typing allows unexpected assignments
4. Index signatures allow any key access
5. Spread operator creates shallow copies
6. Excess property checking only on object literals
7. readonly is compile-time only, not runtime
8. this type in arrow functions
9. Type guards don't perform runtime validation
10. Discriminated unions need exhaustiveness checking
*/

console.log("\n=== TypeScript provides compile-time type safety ===");
console.log("=== Runtime behavior follows JavaScript rules ===");
console.log("=== Use TypeScript features for better object handling! ===");
