// TypeScript vs JavaScript: Symbol Deep Comparison
// 📘 For JavaScript examples, see: 19-symbol-deep.js
// This file demonstrates TypeScript-specific typing for Symbols

export {};

// ============================================================================
// 1. UNIQUE SYMBOL TYPE
// ============================================================================

// JavaScript: Each Symbol is unique at runtime
// const sym1 = Symbol("id");
// const sym2 = Symbol("id");
// sym1 !== sym2

// TypeScript: unique symbol type for compile-time uniqueness
const UNIQUE_ID: unique symbol = Symbol("id");
const UNIQUE_NAME: unique symbol = Symbol("name");

// unique symbol can only be used with const
// let notAllowed: unique symbol = Symbol(); // ❌ Error

interface Entity {
  [UNIQUE_ID]: number;
  [UNIQUE_NAME]: string;
}

const entity: Entity = {
  [UNIQUE_ID]: 1,
  [UNIQUE_NAME]: "Test"
};

console.log("=== Unique Symbol Type ===");
console.log(entity[UNIQUE_ID]);
console.log(entity[UNIQUE_NAME]);


// ============================================================================
// 2. SYMBOL INDEX SIGNATURES
// ============================================================================

// TypeScript: Symbol index signatures
const symKey = Symbol("key");

interface SymbolIndexable {
  [symKey: symbol]: string;
  name: string;
}

// Note: Symbol index signatures are rare and have limitations
// Most commonly used with known symbol keys

// Well-known symbol typing
class CustomIterable implements Iterable<string> {
  private items: string[] = ["a", "b", "c"];

  [Symbol.iterator](): Iterator<string> {
    return this.items[Symbol.iterator]();
  }
}

console.log("\n=== Symbol Index Signatures ===");
for (const item of new CustomIterable()) {
  console.log(item);
}


// ============================================================================
// 3. WELL-KNOWN SYMBOL TYPING
// ============================================================================

// TypeScript: Built-in well-known symbol types

// Symbol.iterator
interface Range {
  from: number;
  to: number;
  [Symbol.iterator](): Iterator<number>;
}

class NumberRange implements Range {
  constructor(
    public from: number,
    public to: number
  ) {}

  [Symbol.iterator](): Iterator<number> {
    let current = this.from;
    const to = this.to;
    return {
      next: (): IteratorResult<number> => {
        if (current <= to) {
          return { done: false, value: current++ };
        }
        return { done: true, value: undefined };
      }
    };
  }
}

console.log("\n=== Well-Known Symbol Typing ===");
for (const num of new NumberRange(1, 5)) {
  console.log(num);
}


// ============================================================================
// 4. SYMBOL.TO PRIMITIVE TYPING
// ============================================================================

// TypeScript: Symbol.toPrimitive with proper typing
class Money {
  constructor(
    public dollars: number,
    public cents: number
  ) {}

  [Symbol.toPrimitive](hint: string): string | number {
    if (hint === "string") {
      return `${this.dollars}.${this.cents.toString().padStart(2, '0')} USD`;
    }
    if (hint === "number") {
      return this.dollars + this.cents / 100;
    }
    return this.dollars + this.cents / 100;
  }
}

console.log("\n=== Symbol.toPrimitive Typing ===");
const money = new Money(100, 50);
console.log(String(money)); // "100.50 USD"
console.log(+money); // 100.5


// ============================================================================
// 5. SYMBOL.TO STRING TAG TYPING
// ============================================================================

// TypeScript: Symbol.toStringTag for custom toString output
class Validator {
  validate(value: unknown): boolean {
    return typeof value === "string";
  }

  get [Symbol.toStringTag](): string {
    return "Validator";
  }
}

class ApiClient {
  get [Symbol.toStringTag](): string {
    return "ApiClient";
  }
}

console.log("\n=== Symbol.toStringTag Typing ===");
const validator = new Validator();
const client = new ApiClient();

console.log(Object.prototype.toString.call(validator)); // [object Validator]
console.log(Object.prototype.toString.call(client));    // [object ApiClient]


// ============================================================================
// 6. SYMBOL.HAS INSTANCE CUSTOMIZATION
// ============================================================================

// TypeScript: Symbol.hasInstance with proper typing
class EvenNumber {
  static [Symbol.hasInstance](obj: unknown): boolean {
    return typeof obj === "number" && obj % 2 === 0;
  }
}

