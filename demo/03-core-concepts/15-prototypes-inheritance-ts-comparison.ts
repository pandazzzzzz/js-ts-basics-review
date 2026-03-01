// TypeScript vs JavaScript: Prototypes and Inheritance Comparison
// 📘 For JavaScript examples, see: 15-prototypes-inheritance.js
// This file demonstrates TypeScript-specific typing for prototypes and inheritance

export {};

// ============================================================================
// 1. INTERFACE INHERITANCE
// ============================================================================

// JavaScript: No interfaces, duck typing only
// const obj = { name: "test", getValue() { return 42; } };

// TypeScript: Interface inheritance with extends
interface BaseShape {
  color: string;
  describe(): string;
}

interface Polygon extends BaseShape {
  sides: number;
  getArea(): number;
  getPerimeter(): number;
}

interface RegularPolygon extends Polygon {
  sideLength: number;
  isEquilateral: boolean;
}

console.log("=== Interface Inheritance ===");

// Implementation with class
class Rectangle implements Polygon {
  constructor(
    public color: string,
    public width: number,
    public height: number
  ) {}

  get sides(): number {
    return 4;
  }

  describe(): string {
    return `A ${this.color} rectangle`;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const rect = new Rectangle("red", 10, 5);
console.log(rect.describe());
console.log(`Area: ${rect.getArea()}, Perimeter: ${rect.getPerimeter()}`);


// ============================================================================
// 2. CONSTRUCTOR TYPE CHECKING
// ============================================================================

// TypeScript: Constructor function types
interface Constructor<T> {
  new (...args: any[]): T;
}

function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args);
}

console.log("\n=== Constructor Type Checking ===");

class MyClass {
  constructor(public value: number) {}
  double(): number {
    return this.value * 2;
  }
}

const instance = createInstance(MyClass, 21);
console.log(instance.double()); // 42


// ============================================================================
// 3. INSTANCEOF TYPE GUARDS
// ============================================================================

// JavaScript: instanceof works at runtime
// if (obj instanceof Array) { ... }

// TypeScript: instanceof as type guard
class Animal {
  constructor(public name: string) {}
  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`${this.name} barks!`);
  }
}

class Cat extends Animal {
  meow(): void {
    console.log(`${this.name} meows!`);
  }
}

function interact(animal: Animal): void {
  console.log("\n=== instanceof Type Guards ===");

  // TypeScript narrows type based on instanceof
  if (animal instanceof Dog) {
    animal.bark(); // ✅ TypeScript knows this is Dog
  } else if (animal instanceof Cat) {
    animal.meow(); // ✅ TypeScript knows this is Cat
  } else {
    animal.speak(); // ✅ TypeScript knows this is Animal
  }
}

interact(new Dog("Buddy"));
interact(new Cat("Whiskers"));
interact(new Animal("Generic"));


// ============================================================================
// 4. PROTOTYPE CHAIN TYPING
// ============================================================================

// TypeScript: Typing the prototype chain
interface PrototypeChain {
  __proto__: object | null;
}

// GetPrototypeOf with proper typing
function getPrototype<T extends object>(obj: T): object | null {
  return Object.getPrototypeOf(obj);
}

console.log("\n=== Prototype Chain Typing ===");

class BaseClass {
  baseMethod(): void {
    console.log("Base method");
  }
}

class DerivedClass extends BaseClass {
  derivedMethod(): void {
    console.log("Derived method");
  }
}

const derived = new DerivedClass();
const proto = getPrototype(derived);
console.log("Prototype:", proto.constructor.name); // DerivedClass


// ============================================================================
// 5. OBJECT.CREATE WITH TYPES
// ============================================================================

// TypeScript: Object.create with type parameters
interface ProtoType {
  greet(): string;
}

const protoObj: ProtoType = {
  greet() {
    return "Hello from prototype";
  }
};

// Create object with specific prototype
const childObj = Object.create(protoObj);
childObj.name = "Child";

console.log("\n=== Object.create with Types ===");
console.log(childObj.greet()); // "Hello from prototype"
console.log(childObj.name); // "Child"


// ============================================================================
// 6. CLASS IMPLEMENTATION OF INTERFACES
// ============================================================================

// Multiple interface implementation
interface Flyable {
  fly(): string;
  maxAltitude: number;
}

interface Swimmable {
  swim(): string;
  maxDepth: number;
}

// Class implementing multiple interfaces
class Duck implements Flyable, Swimmable {
  constructor(
    public name: string,
    public maxAltitude: number,
    public maxDepth: number
  ) {}

  fly(): string {
    return `${this.name} is flying at ${this.maxAltitude}m`;
  }

  swim(): string {
    return `${this.name} is swimming at ${this.maxDepth}m depth`;
  }
}

console.log("\n=== Multiple Interface Implementation ===");
const donald = new Duck("Donald", 100, 5);
console.log(donald.fly());
console.log(donald.swim());


// ============================================================================
// 7. ABSTRACT CLASS PATTERNS
// ============================================================================

