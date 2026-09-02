// TypeScript vs JavaScript: Design Patterns Comparison
// 📘 For JavaScript examples, see: 44-design-patterns.js
// This file demonstrates TypeScript-specific type features for design patterns

// 🎯 Difficulty: Advanced
export {}; // Make this file a module

// ============================================
// Table of Contents
// ============================================
// 1. Factory Pattern - Type Safety
// 2. Singleton Pattern - Private Constructor
// 3. Observer Pattern - Type-safe Event Maps
// 4. Strategy Pattern - Interface Contracts
// 5. Decorator Pattern - Metadata & Generic Decorators
// 6. Adapter Pattern - Interface Compatibility
// 7. Facade Pattern - Simplified Interface
// 8. Command Pattern - Encapsulated Requests
// 9. State Pattern - Typed State Transitions
// 10. Common Pitfalls (TypeScript-specific)
// 11. Best Practices (TypeScript-specific)

// ============================================
// Section 1: Factory Pattern - Type Safety
// ============================================

console.log("=== Factory Pattern - Type Safety ===\n");

// Generic Factory with type constraints
interface Product {
  id: string;
  name: string;
}

interface User extends Product {
  role: "admin" | "editor" | "viewer";
  permissions: string[];
}

class TypedUserFactory {
  static createUser(type: User["role"], name: string): User {
    const baseUser = { id: crypto.randomUUID(), name };

    switch (type) {
      case "admin":
        return {
          ...baseUser,
          role: "admin",
          permissions: ["read", "write", "delete"],
        };
      case "editor":
        return { ...baseUser, role: "editor", permissions: ["read", "write"] };
      case "viewer":
        return { ...baseUser, role: "viewer", permissions: ["read"] };
    }
  }
}

const admin: User = TypedUserFactory.createUser("admin", "Alice");
console.log("Typed admin:", admin);

// Abstract Factory with interfaces
interface Button {
  render(): void;
  onClick(handler: () => void): void;
}

interface Input {
  render(): void;
  getValue(): string;
}

interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}

class DarkThemeFactory implements UIFactory {
  createButton(): Button {
    return {
      render: () => console.log("🔘 Dark Button"),
      onClick: handler => console.log("Dark button clicked"),
    };
  }

  createInput(): Input {
    return {
      render: () => console.log("📝 Dark Input"),
      getValue: () => "",
    };
  }
}

// Generic factory function
function createFactory<T extends Product>(type: string, creator: (type: string) => T): T {
  return creator(type);
}

// ============================================
// Section 2: Singleton Pattern - Private Constructor
// ============================================

console.log("\n=== Singleton Pattern - Private Constructor ===\n");

class TypedDatabase {
  private static instance: TypedDatabase;
  private connection: string | null = null;
  private data: Array<{ id: number; name: string }> = [];

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): TypedDatabase {
    if (!TypedDatabase.instance) {
      TypedDatabase.instance = new TypedDatabase();
    }
    return TypedDatabase.instance;
  }

  connect(): void {
    if (!this.connection) {
      this.connection = "Connected to database";
      console.log("✅ Database connected");
    } else {
      console.log("⚠️ Already connected");
    }
  }

  query(sql: string): typeof this.data {
    console.log(`🔍 Executing: ${sql}`);
    return this.data;
  }

  insert(item: { id: number; name: string }): void {
    this.data.push(item);
    console.log(`➕ Inserted: ${JSON.stringify(item)}`);
  }
}

const db1 = TypedDatabase.getInstance();
const db2 = TypedDatabase.getInstance();
console.log("Same instance?", db1 === db2);

db1.connect();
db1.insert({ id: 1, name: "Alice" });

// Generic Singleton
class GenericSingleton<T> {
  private static instances = new Map<string, any>();

  static getInstance<T>(key: string, creator: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key);
  }
}

// ============================================
// Section 3: Observer Pattern - Type-Safe Events
// ============================================

console.log("\n=== Observer Pattern - Type-Safe Events ===\n");

