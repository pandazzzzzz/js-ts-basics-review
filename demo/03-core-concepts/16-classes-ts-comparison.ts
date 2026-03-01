// TypeScript vs JavaScript: Classes Comparison
// 📘 For JavaScript examples, see: 16-classes.js
// This file demonstrates TypeScript-specific class features

export {};

// ============================================================================
// 1. ACCESS MODIFIERS (public/private/protected)
// ============================================================================

// JavaScript: Only # for private fields (ES2022)
// class JsBankAccount {
//   #balance = 0; // Truly private at runtime
// }

// TypeScript: Compile-time access modifiers
class BankAccount {
  public accountNumber: string;      // Accessible everywhere
  protected accountType: string;     // Accessible in class and subclasses
  private balance: number;           // Only accessible in this class

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.accountType = "checking";
    this.balance = initialBalance;
  }

  public getBalance(): number {
    return this.balance;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  protected applyFee(amount: number): void {
    this.balance -= amount;
  }
}

console.log("=== Access Modifiers ===");
const account = new BankAccount("ACC-001", 1000);
console.log(account.accountNumber); // ✅ OK - public
console.log(account.getBalance());  // ✅ OK - public method
// console.log(account.balance);    // ❌ Error - private
// account.applyFee(10);            // ❌ Error - protected


// ============================================================================
// 2. PARAMETER PROPERTIES
// ============================================================================

// JavaScript: Verbose property initialization
// class JsPerson {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
// }

// TypeScript: Parameter properties shorthand
class Person {
  constructor(
    public name: string,
    private age: number,
    readonly id: string = crypto.randomUUID()
  ) {}

  introduce(): string {
    return `Hi, I'm ${this.name}, ${this.age} years old`;
  }

  getAge(): number {
    return this.age;
  }
}

console.log("\n=== Parameter Properties ===");
const alice = new Person("Alice", 30);
console.log(alice.introduce());
console.log(alice.getAge());
// alice.age = 31; // ❌ Error - private property


// ============================================================================
// 3. READONLY MODIFIER
// ============================================================================

// JavaScript: Use Object.defineProperty or convention
// const config = Object.freeze({ apiUrl: "https://api.example.com" });

// TypeScript: readonly keyword for compile-time enforcement
class Configuration {
  readonly apiKey: string;
  readonly apiUrl: string;
  debug: boolean;

  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.debug = false;
  }

  setDebug(debug: boolean): void {
    this.debug = debug;
    // this.apiKey = "new-key"; // ❌ Error - Cannot assign to readonly
  }
}

// Readonly with object type
interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  username: string;
  password: string;
}

const dbConfig: DatabaseConfig = {
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "secret"
};

console.log("\n=== Readonly Modifier ===");
// dbConfig.host = "production.db"; // ❌ Error - readonly
dbConfig.username = "newuser"; // ✅ OK - not readonly


// ============================================================================
// 4. ABSTRACT CLASSES AND METHODS
// ============================================================================

// JavaScript: Manual abstract pattern
// function AbstractClass() {
//   if (new.target === AbstractClass) {
//     throw new Error("Cannot instantiate abstract class");
//   }
// }

// TypeScript: Native abstract keyword
abstract class Shape {
  constructor(public color: string) {}

  // Abstract method - must be implemented by subclasses
  abstract getArea(): number;

  // Abstract method with return type
  abstract getPerimeter(): number;

  // Concrete method - available to all subclasses
  describe(): string {
    return `A ${this.color} shape`;
  }

  // Concrete method using abstract methods
  logInfo(): void {
    console.log(`${this.describe()}: Area=${this.getArea()}, Perimeter=${this.getPerimeter()}`);
  }
}

class Triangle extends Shape {
  constructor(public base: number, public height: number, color: string = "green") {
    super(color);
  }

  getArea(): number {
    return 0.5 * this.base * this.height;
  }

  getPerimeter(): number {
    // Simplified - not a real triangle perimeter
    return this.base + this.height * 2;
  }
}

console.log("\n=== Abstract Classes ===");
const triangle = new Triangle(10, 5);
console.log(triangle.describe());
triangle.logInfo();

// const shape = new Shape("red"); // ❌ Error: Cannot create abstract class instance


// ============================================================================
// 5. IMPLEMENTS INTERFACE
// ============================================================================

// TypeScript: implements keyword for interface contracts
interface Renderable {
  render(): string;
  setColor(color: string): void;
}

interface Transformable {
  translate(x: number, y: number): void;
  scale(factor: number): void;
}

class Sprite implements Renderable, Transformable {
  private x: number = 0;
  private y: number = 0;
  private color: string = "white";
  private scaleFactor: number = 1;

  render(): string {
    return `Rendering ${this.color} sprite at (${this.x}, ${this.y}) scale ${this.scaleFactor}`;
  }

  setColor(color: string): void {
    this.color = color;
  }

  translate(x: number, y: number): void {
    this.x += x;
    this.y += y;
  }

  scale(factor: number): void {
    this.scaleFactor = factor;
  }
}

console.log("\n=== Implements Interface ===");
const sprite = new Sprite();
sprite.setColor("red");
sprite.translate(100, 200);
sprite.scale(2);
console.log(sprite.render());


