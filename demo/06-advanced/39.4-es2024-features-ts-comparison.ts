// TypeScript vs JavaScript: ES2024 Features
// 📘 For JavaScript version, see: 39.4-es2024-features.js
/// <reference lib="es2024" />

export {}; // Module

console.log("\n=== TypeScript ES2024 Features Comparison ===\n");

// ============================================
// 1. Object.groupBy() and Map.groupBy()
// ============================================
console.log("\n--- 1. Object.groupBy() and Map.groupBy() ---\n");

interface InventoryItem {
  name: string;
  type: "vegetable" | "fruit" | "meat";
  quantity: number;
}

const inventory: InventoryItem[] = [
  { name: "asparagus", type: "vegetable", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 10 },
  { name: "goat", type: "meat", quantity: 3 },
  { name: "cherries", type: "fruit", quantity: 7 },
  { name: "fish", type: "meat", quantity: 2 },
];

// TypeScript infers the return type correctly
const groupedByType = Object.groupBy(inventory, item => item.type);
// groupedByType is typed as Partial<Record<"vegetable" | "fruit" | "meat", InventoryItem[]>>
console.log("Fruits:", groupedByType.fruit); // Type: InventoryItem[] | undefined
console.log("Vegetables:", groupedByType.vegetable); // Type: InventoryItem[] | undefined

// Type safety: accessing non-existent key returns undefined
// console.log(groupedByType.invalid); // ❌ Error: Property 'invalid' does not exist on type ...

// Narrowing the type
if (groupedByType.fruit) {
  console.log("First fruit:", groupedByType.fruit[0].name); // ✅ Type safe
}

// Map.groupBy preserves key types
const restock = Symbol("restock");
const inStock = Symbol("inStock");

const stockStatus = Map.groupBy(inventory, item => {
  return item.quantity < 3 ? restock : inStock;
});
// stockStatus is typed as Map<symbol, InventoryItem[]>
console.log("Needs restock:", stockStatus.get(restock)); // Type: InventoryItem[] | undefined

// Custom key types with Map.groupBy
type Status = "in-stock" | "low-stock" | "out-of-stock";
const byStatus = Map.groupBy(inventory, (item): Status => {
  if (item.quantity === 0) return "out-of-stock";
  if (item.quantity < 3) return "low-stock";
  return "in-stock";
});
// byStatus is typed as Map<Status, InventoryItem[]>
console.log("Low stock items:", byStatus.get("low-stock"));

// ============================================
// 2. Promise.withResolvers()
// ============================================
console.log("\n--- 2. Promise.withResolvers() ---\n");

// Promise.withResolvers is generic in TypeScript
function delay<T>(ms: number, value: T): Promise<T> {
  const { promise, resolve } = Promise.withResolvers<T>();
  setTimeout(() => resolve(value), ms);
  return promise;
}

// Type inference works
const stringPromise = delay(100, "hello"); // Promise<string>
const numberPromise = delay(200, 42); // Promise<number>

stringPromise.then(str => console.log("String length:", str.length)); // ✅ str is string
numberPromise.then(num => console.log("Number doubled:", num * 2)); // ✅ num is number

// Reject type is always unknown (TypeScript limitation)
function mightFail(): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("success");
    } else {
      reject(new Error("Failed")); // reject takes any type
    }
  }, 100);
  return promise;
}

mightFail()
  .then(result => console.log("Result:", result.toUpperCase()))
  .catch(err => {
    if (err instanceof Error) {
      console.error("Error message:", err.message); // ✅ Type safe after narrowing
    }
  });

// Use case: Typed queue
class Queue<T> {
  #items: T[] = [];
  #waitingConsumers: Array<{ resolve: (value: T) => void }> = [];

  enqueue(item: T): void {
    if (this.#waitingConsumers.length > 0) {
      const { resolve } = this.#waitingConsumers.shift()!;
      resolve(item);
    } else {
      this.#items.push(item);
    }
  }