// Type-safe event emitter
type EventMap = {
  priceUpdate: { symbol: string; price: number };
  error: { message: string; code: number };
  connected: void;
};

class TypedEventEmitter<T extends Record<string, any>> {
  private events: {
    [K in keyof T]?: Array<(data: T[K]) => void>;
  } = {};

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(listener);
  }

  off<K extends keyof T>(event: K, listenerToRemove: (data: T[K]) => void): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event]!.filter(listener => listener !== listenerToRemove);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    if (!this.events[event]) return;
    this.events[event]!.forEach(listener => listener(data));
  }
}

class TypedStockMarket extends TypedEventEmitter<EventMap> {
  private prices: Map<string, number> = new Map();

  updatePrice(symbol: string, price: number): void {
    this.prices.set(symbol, price);
    this.emit("priceUpdate", { symbol, price });
  }
}

const market = new TypedStockMarket();

market.on("priceUpdate", ({ symbol, price }) => {
  console.log(`📊 ${symbol} is now $${price}`);
});

market.on("error", ({ message, code }) => {
  console.log(`❌ Error ${code}: ${message}`);
});

market.updatePrice("AAPL", 150);

// ============================================
// Section 4: Strategy Pattern - Interface-Based
// ============================================

console.log("\n=== Strategy Pattern - Interface-Based ===\n");

interface PaymentStrategy {
  pay(amount: number): void;
}

class TypedCreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  pay(amount: number): void {
    console.log(`💳 Paid $${amount} with card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class TypedPayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`🅿️ Paid $${amount} via PayPal (${this.email})`);
  }
}

class TypedShoppingCart {
  private items: Array<{ item: string; price: number }> = [];
  private paymentStrategy: PaymentStrategy | null = null;

  addItem(item: string, price: number): void {
    this.items.push({ item, price });
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`\n🛒 Cart total: $${total}`);
    if (this.paymentStrategy) {
      this.paymentStrategy.pay(total);
    } else {
      console.log("❌ No payment method selected");
    }
  }
}

const cart = new TypedShoppingCart();
cart.addItem("Laptop", 999);
cart.setPaymentStrategy(new TypedCreditCardPayment("1234-5678-9012-3456"));
cart.checkout();

// Generic strategy pattern
interface Strategy<TInput, TOutput> {
  execute(input: TInput): TOutput;
}

class SortStrategy<T> implements Strategy<T[], T[]> {
  constructor(private compareFn: (a: T, b: T) => number) {}

  execute(input: T[]): T[] {
    return [...input].sort(this.compareFn);
  }
}

// ============================================
// Section 5: Decorator Pattern - Metadata
// ============================================

console.log("\n=== Decorator Pattern - Metadata ===\n");

// Class decorator
function Singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    static instance: any;

    constructor(...args: any[]) {
      super(...args);
      const Class = this.constructor as any;
      if (Class.instance) {
        return Class.instance;
      }
      Class.instance = this;
    }
  };
}

// Method decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`📝 Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`📝 Result:`, result);
    return result;
  };

  return descriptor;
}

// Property decorator
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false,
  });
}

// Decorator applications below are commented out — ts-node ESM does NOT transpile
// legacy class/method/property decorators, so an active `@` crashes at runtime.
// @Singleton
class DecoratedService {
  // @ReadOnly
  readonly apiUrl: string = "https://api.example.com";

  // @Log
  fetchData(id: number): string {
    return `Data for ID: ${id}`;
  }
}

const service1 = new DecoratedService();
const service2 = new DecoratedService();
console.log("Singleton via decorator:", service1 === service2);

service1.fetchData(123);

// Function decorator with generics
function Memoize<T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  const originalMethod = descriptor.value!;
  const cache = new Map<string, ReturnType<T>>();

  descriptor.value = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("📦 Cache hit");
      return cache.get(key)!;
    }
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;

  return descriptor;
}