// ============================================================================
// 6. DECORATORS (TS 5.0+)
// ============================================================================

// TypeScript: Experimental decorator support
// Note: Requires experimentalDecorators: true in tsconfig

// Class decorator
function sealed<T extends new (...args: any[]) => any>(constructor: T) {
  return class extends constructor {
    // Add wrapper functionality
  };
}

// Method decorator
function logExecution(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Executing ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Completed ${propertyKey}`);
    return result;
  };
  return descriptor;
}

// Property decorator
function format(pattern: string) {
  return function(target: any, propertyKey: string) {
    // Store the pattern for use in getter/setter
  };
}

@sealed
class DataService {
  @logExecution
  fetchData(id: number): { id: number; data: string } {
    return { id, data: "Sample data" };
  }
}

console.log("\n=== Decorators ===");
const service = new DataService();
service.fetchData(42);


// ============================================================================
// 7. STATIC MEMBERS WITH TYPES
// ============================================================================

class MathUtils {
  // Static property with type
  static readonly PI: number = 3.14159265359;
  static readonly E: number = 2.71828182845;

  // Static method with types
  static square(x: number): number {
    return x * x;
  }

  static circleArea(radius: number): number {
    return this.PI * this.square(radius);
  }

  // Static generic method
  static identity<T>(value: T): T {
    return value;
  }
}

console.log("\n=== Static Members ===");
console.log(`PI: ${MathUtils.PI}`);
console.log(`Circle area (r=5): ${MathUtils.circleArea(5).toFixed(2)}`);
console.log(`Identity: ${MathUtils.identity("hello")}`);


// ============================================================================
// 8. GETTERS AND SETTERS WITH TYPES
// ============================================================================

class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new RangeError("Temperature cannot be below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return this._celsius * 1.8 + 32;
  }

  set fahrenheit(value: number) {
    this.celsius = (value - 32) / 1.8;
  }

  get kelvin(): number {
    return this._celsius + 273.15;
  }
}

console.log("\n=== Getters and Setters ===");
const temp = new Temperature();
temp.celsius = 25;
console.log(`Celsius: ${temp.celsius}`);
console.log(`Fahrenheit: ${temp.fahrenheit.toFixed(1)}`);
console.log(`Kelvin: ${temp.kelvin.toFixed(2)}`);

temp.fahrenheit = 212;
console.log(`After setting Fahrenheit to 212:`);
console.log(`Celsius: ${temp.celsius}`);


// ============================================================================
// 9. METHOD OVERLOADING
// ============================================================================

// TypeScript: Function overloads for multiple signatures
class Calculator {
  // Overload signatures
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number, b: number, c: number): number;

  // Implementation signature
  add(a: number | string, b: number | string, c?: number): number | string {
    if (typeof a === "string" && typeof b === "string") {
      return a + b;
    }
    if (typeof a === "number" && typeof b === "number") {
      return c !== undefined ? a + b + c : a + b;
    }
    throw new TypeError("Invalid arguments");
  }
}

console.log("\n=== Method Overloading ===");
const calc = new Calculator();
console.log(calc.add(2, 3));        // 5
console.log(calc.add(2, 3, 4));     // 9
console.log(calc.add("Hello", " ")); // "Hello "


// ============================================================================
// 10. GENERIC CLASSES
// ============================================================================

// TypeScript: Generic classes with type parameters
class Box<T> {
  private value: T;

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

// Generic class with constraints
class NumberBox<T extends number> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  double(): T {
    return (this.value * 2) as T;
  }
}

// Multiple type parameters
class KeyValuePair<K, V> {
  constructor(
    public key: K,
    public value: V
  ) {}

  toString(): string {
    return `${String(this.key)}: ${this.value}`;
  }
}

console.log("\n=== Generic Classes ===");
const stringBox = new Box<string>("hello");
console.log(stringBox.getValue().toUpperCase());

const numberBox = new NumberBox(21);
console.log(numberBox.double());

const kv = new KeyValuePair("name", "Alice");
console.log(kv.toString());


// ============================================================================
// 11. CLASS EXPRESSIONS WITH TYPES
// ============================================================================

// Anonymous class expression with type
const AnimalClass = class {
  constructor(public name: string) {}
  speak(): string {
    return `${this.name} makes a sound`;
  }
};

// Named class expression
const NamedClass = class MyClass {
  getName(): string {
    return "MyClass";
  }
};

console.log("\n=== Class Expressions ===");
const animal = new AnimalClass("Dog");
console.log(animal.speak());

const named = new NamedClass();
console.log(named.getName());


// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Classes ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Access modifiers           │  # private only │ public/private/protected│
│ Parameter properties       │  Manual assign  │ Constructor shorthand│
│ readonly modifier          │  Object.freeze  │ Type system     │
│ Abstract classes           │  Manual pattern │ abstract keyword│
│ implements interface       │       ✗         │       ✓         │
│ Decorators                 │  Stage 3 proposal│ TS experimental│
│ Method overloads           │       ✗         │       ✓         │
│ Generic classes            │       ✗         │       ✓         │
│ Static member types        │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Class mechanics            │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time access control
2. Parameter properties reduce boilerplate code
3. Abstract classes enforce subclass implementations
4. Generics enable reusable class components
5. Runtime class behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
