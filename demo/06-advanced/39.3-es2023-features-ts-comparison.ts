// TypeScript vs JavaScript: ES2023 Features
// 📘 For JavaScript version, see: 39.3-es2023-features.js
/// <reference lib="es2023" />

export {}; // Module

console.log("\n=== TypeScript ES2023 Features Comparison ===\n");

// ============================================
// 1. Immutable Array Methods
// ============================================
console.log("\n--- 1. Immutable Array Methods ---\n");

// All immutable array methods preserve type information
const arr: number[] = [3, 1, 4, 1, 5, 9, 2, 6];

// toSorted returns new array of same type
const sorted: number[] = arr.toSorted();
console.log("Sorted:", sorted); // number[]

const sortedDesc: number[] = arr.toSorted((a, b) => b - a);
console.log("Sorted descending:", sortedDesc); // number[]

// toReversed returns new array of same type
const reversed: number[] = arr.toReversed();
console.log("Reversed:", reversed); // number[]

// with returns new array of same type
const updated: number[] = arr.with(2, 42);
console.log("Updated index 2:", updated); // number[]

// with negative index
const lastUpdated: number[] = arr.with(-1, 99);
console.log("Updated last element:", lastUpdated); // number[]

// toSpliced returns new array of same type
const spliced: number[] = arr.toSpliced(2, 3, 100, 200);
console.log("Spliced:", spliced); // number[]

// Original array is unchanged (type safety)
console.log("Original unchanged:", arr); // number[] (still original)

// Type safety: with() must match array element type
// arr.with(0, "string"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// Generic arrays
interface User {
  name: string;
  age: number;
}

const users: User[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 },
];

const sortedByAge: User[] = users.toSorted((a, b) => a.age - b.age);
console.log(
  "Sorted by age:",
  sortedByAge.map(u => `${u.name} (${u.age})`)
);

// ============================================
// 2. findLast() and findLastIndex()
// ============================================
console.log("\n--- 2. findLast() and findLastIndex() ---\n");

const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// findLast preserves element type
const lastEven: number | undefined = numbers.findLast(n => n % 2 === 0);
console.log("Last even number:", lastEven); // 10

// Type narrowing in callback
interface User2 {
  name: string;
  role: "admin" | "user";
}

const userList: User2[] = [
  { name: "Alice", role: "user" },
  { name: "Bob", role: "admin" },
  { name: "Charlie", role: "user" },
  { name: "Diana", role: "admin" },
];

const lastAdmin = userList.findLast(
  (user): user is User2 & { role: "admin" } => {
    return user.role === "admin";
  }
);
// lastAdmin is User2 & { role: "admin" } | undefined

if (lastAdmin) {
  console.log("Last admin:", lastAdmin.name); // ✅ Type safe
  console.log("Role:", lastAdmin.role); // ✅ role is "admin"
}

// findLastIndex returns number
const lastAdminIndex: number = userList.findLastIndex(u => u.role === "admin");
console.log("Last admin index:", lastAdminIndex); // 3

// When not found
const notFound: number | undefined = numbers.findLast(n => n > 100);
const notFoundIndex: number = numbers.findLastIndex(n => n > 100);
console.log("Not found value:", notFound); // undefined
console.log("Not found index:", notFoundIndex); // -1

// ============================================
// 3. Hashbang Grammar
// ============================================
console.log("\n--- 3. Hashbang Grammar ---\n");

// TypeScript supports hashbang in .ts files when module is NodeNext or similar
console.log("Hashbang (#!) at file start is standardized");
console.log("TypeScript can compile to files with hashbangs");

// tsconfig option:
// {
//   "compilerOptions": {
//     "target": "ES2023",
//     "module": "NodeNext"
//   }
// }

// ============================================
// 4. Symbols as WeakMap Keys
// ============================================
console.log("\n--- 4. Symbols as WeakMap Keys ---\n");

// TypeScript supports symbols as WeakMap keys
const key: unique symbol = Symbol("my-key");
const weakMap = new WeakMap<symbol, string>();

weakMap.set(key, "value");
const value: string | undefined = weakMap.get(key);
console.log("WeakMap value:", value); // "value"
console.log("Has key:", weakMap.has(key)); // true

// WeakSet with symbols
const weakSet = new WeakSet<symbol>();
const sym: unique symbol = Symbol("weak-set-key");
weakSet.add(sym);
console.log("WeakSet has sym:", weakSet.has(sym)); // true

// Use case: Metadata storage with unique symbol keys
const metadataMap = new WeakMap<
  symbol,
  { createdAt: Date; description: string }
>();

function createEntity(description: string): symbol {
  const id = Symbol("entity");
  metadataMap.set(id, { createdAt: new Date(), description });
  return id;
}

function getMetadata(
  id: symbol
): { createdAt: Date; description: string } | undefined {
  return metadataMap.get(id);
}

const entityId = createEntity("User entity");
const metadata = getMetadata(entityId);
if (metadata) {
  console.log("Entity description:", metadata.description);
  console.log("Created at:", metadata.createdAt);
}

// ============================================
// 5. TypeScript-specific Enhancements
// ============================================
console.log("\n--- 5. TypeScript-specific Enhancements ---\n");

// 1. Immutable arrays with Readonly modifier
const readonlyArray: readonly number[] = [1, 2, 3];
// readonlyArray.push(4); // ❌ Error: Property 'push' does not exist on type 'readonly number[]'
const newArray: readonly number[] = readonlyArray.toSorted(); // ✅ Returns new readonly array

// 2. Exact types for array operations
const tuple: [number, string, boolean] = [1, "hello", true];
const reversedTuple: [boolean, string, number] = tuple.toReversed() as [
  boolean,
  string,
  number,
];
console.log("Reversed tuple:", reversedTuple);

// 3. Type-safe state updates (common in React/Redux)
interface AppState {
  users: User[];
  currentUser: User | null;
}

const initialState: AppState = {
  users: [{ name: "Alice", age: 30 }],
  currentUser: null,
};

function updateUserAt(
  state: AppState,
  index: number,
  updates: Partial<User>
): AppState {
  const newUsers = state.users.with(index, {
    ...state.users[index],
    ...updates,
  });
  return { ...state, users: newUsers };
}

const newState = updateUserAt(initialState, 0, { age: 31 });
console.log("Updated user age:", newState.users[0].age); // 31

// 4. Branded types with WeakMap symbol keys
type OrderId = symbol & { __brand: "OrderId" };
const orderMap = new WeakMap<OrderId, { total: number; status: string }>();

function createOrder(total: number): OrderId {
  const id = Symbol("order") as OrderId;
  orderMap.set(id, { total, status: "pending" });
  return id;
}

const orderId = createOrder(99.99);
const order = orderMap.get(orderId);
if (order) {
  console.log("Order total: $" + order.total.toFixed(2));
  console.log("Order status:", order.status);
}

// ============================================
// 6. Configuration
// ============================================
console.log("\n--- 6. tsconfig.json Configuration ---\n");
console.log("To use ES2023 features in TypeScript:");
console.log('1. Set "target": "ES2023" or higher');
console.log('2. Add "ES2023" to "lib" array if target is lower');
console.log("3. For immutable array methods: Ensure TypeScript 5.0+");
console.log("4. For Symbols in WeakMap: Ensure TypeScript 5.1+");

console.log("\n✅ ES2023 TypeScript comparison completed");