class Calculator {
  // @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// ============================================
// Section 6: Adapter Pattern - Interface Compatibility
// ============================================

console.log("\n=== Adapter Pattern - Type Safety ===\n");

// Define typed interfaces for incompatible APIs
interface ModernPaymentResult {
  success: boolean;
  transactionId: string;
}

interface LegacyPaymentResult {
  success: boolean;
  legacyId: string;
}

interface ModernPaymentGateway {
  charge(amount: number, currency: string): ModernPaymentResult;
}

class OldPaymentSystem {
  processPayment(amountInCents: number, currencyCode: string): LegacyPaymentResult {
    console.log(`Paid ${amountInCents} ${currencyCode} via legacy system`);
    return { success: true, legacyId: "legacy_" + Date.now() };
  }
}

// Type-safe adapter implements the modern interface
class PaymentAdapter implements ModernPaymentGateway {
  constructor(private oldSystem: OldPaymentSystem) {}

  charge(amount: number, currency: string): ModernPaymentResult {
    const amountInCents = Math.round(amount * 100);
    const result = this.oldSystem.processPayment(amountInCents, currency);
    // TypeScript enforces correct adaptation — can't return LegacyPaymentResult here
    return { success: result.success, transactionId: result.legacyId };
  }
}

const oldSystem = new OldPaymentSystem();
const adapter = new PaymentAdapter(oldSystem);
console.log("Through typed adapter:", JSON.stringify(adapter.charge(9.99, "USD")));

// Functional adapter with generic types
function createAdapter<TArgs extends any[], UArgs extends any[], R>(
  oldFn: (...args: UArgs) => R,
  transform: (...args: TArgs) => UArgs
): (...args: TArgs) => R {
  return (...args: TArgs) => oldFn(...transform(...args));
}

function greetOld(name: string, age: number): string {
  return `Hello ${name}, you are ${age} years old`;
}

interface Person {
  name: string;
  age: number;
}

const greetNew = createAdapter(greetOld, (p: Person): [string, number] => [p.name, p.age]);
console.log("\nFunctional typed adapter:", greetNew({ name: "Alice", age: 30 }));

// ============================================
// Section 7: Facade Pattern - Simplified Interface
// ============================================

console.log("\n=== Facade Pattern - Type Safety ===\n");

// Subsystem components with proper types
class CPU {
  freeze(): string {
    return "CPU frozen";
  }
  jump(position: string): string {
    return `CPU jumping to ${position}`;
  }
  execute(): string {
    return "CPU executing";
  }
}

class Memory {
  load(position: string, data: string): string {
    return `Memory loaded "${data}" at ${position}`;
  }
}

class HardDrive {
  read(lba: string, size: number): string {
    return `HardDrive reading ${size} bytes from ${lba}`;
  }
}

// Facade hides subsystem complexity behind a simple typed interface
interface IComputer {
  start(): void;
  shutdown(): void;
}

class ComputerFacade implements IComputer {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;

  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start(): void {
    console.log("Starting computer...");
    console.log("  " + this.cpu.freeze());
    console.log("  " + this.memory.load("0x00", "boot_loader"));
    console.log("  " + this.cpu.jump("0x00"));
    console.log("  " + this.cpu.execute());
    console.log("  " + this.hardDrive.read("0x1000", 4096));
    console.log("Computer started successfully!");
  }

  shutdown(): void {
    console.log("Shutting down... saving state, powering off.");
  }
}

const computer: IComputer = new ComputerFacade();
computer.start();
computer.shutdown();

// ============================================
// Section 8: Command Pattern - Encapsulated Requests
// ============================================

console.log("\n=== Command Pattern - Type Safety ===\n");

// Command interface with typed execute/undo
interface Command {
  execute(): number;
  undo(): number;
}

class CalculatorReceiver {
  value: number = 0;
  add(n: number): void {
    this.value += n;
  }
  subtract(n: number): void {
    this.value -= n;
  }
  multiply(n: number): void {
    this.value *= n;
  }
  divide(n: number): void {
    this.value /= n;
  }
}

// Each command satisfies the Command interface
class AddCommand implements Command {
  constructor(
    private calculator: CalculatorReceiver,
    private amount: number
  ) {}