  dequeue(): Promise<T> {
    if (this.#items.length > 0) {
      return Promise.resolve(this.#items.shift()!);
    } else {
      const { promise, resolve } = Promise.withResolvers<T>();
      this.#waitingConsumers.push({ resolve });
      return promise;
    }
  }
}

const stringQueue = new Queue<string>();
stringQueue.enqueue("test");
stringQueue.dequeue().then(value => console.log("Queue value:", value.toUpperCase())); // ✅ value is string

// ============================================
// 3. RegExp v Flag
// ============================================
console.log("\n--- 3. RegExp v Flag ---\n");

// TypeScript supports v flag regex types
const emojiRegex = /\p{RGI_Emoji}/v;
const match = "Hello 🌍 world".match(emojiRegex);
if (match) {
  console.log("Matched emoji:", match[0]); // match is RegExpMatchArray
}

// Unicode property escapes are typed
const greekRegex = /[\p{Script=Greek}]/v;
console.log("Is Greek?", greekRegex.test("Γειά σου")); // true

// ============================================
// 4. Resizable ArrayBuffer
// ============================================
console.log("\n--- 4. Resizable ArrayBuffer ---\n");

// Resizable ArrayBuffer has separate type in TypeScript
const buffer: ArrayBuffer = new ArrayBuffer(8, { maxByteLength: 16 });
console.log("Is resizable?", buffer.resizable); // boolean

// Narrowing to ResizableArrayBuffer type
if (buffer.resizable) {
  buffer.resize(12); // ✅ Allowed after narrowing
  console.log("Resized to 12 bytes");
  console.log("New length:", buffer.byteLength);
}

// Transfer returns ArrayBuffer
const newBuffer = buffer.transfer(20);
console.log("Old buffer detached:", buffer.detached); // boolean
console.log("New buffer length:", newBuffer.byteLength);

// Typed arrays backed by resizable buffers automatically track size
const resizableBuf = new ArrayBuffer(8, { maxByteLength: 32 });
const view = new Uint8Array(resizableBuf);
console.log("Initial view length:", view.length); // 8

resizableBuf.resize(16);
console.log("View length after resize:", view.length); // 16 (automatically updated)

// ============================================
// 5. Atomics.waitAsync()
// ============================================
console.log("\n--- 5. Atomics.waitAsync() ---\n");

// Atomics.waitAsync is typed properly
const sharedBuffer = new SharedArrayBuffer(4);
const int32 = new Int32Array(sharedBuffer);

// Returns a promise that resolves to { async: false; value: "ok" | "not-equal" | "timed-out" } | { async: true; value: Promise<"ok" | "timed-out"> }
// const result = Atomics.waitAsync(int32, 0, 0);
// if (result.async) {
//   result.value.then(status => console.log("Wait status:", status));
// }

// ============================================
// 6. Well-Formed Unicode Strings
// ============================================
console.log("\n--- 6. Well-Formed Unicode Strings ---\n");

// isWellFormed() and toWellFormed() are typed as string methods
const invalidString = "a\uD800b";
console.log("Is well formed?", invalidString.isWellFormed()); // boolean

const validString = invalidString.toWellFormed();
console.log("Valid string:", validString); // string
console.log("Valid string is well formed:", validString.isWellFormed()); // true

// Use case: Input validation
function processInput(input: string): string {
  if (!input.isWellFormed()) {
    return input.toWellFormed();
  }
  return input;
}

const processed = processInput("test\uD800test");
console.log("Processed input length:", processed.length); // number

// ============================================
// 7. TypeScript-specific Enhancements
// ============================================
console.log("\n--- 7. TypeScript-specific Enhancements ---\n");

// 1. groupBy with type predicates
type Fruit = Extract<InventoryItem, { type: "fruit" }>;
type Vegetable = Extract<InventoryItem, { type: "vegetable" }>;
type Meat = Extract<InventoryItem, { type: "meat" }>;

const isFruit = (item: InventoryItem): item is Fruit => item.type === "fruit";
const isVegetable = (item: InventoryItem): item is Vegetable => item.type === "vegetable";
const isMeat = (item: InventoryItem): item is Meat => item.type === "meat";

const fruitOnly = inventory.filter(isFruit); // Fruit[]

// 2. Strongly typed group keys
type GroupKey = "fruit" | "vegetable" | "meat";
const groupedTyped = Object.groupBy(inventory, (item): GroupKey => item.type);
// groupedTyped is Record<GroupKey, InventoryItem[]> (no Partial, since we know all keys exist)

// 3. Promise.withResolvers in generic functions
function promisify<T>(fn: (callback: (err: Error | null, result?: T) => void) => void): Promise<T> {
  const { promise, resolve, reject } = Promise.withResolvers<T>();
  fn((err, result) => {
    if (err) reject(err);
    else resolve(result!);
  });
  return promise;
}

// Usage:
// const fs = require("fs");
// const readFilePromise = promisify<string>((cb) => fs.readFile("config.json", "utf8", cb));

// ============================================
// 8. Configuration
// ============================================
console.log("\n--- 8. tsconfig.json Configuration ---\n");
console.log("To use ES2024 features in TypeScript:");
console.log('1. Set "target": "ES2024" or higher');
console.log('2. Add "ES2024" to "lib" array if target is lower');
console.log('3. For groupBy types: ensure TypeScript 5.2+');

console.log("\n✅ ES2024 TypeScript comparison completed");