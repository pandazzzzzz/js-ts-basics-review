// TypeScript vs JavaScript: ES6+ Syntax Features Comparison
// 📘 For JavaScript examples, see: 18-es6-plus-syntax.js
// This file demonstrates TypeScript-specific typing for modern ES6+ features

export {};

// ============================================================================
// 1. TYPED SPREAD OPERATOR
// ============================================================================

// JavaScript: const arr2 = [...arr1, 4, 5];
// TypeScript: Same runtime behavior, but with type inference

const arr1: number[] = [1, 2, 3];
const arr2: number[] = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1: { a: number; b: number } = { a: 1, b: 2 };
const obj2: { a: number; b: number; c: number } = { ...obj1, c: 3 };

console.log("=== Typed Spread Operator ===");
console.log({ arr2, obj2 });

// TypeScript: Spread with generic constraints
function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  return { ...obj1, ...obj2 };
}

const merged = mergeObjects({ a: 1 }, { b: 2 });
console.log("Merged:", merged);

// ============================================================================
// 2. TYPED DESTRUCTURING
// ============================================================================

// JavaScript: const { name, age } = person;
// TypeScript: Destructuring with type annotations

interface Person {
  name: string;
  age: number;
  city: string;
}

const person: Person = { name: "Alice", age: 30, city: "NYC" };
const { name, age }: { name: string; age: number } = person;

// TypeScript: Destructuring with type annotations
const numbers: [number, number, number, number] = [10, 20, 30, 40];
const [first, second, ...rest]: [number, ...number[]] = numbers;

console.log("\n=== Typed Destructuring ===");
console.log({ name, age, first, second, rest });

// TypeScript: Renaming with types
interface User {
  username: string;
  email: string;
}

const user: User = { username: "alice", email: "alice@example.com" };
const { username: displayName, email: emailAddress } = user;
console.log("Renamed destructuring:", displayName, emailAddress);

// ============================================================================
// 3. OPTIONAL CHAINING WITH TYPES
// ============================================================================

// JavaScript: obj?.a?.b?.c
// TypeScript: Optional chaining with proper null handling

interface NestedAddress {
  city: string;
  zip: string;
  email?: string;
}

interface UserProfile {
  name: string;
  address?: NestedAddress;
}

const typedUser: UserProfile = {
  name: "Alice",
  address: { city: "NYC", zip: "10001" },
};

console.log("\n=== Optional Chaining Types ===");
console.log("User city:", typedUser?.address?.city); // "NYC"
console.log("Missing nested:", typedUser?.address?.email); // undefined

// TypeScript: Type narrowing with optional chaining
function getUserEmail(obj: UserProfile): string | undefined {
  return obj?.address?.city;
}

// ============================================================================
// 4. NULLISH COALESCING WITH TYPES
// ============================================================================

// JavaScript: const value = input ?? defaultValue;
// TypeScript: Proper type inference with nullish coalescing

interface Config {
  port?: number;
  timeout?: number;
}

function getConfig(userConfig: Partial<Config> = {}, defaults: Config): Config {
  return {
    port: userConfig.port ?? defaults.port,
    timeout: userConfig.timeout ?? defaults.timeout,
  };
}

console.log("\n=== Nullish Coalescing Types ===");
const typedConfig = getConfig({ port: 8080 }, { port: 3000, timeout: 5000 });
console.log(typedConfig);

// TypeScript: Nullish coalescing with type narrowing
type MaybeString = string | null | undefined;

function getString(value: MaybeString, fallback: string): string {
  return value ?? fallback;
}

// ============================================================================
// 5. TYPED DEFAULT PARAMETERS
// ============================================================================

// JavaScript: function greet(name = "Guest", greeting = "Hello")
// TypeScript: Default parameters with type annotations

function greet(name: string = "Guest", greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log("\n=== Typed Default Parameters ===");
console.log(greet()); // "Hello, Guest!"
console.log(greet("Bob")); // "Hello, Bob!"

// TypeScript: Default parameters can reference earlier parameters
function createGreeting(
  name: string,
  greeting: string = "Hello",
  punctuation: string = "!"
): string {
  return `${greeting}, ${name}${punctuation}`;
}

console.log(createGreeting("Alice")); // "Hello, Alice!"

// ============================================================================
// 6. TYPED REST PARAMETERS
// ============================================================================

// JavaScript: function sum(...numbers)
// TypeScript: Rest parameters with tuple types

function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("\n=== Typed Rest Parameters ===");
console.log(sum(1, 2, 3, 4, 5)); // 15

// TypeScript: Rest parameter with specific tuple type
function processTuple(
  first: number,
  second: number,
  ...rest: number[]
): string {
  return `${first}, ${second}, [${rest.join(", ")}]`;
}

console.log(processTuple(1, 2, 3, 4, 5)); // "1, 2, [3, 4, 5]"

// ============================================================================
// 7. TYPED ARROW FUNCTIONS
// ============================================================================

// JavaScript: const add = (a, b) => a + b;
// TypeScript: Arrow functions with explicit return types

const add = (a: number, b: number): number => a + b;

// TypeScript: Implicit return type inference
const multiply = (a: number, b: number) => a * b; // Return type inferred as number

console.log("\n=== Typed Arrow Functions ===");
console.log("add(5, 3):", add(5, 3));
console.log("multiply(4, 6):", multiply(4, 6));

// TypeScript: Lexical this typing
class Counter {
  count = 0;

  increment(): void {
    setTimeout(() => {
      this.count++; // TypeScript knows 'this' is Counter
      console.log("Counter:", this.count);
    }, 100);
  }
}

const counter = new Counter();
counter.increment();

// ============================================================================
// 8. TYPED CLASSES - BASIC SYNTAX
// ============================================================================

// TypeScript: Class with typed fields, constructor, and methods
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): string {
    return `${this.name} makes a sound`;
  }
}