  execute(): number {
    this.calculator.add(this.amount);
    return this.calculator.value;
  }

  undo(): number {
    this.calculator.subtract(this.amount);
    return this.calculator.value;
  }
}

class MultiplyCommand implements Command {
  constructor(
    private calculator: CalculatorReceiver,
    private amount: number
  ) {}

  execute(): number {
    this.calculator.multiply(this.amount);
    return this.calculator.value;
  }

  undo(): number {
    this.calculator.divide(this.amount);
    return this.calculator.value;
  }
}

// Invoker with typed command history
class CommandHistory {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): number {
    const result = command.execute();
    this.history.push(command);
    this.redoStack = [];
    return result;
  }

  undo(): number | null {
    const command = this.history.pop();
    if (command) {
      this.redoStack.push(command);
      return command.undo();
    }
    return null;
  }

  redo(): number | null {
    const command = this.redoStack.pop();
    if (command) {
      this.history.push(command);
      return command.execute();
    }
    return null;
  }
}

const calc = new CalculatorReceiver();
const history = new CommandHistory();

console.log("Initial:", calc.value);
console.log("Add 10:", history.execute(new AddCommand(calc, 10)));
console.log("Multiply 3:", history.execute(new MultiplyCommand(calc, 3)));
console.log("Undo:", history.undo());
console.log("Undo:", history.undo());
console.log("Redo:", history.redo());

// ============================================
// Section 9: State Pattern - Typed State Transitions
// ============================================

console.log("\n=== State Pattern - Type Safety ===\n");

// State interface — all states must implement these methods
interface TrafficLightState {
  change(): void;
  getColor(): string;
}

// Context class — delegates to the current state
class TrafficLight {
  private state: TrafficLightState;

  constructor() {
    this.state = new RedState(this);
  }

  setState(state: TrafficLightState): void {
    this.state = state;
  }

  change(): void {
    this.state.change();
  }

  getColor(): string {
    return this.state.getColor();
  }
}

// Concrete states reference context for transitions
class RedState implements TrafficLightState {
  constructor(private context: TrafficLight) {}

  change(): void {
    console.log("🔴 Red → 🟢 Green");
    this.context.setState(new GreenState(this.context));
  }

  getColor(): string {
    return "red";
  }
}

class GreenState implements TrafficLightState {
  constructor(private context: TrafficLight) {}

  change(): void {
    console.log("🟢 Green → 🟡 Yellow");
    this.context.setState(new YellowState(this.context));
  }

  getColor(): string {
    return "green";
  }
}

class YellowState implements TrafficLightState {
  constructor(private context: TrafficLight) {}

  change(): void {
    console.log("🟡 Yellow → 🔴 Red");
    this.context.setState(new RedState(this.context));
  }

  getColor(): string {
    return "yellow";
  }
}

const light = new TrafficLight();
for (let i = 0; i < 4; i++) {
  console.log("Current color:", light.getColor());
  light.change();
}

// Order state machine example with discriminated union states
type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

interface OrderState {
  status: OrderStatus;
}

class OrderMachine {
  private state: OrderState = { status: "pending" };

  transition(action: "pay" | "ship" | "deliver"): void {
    switch (this.state.status) {
      case "pending":
        if (action === "pay") {
          this.state = { status: "paid" };
          console.log("pending --pay--> paid");
        } else console.log(`Invalid transition: ${action} from pending`);
        break;
      case "paid":
        if (action === "ship") {
          this.state = { status: "shipped" };
          console.log("paid --ship--> shipped");
        } else console.log(`Invalid transition: ${action} from paid`);
        break;
      case "shipped":
        if (action === "deliver") {
          this.state = { status: "delivered" };
          console.log("shipped --deliver--> delivered");
        } else console.log(`Invalid transition: ${action} from shipped`);
        break;
      case "delivered":
        console.log("Order already delivered");
        break;
    }
  }

  getStatus(): OrderStatus {
    return this.state.status;
  }
}

