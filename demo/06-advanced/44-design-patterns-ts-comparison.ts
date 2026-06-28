// TypeScript vs JavaScript: Design Patterns Comparison
// 📘 For JavaScript examples, see: 44-design-patterns.js
// This file demonstrates TypeScript-specific type features for design patterns

export {}; // Make this file a module

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
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
}

class TypedUserFactory {
  static createUser(type: User['role'], name: string): User {
    const baseUser = { id: crypto.randomUUID(), name };
    
    switch (type) {
      case 'admin':
        return { ...baseUser, role: 'admin', permissions: ['read', 'write', 'delete'] };
      case 'editor':
        return { ...baseUser, role: 'editor', permissions: ['read', 'write'] };
      case 'viewer':
        return { ...baseUser, role: 'viewer', permissions: ['read'] };
    }
  }
}

const admin: User = TypedUserFactory.createUser('admin', 'Alice');
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
      onClick: (handler) => console.log("Dark button clicked")
    };
  }
  
  createInput(): Input {
    return {
      render: () => console.log("📝 Dark Input"),
      getValue: () => ""
    };
  }
}

// Generic factory function
function createFactory<T extends Product>(
  type: string,
  creator: (type: string) => T
): T {
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
    this.events[event] = this.events[event]!.filter(
      listener => listener !== listenerToRemove
    );
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
    this.emit('priceUpdate', { symbol, price });
  }
}

const market = new TypedStockMarket();

market.on('priceUpdate', ({ symbol, price }) => {
  console.log(`📊 ${symbol} is now $${price}`);
});

market.on('error', ({ message, code }) => {
  console.log(`❌ Error ${code}: ${message}`);
});

market.updatePrice('AAPL', 150);

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
function Singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
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
  
  descriptor.value = function(...args: any[]) {
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
    configurable: false
  });
}

@Singleton
class DecoratedService {
  // @ts-expect-error — legacy decorators require experimentalDecorators: true
  @ReadOnly
  readonly apiUrl: string = "https://api.example.com";

  // @ts-expect-error — legacy decorators require experimentalDecorators: true
  @Log
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

  descriptor.value = function(this: any, ...args: Parameters<T>): ReturnType<T> {
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
  // @ts-expect-error — legacy decorators require experimentalDecorators: true
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use interfaces to define contracts");
console.log("2. Leverage generics for reusable patterns");
console.log("3. Use private constructors for Singletons");
console.log("4. Type event emitters with event maps");
console.log("5. Use decorators for cross-cutting concerns");

console.log("\n❌ DON'T:");
console.log("1. Don't use any type in pattern implementations");
console.log("2. Don't ignore type constraints in factories");
console.log("3. Don't forget to type event data");
console.log("4. Don't overuse decorators");

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
└─────────────────────────────────────────────────────────────────────┘
`);