console.log("\n=== Symbol.hasInstance Typing ===");
// Note: instanceof with custom Symbol.hasInstance requires type assertion
const testValue1: unknown = 4;
const testValue2: unknown = 3;
const testValue3: unknown = "4";
console.log(EvenNumber[Symbol.hasInstance](testValue1));   // true
console.log(EvenNumber[Symbol.hasInstance](testValue2));   // false
console.log(EvenNumber[Symbol.hasInstance](testValue3));   // false


// ============================================================================
// 7. SYMBOL.FOR AND GLOBAL REGISTRY TYPING
// ============================================================================

// TypeScript: Symbol.for returns symbol type
const GLOBAL_SYMBOL = Symbol.for("app.global");

// Symbol.keyFor returns string | undefined
const key: string | undefined = Symbol.keyFor(GLOBAL_SYMBOL);

// Type guard for global symbols
function isGlobalSymbol(sym: symbol): sym is symbol {
  return Symbol.keyFor(sym) !== undefined;
}

console.log("\n=== Symbol.for Global Registry ===");
console.log(`Global symbol key: ${key}`);
console.log(Symbol.for("app.global") === GLOBAL_SYMBOL); // true


// ============================================================================
// 8. SYMBOL IN INTERFACES AND TYPES
// ============================================================================

// Using symbols in interface definitions
interface SymbolMethods {
  [Symbol.iterator](): Iterator<unknown>;
  [Symbol.toStringTag]: string;
}

interface AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

// Implementing multiple symbol interfaces
class DataCollection implements Iterable<string>, SymbolMethods {
  private data: string[] = [];

  [Symbol.iterator](): Iterator<string> {
    return this.data[Symbol.iterator]();
  }

  get [Symbol.toStringTag](): string {
    return "DataCollection";
  }
}

console.log("\n=== Symbol in Interfaces ===");


// ============================================================================
// 9. ASYNC ITERATOR TYPING
// ============================================================================

// TypeScript: Symbol.asyncIterator with proper types
class AsyncDataStreamer implements AsyncIterable<number> {
  constructor(
    private data: number[],
    private delay: number = 100
  ) {}

  async *[Symbol.asyncIterator](): AsyncIterator<number> {
    for (const item of this.data) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
      yield item;
    }
  }
}

console.log("\n=== Async Iterator Typing ===");
(async () => {
  const streamer = new AsyncDataStreamer([1, 2, 3, 4, 5]);
  for await (const num of streamer) {
    console.log(num);
  }
})();


// ============================================================================
// 10. SYMBOL UTILITY TYPES
// ============================================================================

// Extract symbol keys from type
type SymbolKeys<T> = {
  [K in keyof T]: K extends symbol ? K : never;
}[keyof T];

// Extract string keys from type
type StringKeys<T> = {
  [K in keyof T]: K extends string ? K : never;
}[keyof T];

interface MixedKeys {
  name: string;
  age: number;
  [Symbol.iterator](): Iterator<unknown>;
  [Symbol.toStringTag]: string;
}

type MySymbolKeys = SymbolKeys<MixedKeys>;
type MyStringKeys = StringKeys<MixedKeys>;

console.log("\n=== Symbol Utility Types ===");


// ============================================================================
// 11. BRAND SYMBOLS FOR NOMINAL TYPING
// ============================================================================

// Using unique symbols for branding/nominal types
declare const brand: unique symbol;

type Brand<T, B> = T & { [brand]: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

function processOrder(id: OrderId): void {
  console.log(`Processing order: ${id}`);
}

console.log("\n=== Brand Symbols ===");
const userId = createUserId("user-123");
// processOrder(userId); // ❌ Error: UserId is not assignable to OrderId


// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Symbols ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ unique symbol type         │       ✗         │       ✓         │
│ Symbol index signatures    │       ✗         │       ✓         │
│ Well-known symbol typing   │  Runtime only   │  Typed         │
│ Symbol.toPrimitive types   │       ✗         │       ✓         │
│ Symbol.toStringTag typing  │       ✗         │       ✓         │
│ Symbol.hasInstance typing  │       ✗         │       ✓         │
│ AsyncIterator typing       │       ✗         │       ✓         │
│ Brand symbols              │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Symbol uniqueness          │    Same         │    Same         │
│ Global registry            │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds unique symbol type for constants
2. Well-known symbols have proper interface types
3. Symbol methods can be typed with interfaces
4. Async iterators have full type support
5. Runtime Symbol behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