// TypeScript: Inheritance with typed super
class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  speak(): string {
    return `${this.name} barks!`;
  }
}

const dog = new Dog("Max", "Golden Retriever");
console.log("\n=== Typed Classes ===");
console.log(dog.speak()); // "Max barks!"

// ============================================================================
// 9. TYPED STATIC MEMBERS
// ============================================================================

// TypeScript: Static members with types
class MathUtils {
  static readonly PI: number = 3.14159;
  static version: string = "1.0.0";

  static square(x: number): number {
    return x * x;
  }

  static circleArea(radius: number): number {
    return this.PI * this.square(radius);
  }
}

console.log("\n=== Typed Static Members ===");
console.log("MathUtils.PI:", MathUtils.PI);
console.log("MathUtils.square(5):", MathUtils.square(5));
console.log("MathUtils.circleArea(3):", MathUtils.circleArea(3).toFixed(2));

// ============================================================================
// 10. PRIVATE FIELDS: JS # vs TS private
// ============================================================================

// JavaScript: #balance (ES2022 private, runtime enforced)
// TypeScript: private balance (compile-time checked) or #balance (runtime)

class JSBankAccount {
  #balance = 0; // ES2022 private, runtime enforced

  deposit(amount: number): boolean {
    if (amount > 0) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  getBalance(): number {
    return this.#balance;
  }
}

// TypeScript: private keyword (compile-time only, removed at runtime)
class TSBankAccount {
  private balance = 0; // TypeScript private, compile-time checked

  deposit(amount: number): boolean {
    if (amount > 0) {
      this.balance += amount;
      return true;
    }
    return false;
  }

  getBalance(): number {
    return this.balance;
  }
}

// TypeScript: protected for subclasses
class Parent {
  protected shared = "protected value";
  private hidden = "private value";
}

class Child extends Parent {
  useShared(): string {
    return this.shared; // ✅ Can access protected
    // return this.hidden; // ❌ Cannot access private
  }
}

console.log("\n=== Private Fields Comparison ===");
console.log("JS #: Runtime enforced, cannot be accessed outside");
console.log(
  "TS private: Compile-time checked, accessible at runtime via workarounds"
);

// ============================================================================
// 11. TYPED GETTERS AND SETTERS
// ============================================================================

// TypeScript: Getters and setters with types
class Temperature {
  #celsius = 0;

  constructor(celsius = 0) {
    this.#celsius = celsius;
  }

  get celsius(): number {
    return this.#celsius;
  }

  set celsius(value: number) {
    this.#celsius = value;
  }

  get fahrenheit(): number {
    return (this.#celsius * 9) / 5 + 32;
  }

  set fahrenheit(value: number) {
    this.#celsius = ((value - 32) * 5) / 9;
  }
}

const temp = new Temperature(25);
console.log("\n=== Typed Getters/Setters ===");
console.log("Celsius:", temp.celsius); // 25
console.log("Fahrenheit:", temp.fahrenheit.toFixed(1)); // 77.0

temp.fahrenheit = 86;
console.log("After setting to 86°F:", temp.celsius); // 30

// ============================================================================
// 12. ABSTRACT CLASSES
// ============================================================================

// TypeScript: Abstract classes with typed methods
abstract class Shape {
  abstract getArea(): number;

  describe(): string {
    return `Shape with area: ${this.getArea()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number
  ) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// const shape = new Shape(); // ❌ Cannot instantiate abstract class
const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);

console.log("\n=== Typed Abstract Classes ===");
console.log("Circle area:", circle.getArea().toFixed(2));
console.log("Rectangle area:", rectangle.getArea());

// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== TypeScript Modern Features Summary ===");
console.log("1. Typed spread operator");
console.log("2. Typed destructuring");
console.log("3. Optional chaining with type narrowing");
console.log("4. Nullish coalescing with type inference");
console.log("5. Typed default parameters");
console.log("6. Typed rest parameters");
console.log("7. Typed arrow functions");
console.log("8. Typed classes with inheritance");
console.log("9. Typed static members");
console.log("10. Private fields: JS # vs TS private");
console.log("11. Typed getters/setters");
console.log("12. Abstract classes");

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Type inference with spread/destructuring");
console.log("- Compile-time parameter validation");
console.log("- Return type safety for functions");
console.log("- Class field typing and inheritance");
console.log("- Abstract classes for interface enforcement");
