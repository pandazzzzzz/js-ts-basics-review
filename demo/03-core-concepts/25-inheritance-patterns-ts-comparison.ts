// TypeScript vs JavaScript: Inheritance Patterns Comparison
// 📘 For JavaScript examples, see: 25-inheritance-patterns.js
// This file demonstrates TypeScript-specific inheritance pattern features

export {};

// ============================================================================
// 1. INTERFACE-BASED COMPOSITION
// ============================================================================

console.log("=== Interface-Based Composition ===");

// TypeScript: Interfaces for composition contracts
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Walkable {
  walk(): void;
}

class Bird implements Flyable, Walkable {
  fly(): void {
    console.log("Flying...");
  }
  walk(): void {
    console.log("Walking...");
  }
}

class Duck implements Flyable, Swimmable, Walkable {
  fly(): void {
    console.log("Duck flying...");
  }
  swim(): void {
    console.log("Duck swimming...");
  }
  walk(): void {
    console.log("Duck walking...");
  }
}

const duck = new Duck();
duck.fly();
duck.swim();
duck.walk();

// TypeScript: Composition with generics
class Component<T> {
  constructor(public data: T) {}
}

class Entity {
  private components = new Map<string, Component<any>>();

  addComponent<T>(name: string, component: Component<T>): this {
    this.components.set(name, component);
    return this;
  }

  getComponent<T>(name: string): Component<T> | undefined {
    return this.components.get(name);
  }
}

const entity = new Entity()
  .addComponent("position", new Component({ x: 0, y: 0 }))
  .addComponent("health", new Component({ hp: 100 }));
console.log("Entity components:", entity.getComponent("position")?.data);


// ============================================================================
// 2. ABSTRACT CLASSES AND TEMPLATE METHOD
// ============================================================================

console.log("\n=== Abstract Classes and Template Method ===");

// TypeScript: Abstract classes with abstract methods
abstract class DataProcessor {
  // Template method defining the algorithm skeleton
  process(data: string[]): string[] {
    const validated = this.validate(data);
    const transformed = this.transform(validated);
    this.save(transformed);
    return transformed;
  }

  // Abstract methods - must be implemented
  protected abstract validate(data: string[]): string[];
  protected abstract transform(data: string[]): string[];
  protected abstract save(data: string[]): void;
}

class CSVProcessor extends DataProcessor {
  protected validate(data: string[]): string[] {
    return data.filter(d => d.includes(","));
  }

  protected transform(data: string[]): string[] {
    return data.map(d => d.split(",").join("|"));
  }

  protected save(data: string[]): void {
    console.log("Saving CSV data:", data);
  }
}

const csvProcessor = new CSVProcessor();
csvProcessor.process(["a,b,c", "d,e,f", "invalid"]);


// ============================================================================
// 3. STRATEGY PATTERN WITH POLYMORPHISM
// ============================================================================

console.log("\n=== Strategy Pattern with Polymorphism ===");

// TypeScript: Strategy interface
interface PaymentStrategy {
  readonly type: string;
  pay(amount: number): { success: boolean; transactionId: string };
}

class CreditCardStrategy implements PaymentStrategy {
  readonly type = "credit_card";

  constructor(private cardNumber: string) {}

  pay(amount: number): { success: boolean; transactionId: string } {
    console.log(`Paying ${amount} with ${this.cardNumber.slice(-4)}`);
    return { success: true, transactionId: `cc-${Date.now()}` };
  }
}

class PayPalStrategy implements PaymentStrategy {
  readonly type = "paypal";

  constructor(private email: string) {}

  pay(amount: number): { success: boolean; transactionId: string } {
    console.log(`Paying ${amount} with ${this.email}`);
    return { success: true, transactionId: `paypal-${Date.now()}` };
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  processPayment(amount: number): { success: boolean; transactionId: string } {
    return this.strategy.pay(amount);
  }
}

const processor = new PaymentProcessor(new CreditCardStrategy("4111-1111-1111-1111"));
processor.processPayment(100);
processor.setStrategy(new PayPalStrategy("user@example.com"));
processor.processPayment(50);


// ============================================================================
// 4. MIXINS WITH TYPES
// ============================================================================

console.log("\n=== Mixins with Types ===");

// TypeScript: Generic mixin function
type Constructor<T = {}> = new (...args: any[]) => T;

function Loggable<TBase extends Constructor>(Base: TBase) {
  return class Loggable extends Base {
    log(message: string): void {
      console.log(`[LOG] ${message}`);
    }
  };
}

function Serializable<TBase extends Constructor>(Base: TBase) {
  return class Serializable extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }
  };
}

class BaseUser {
  constructor(public name: string, public age: number) {}
}

class User extends Serializable(Loggable(BaseUser)) {}

const user = new User("Alice", 30);
user.log("User created");
console.log("Serialized:", user.serialize());


// ============================================================================
// 5. DISCRIMINATED UNIONS
// ============================================================================