const orderMachine = new OrderMachine();
orderMachine.transition("pay");
orderMachine.transition("ship");
orderMachine.transition("deliver");
orderMachine.transition("pay");

// ============================================
// Section 10: Common Pitfalls (TypeScript-specific)
// ============================================

console.log("\n=== Common Pitfalls (TypeScript) ===\n");

console.log("⚠️ Pitfall 1: Overusing `any` defeats type safety in patterns");
console.log("  Bad:  createUser(data: any): User");
console.log("  Good: createUser<T extends User>(data: T): T");

console.log("\n⚠️ Pitfall 2: Decorators add runtime indirection");
console.log("  Each decorator wraps the original method; debug stack traces get longer");
console.log("  Fix: Limit decorator depth; prefer composition for simple cases");

console.log("\n⚠️ Pitfall 3: Singletons with private constructors can't be subclassed");
console.log(
  "  Fix: Use dependency injection instead of hard-coded singletons when testability matters"
);

console.log("\n⚠️ Pitfall 4: Over-engineering with patterns");
console.log(
  "  A simple object literal or closure is often enough; don't introduce patterns prematurely"
);

console.log("\n⚠️ Pitfall 5: Type assertions hiding bugs in adapters");
console.log("  Bad:  return oldResult as ModernResult  // lies about shape");
console.log("  Good: explicitly map each field, letting TS catch missing properties");

// ============================================
// Section 11: Best Practices (TypeScript-specific)
// ============================================

console.log("\n=== Best Practices (TypeScript) ===\n");

console.log("✅ DO:");
console.log("1. Define interfaces for every pattern's contract (Command, State, Strategy, etc.)");
console.log("2. Use generics to make factories and adapters type-safe without casting");
console.log(
  "3. Use private constructors for singletons to enforce single-instance at compile time"
);
console.log("4. Use discriminated unions for state machines — exhaustiveness checked by compiler");
console.log("5. Prefer composition over inheritance; type composition via intersection types");

console.log("\n❌ DON'T:");
console.log("1. Don't use `any` in pattern implementations — it defeats the purpose of TS");
console.log("2. Don't ignore type errors with `@ts-ignore` — fix the types instead");
console.log("3. Don't overuse decorators; they add runtime overhead and complexity");
console.log("4. Don't apply patterns blindly — let the problem drive the choice");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - Design Patterns                         │
├─────────────────────────────────────────────────────────────────────┤
│ Factory Pattern:                                                    │
│   JavaScript: Dynamic object creation                               │
│   TypeScript: Generic factories with type constraints               │
│                                                                      │
│ Singleton Pattern:                                                  │
│   JavaScript: Instance property check                               │
│   TypeScript: Private constructor + static getInstance()            │
│                                                                      │
│ Observer Pattern:                                                   │
│   JavaScript: String-based events                                   │
│   TypeScript: Type-safe event maps with generics                    │
│                                                                      │
│ Strategy Pattern:                                                   │
│   JavaScript: Duck typing                                           │
│   TypeScript: Interface-based with compile-time checks              │
│                                                                      │
│ Decorator Pattern:                                                  │
│   JavaScript: Function wrapping                                     │
│   TypeScript: @decorator syntax with metadata                       │
│                                                                      │
│ Adapter Pattern:                                                    │
│   JavaScript: Duck-typed object wrapping                            │
│   TypeScript: implements interface enforces correct adaptation      │
│                                                                      │
│ Facade Pattern:                                                     │
│   JavaScript: Plain class hiding subsystem                          │
│   TypeScript: Interface defines the simplified public surface       │
│                                                                      │
│ Command Pattern:                                                    │
│   JavaScript: Duck-typed { execute, undo } objects                  │
│   TypeScript: Command interface — type-safe history/redo/undo       │
│                                                                      │
│ State Pattern:                                                      │
│   JavaScript: State objects assigned to this.state                  │
│   TypeScript: State interface + discriminated unions for status     │
└─────────────────────────────────────────────────────────────────────┘
`);