// JavaScript: Abstract pattern with manual enforcement
// function AbstractShape() {
//   if (new.target === AbstractShape) {
//     throw new Error("Cannot instantiate abstract class");
//   }
// }

// TypeScript: Native abstract classes
abstract class Shape {
  constructor(public color: string) {}

  // Abstract method - must be implemented by subclasses
  abstract getArea(): number;

  // Concrete method - can be used by all subclasses
  describe(): string {
    return `A ${this.color} shape`;
  }
}

class Circle extends Shape {
  constructor(public radius: number, color: string = "blue") {
    super(color);
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

console.log("\n=== Abstract Classes ===");
const circle = new Circle(5);
console.log(circle.describe());
console.log(`Area: ${circle.getArea().toFixed(2)}`);

// Cannot instantiate abstract class
// const shape = new Shape("red"); // ❌ Error: Cannot create abstract class instance


// ============================================================================
// 8. TYPE INFERENCE IN INHERITANCE
// ============================================================================

// TypeScript infers types through inheritance chain
class Vehicle {
  constructor(
    public brand: string,
    public speed: number = 0
  ) {}

  accelerate(amount: number): void {
    this.speed += amount;
  }
}

class ElectricCar extends Vehicle {
  constructor(
    brand: string,
    public batteryCapacity: number,
    public batteryLevel: number = 100
  ) {
    super(brand);
  }

  // Override with proper typing
  accelerate(amount: number): void {
    if (this.batteryLevel > 0) {
      super.accelerate(amount);
      this.batteryLevel -= amount * 0.1;
    }
  }

  charge(): void {
    this.batteryLevel = 100;
  }
}

console.log("\n=== Type Inference in Inheritance ===");
const tesla = new ElectricCar("Tesla", 75);
tesla.accelerate(30);
console.log(`Speed: ${tesla.speed}, Battery: ${tesla.batteryLevel.toFixed(1)}%`);


// ============================================================================
// 9. GENERIC CONSTRAINTS WITH EXTENDS
// ============================================================================

// Generic constraint using extends
interface HasName {
  name: string;
}

function printName<T extends HasName>(item: T): void {
  console.log(`\n=== Generic Constraints ===`);
  console.log(`Name: ${item.name}`);
}

printName({ name: "Alice", age: 30 }); // ✅ OK
// printName({ age: 30 }); // ❌ Error: Missing 'name' property


// ============================================================================
// 10. KEYOF AND INDEXED ACCESS TYPES
// ============================================================================

// keyof operator for type-safe property access
interface Person {
  name: string;
  age: number;
  email: string;
}

// Get property value with type safety
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = { name: "Bob", age: 25, email: "bob@example.com" };

console.log("\n=== keyof and Indexed Access ===");
console.log(getProperty(person, "name")); // Type: string
console.log(getProperty(person, "age"));  // Type: number
// getProperty(person, "invalid"); // ❌ Error: Argument not assignable


// ============================================================================
// 11. PARTIAL, PICK, OMIT UTILITY TYPES
// ============================================================================

// Utility types for transforming interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Partial<T> - All properties optional
type PartialProduct = Partial<Product>;

// Pick<T, K> - Select specific properties
type ProductSummary = Pick<Product, "id" | "name">;

// Omit<T, K> - Exclude specific properties
type ProductWithoutId = Omit<Product, "id">;

console.log("\n=== Utility Types ===");
const partialProduct: PartialProduct = { name: "Widget" };
const summary: ProductSummary = { id: 1, name: "Widget" };
const withoutId: ProductWithoutId = { name: "Widget", price: 9.99, description: "A widget" };

console.log(partialProduct);
console.log(summary);
console.log(withoutId);


// ============================================================================
// 12. READONLY AND IMMUTABLE TYPES
// ============================================================================

// Readonly modifier for properties
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  debug: boolean;
}

// ReadonlyArray for immutable arrays
const numbers: readonly number[] = [1, 2, 3, 4, 5];
// numbers.push(6); // ❌ Error: Property 'push' does not exist

// Readonly utility type
type ImmutableConfig = Readonly<Config>;

console.log("\n=== Readonly Types ===");
const config: ImmutableConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  debug: false
};
// config.debug = true; // ❌ Error: Cannot assign to readonly property


// ============================================================================
// 13. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Prototypes & Inheritance ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Interface inheritance      │       ✗         │       ✓         │
│ Constructor typing         │       ✗         │       ✓         │
│ instanceof type guards     │  Runtime only   │  Type narrowing│
│ Abstract classes           │  Manual pattern │  Native support│
│ implements keyword         │       ✗         │       ✓         │
│ keyof operator             │       ✗         │       ✓         │
│ Utility types              │       ✗         │       ✓         │
│ Generic constraints        │       ✗         │       ✓         │
│ Readonly properties        │  Object.freeze  │  Type system   │
│ Runtime behavior           │    Same         │    Same         │
│ Prototype chain            │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time interface checking
2. instanceof works as type guard for narrowing
3. Abstract classes prevent direct instantiation
4. Utility types transform existing types
5. Runtime prototype chain follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