console.log("\n=== Discriminated Unions ===");

// TypeScript: Discriminated unions for algebraic data types
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // Exhaustiveness check
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

const circle: Shape = { kind: "circle", radius: 5 };
const rectangle: Shape = { kind: "rectangle", width: 10, height: 20 };
console.log("Circle area:", calculateArea(circle));
console.log("Rectangle area:", calculateArea(rectangle));


// ============================================================================
// 6. VISITOR PATTERN WITH INTERFACES
// ============================================================================

console.log("\n=== Visitor Pattern with Interfaces ===");

// TypeScript: Visitor pattern with explicit types
interface FileSystemNode {
  accept<T>(visitor: FileSystemVisitor<T>): T;
}

class FileNode implements FileSystemNode {
  constructor(public name: string, public size: number) {}

  accept<T>(visitor: FileSystemVisitor<T>): T {
    return visitor.visitFile(this);
  }
}

class DirectoryNode implements FileSystemNode {
  constructor(public name: string, public children: FileSystemNode[] = []) {}

  accept<T>(visitor: FileSystemVisitor<T>): T {
    return visitor.visitDirectory(this);
  }
}

interface FileSystemVisitor<T> {
  visitFile(file: FileNode): T;
  visitDirectory(directory: DirectoryNode): T;
}

class SizeCalculator implements FileSystemVisitor<number> {
  visitFile(file: FileNode): number {
    return file.size;
  }

  visitDirectory(directory: DirectoryNode): number {
    return directory.children.reduce((sum, child) => sum + child.accept(this), 0);
  }
}

const root = new DirectoryNode("root", [
  new FileNode("file1.txt", 100),
  new FileNode("file2.txt", 200),
  new DirectoryNode("subdir", [
    new FileNode("file3.txt", 300)
  ])
]);

const sizeCalculator = new SizeCalculator();
console.log("Total size:", root.accept(sizeCalculator));


// ============================================================================
// 7. GENERIC CONSTRAINTS
// ============================================================================

console.log("\n=== Generic Constraints ===");

// TypeScript: Constraints on generic type parameters
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

class Repository<T extends HasId & HasName> {
  private items = new Map<number, T>();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  findByName(name: string): T[] {
    return Array.from(this.items.values()).filter(item => item.name === name);
  }
}

interface User extends HasId, HasName {
  email: string;
}

const userRepository = new Repository<User>();
userRepository.add({ id: 1, name: "Alice", email: "alice@example.com" });
userRepository.add({ id: 2, name: "Bob", email: "bob@example.com" });
console.log("User with id 1:", userRepository.findById(1));
console.log("Users named Alice:", userRepository.findByName("Alice"));


// ============================================================================
// 8. OBSERVER PATTERN WITH TYPES
// ============================================================================

console.log("\n=== Observer Pattern with Types ===");

// TypeScript: Typed observer pattern
interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  subscribe(observer: Observer<T>): () => void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

class TypedSubject<T> implements Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    this.observers.push(observer);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

class DataObserver implements Observer<string> {
  constructor(private name: string) {}

  update(data: string): void {
    console.log(`[${this.name}] Received: ${data}`);
  }
}

const typedSubject = new TypedSubject<string>();
const observer1 = new DataObserver("Observer1");
const observer2 = new DataObserver("Observer2");

const unsubscribe1 = typedSubject.subscribe(observer1);
typedSubject.subscribe(observer2);

typedSubject.notify("Hello observers!");
unsubscribe1();
typedSubject.notify("After unsubscribe");


// ============================================================================
// 9. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Inheritance Patterns ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Interface-based composition│       ✗         │       ✓         │
│ Abstract classes           │  Manual pattern │  Native support │
│ Strategy pattern types     │  Runtime only   │  Interface typed│
│ Mixin type inference       │       ✗         │       ✓         │
│ Discriminated unions       │       ✗         │       ✓         │
│ Visitor pattern types      │  Runtime only   │  Generic types  │
│ Observer pattern types     │  Runtime only   │  Generic types  │
│ Generic constraints        │       ✗         │       ✓         │
│ Type-safe composition      │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time type safety to inheritance patterns
2. Interfaces enable better composition contracts
3. Abstract classes provide native template method support
4. Generic mixins preserve type information through composition
5. Type-safe observer pattern with generic Subject/Observer
6. Runtime pattern behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");


// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== TypeScript Inheritance Patterns Summary ===");
console.log("1. Interface-based composition");
console.log("2. Abstract classes and template method");
console.log("3. Strategy pattern with polymorphism");
console.log("4. Typed mixins");
console.log("5. Discriminated unions");
console.log("6. Visitor pattern with interfaces");
console.log("7. Generic constraints");
console.log("8. Observer pattern with types");

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Type-safe composition");
console.log("- Exhaustive switch checks");
console.log("- Better pattern matching");
console.log("- Mixin type inference");
console.log("- Generic observer/subject pattern");
