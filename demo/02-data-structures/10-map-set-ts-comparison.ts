// TypeScript vs JavaScript: Map and Set Comparison
// 📘 For JavaScript examples, see: 10-map-set.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
// 🎯 Difficulty: Intermediate
export {};

// ============================================================================
// 1. MAP TYPE ANNOTATIONS - Map<K, V>
// ============================================================================

// JavaScript: No type information, keys and values can be any type
// const jsMap = new Map();
// jsMap.set("key", 123);
// jsMap.set(456, "value"); // Mixing key types allowed

// TypeScript: Generic type Map<KeyType, ValueType>
const stringNumberMap: Map<string, number> = new Map();
stringNumberMap.set("one", 1);
stringNumberMap.set("two", 2);
stringNumberMap.set("three", 3);
// stringNumberMap.set(4, "four"); // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'

console.log("=== Map Type Annotations ===");
console.log("String -> Number map:", Object.fromEntries(stringNumberMap));

// Complex value types
interface User {
  id: number;
  name: string;
  email: string;
}

const userMap: Map<number, User> = new Map();
userMap.set(1, { id: 1, name: "Alice", email: "alice@example.com" });
userMap.set(2, { id: 2, name: "Bob", email: "bob@example.com" });

console.log("\nUser map entries:");
for (const [id, user] of userMap) {
  console.log(`  ${id}: ${user.name} (${user.email})`);
}

// Object keys (reference equality)
const objKeyMap: Map<{ id: number }, string> = new Map();
const key1 = { id: 1 };
const key2 = { id: 1 };
objKeyMap.set(key1, "First object");
objKeyMap.set(key2, "Second object");
console.log("\nObject key map size:", objKeyMap.size); // 2 (different references)

// ============================================================================
// 2. SET TYPE ANNOTATIONS - Set<T>
// ============================================================================

// JavaScript: Any value type allowed
// const jsSet = new Set();
// jsSet.add(1);
// jsSet.add("two"); // Mixed types allowed

// TypeScript: Generic type Set<T>
const numberSet: Set<number> = new Set();
numberSet.add(1);
numberSet.add(2);
numberSet.add(3);
numberSet.add(2); // Duplicate, won't be added
// numberSet.add("four"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

console.log("\n=== Set Type Annotations ===");
console.log("Number set:", [...numberSet]);

// String set
const stringSet: Set<string> = new Set(["apple", "banana", "cherry"]);
console.log("String set:", [...stringSet]);

// Object set
const userSet: Set<User> = new Set();
const alice: User = { id: 1, name: "Alice", email: "alice@example.com" };
const bob: User = { id: 2, name: "Bob", email: "bob@example.com" };
userSet.add(alice);
userSet.add(bob);
userSet.add(alice); // Duplicate reference, won't be added

console.log("\nUser set size:", userSet.size); // 2

// ============================================================================
// 3. WEAKMAP AND WEAKSET TYPING
// ============================================================================

// JavaScript: Keys must be objects, no other constraints
// const jsWeakMap = new WeakMap();
// jsWeakMap.set({}, "value");

// TypeScript: WeakMap<object, V> - keys constrained to objects
const weakMap: WeakMap<object, string> = new WeakMap();
const weakKey = { id: "weak-key" };
weakMap.set(weakKey, "WeakMap value");
console.log("\n=== WeakMap/WeakSet Typing ===");
console.log("WeakMap.get():", weakMap.get(weakKey));

// WeakMap with typed values
interface CacheEntry {
  data: string;
  timestamp: number;
}

const cacheMap: WeakMap<object, CacheEntry> = new WeakMap();
const cacheKey = { requestId: "req-123" };
cacheMap.set(cacheKey, { data: "cached result", timestamp: Date.now() });
console.log("Cache entry:", cacheMap.get(cacheKey));

// WeakSet typing
const weakSet: WeakSet<object> = new WeakSet();
const weakObj1 = { id: 1 };
const weakObj2 = { id: 2 };
weakSet.add(weakObj1);
weakSet.add(weakObj2);
console.log("WeakSet.has(weakObj1):", weakSet.has(weakObj1));

// ⚠️ PITFALL: WeakMap/WeakSet only accept objects as keys/values
// const badWeakMap: WeakMap<string, number> = new WeakMap(); // ❌ Error: Type 'string' does not satisfy the constraint 'object'

// ============================================================================
// 4. ITERATION TYPE INFERENCE
// ============================================================================

console.log("\n=== Iteration Type Inference ===");

// Map iteration - TypeScript infers correct types
const iterMap: Map<string, number> = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);

// for...of iteration - inferred as [string, number]
console.log("Map iteration:");
for (const entry of iterMap) {
  // entry: [string, number]
  console.log(`  ${entry[0]}: ${entry[1]}`);
}

// Destructured iteration - proper type inference
for (const [key, value] of iterMap) {
  // key: string, value: number
  console.log(`  Destructured: ${key} = ${value}`);
}

// keys() and values() with type inference
console.log("\nKeys:");
for (const key of iterMap.keys()) {
  // key: string
  console.log(`  ${key.toUpperCase()}`); // String methods available
}

console.log("Values:");
for (const value of iterMap.values()) {
  // value: number
  console.log(`  ${value.toFixed(2)}`); // Number methods available
}

// entries() - same as default iterator
console.log("Entries:");
for (const [k, v] of iterMap.entries()) {
  console.log(`  ${k}: ${v}`);
}

// Set iteration
const iterSet: Set<string> = new Set(["apple", "banana", "cherry"]);
console.log("\nSet iteration:");
for (const value of iterSet) {
  // value: string
  console.log(`  ${value.toUpperCase()}`);
}

// ============================================================================
// 5. MAP METHODS TYPE SAFETY
// ============================================================================

console.log("\n=== Map Methods Type Safety ===");

const methodMap: Map<string, User> = new Map();
methodMap.set("alice", { id: 1, name: "Alice", email: "alice@example.com" });

// get() returns User | undefined
const user = methodMap.get("alice");
console.log("get() returns:", user); // User | undefined

// ⚠️ PITFALL: get() can return undefined
// console.log(user.name); // ❌ Error: Object is possibly 'undefined'

// ✅ SOLUTION: Check for undefined or use optional chaining
console.log("Safe access:", user?.name);

// Type narrowing
if (user !== undefined) {
  console.log("After narrowing:", user.name, user.email); // ✅ Now User type
}

// has() for existence check before access
if (methodMap.has("alice")) {
  const definitelyExists = methodMap.get("alice")!; // Non-null assertion safe here
  console.log("After has() check:", definitelyExists.name);
}

// Type-safe wrapper function
function getUserOrDefault(map: Map<string, User>, key: string, defaultUser: User): User {
  return map.get(key) ?? defaultUser;
}

const defaultUser: User = {
  id: 0,
  name: "Unknown",
  email: "unknown@example.com",
};
const foundUser = getUserOrDefault(methodMap, "nonexistent", defaultUser);
console.log("With default:", foundUser.name);

// ============================================================================
// 6. SET OPERATIONS WITH GENERICS
// ============================================================================

console.log("\n=== Set Operations with Generics ===");

// Union: combine two sets
type SetOperation = <T>(a: Set<T>, b: Set<T>) => Set<T>;

const union: SetOperation = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  return new Set([...a, ...b]);
};

const setA: Set<number> = new Set([1, 2, 3, 4, 5]);
const setB: Set<number> = new Set([4, 5, 6, 7, 8]);
const unionSet = union(setA, setB);
console.log("Union:", [...unionSet]);

// Intersection
type IntersectionOperation = <T>(a: Set<T>, b: Set<T>) => Set<T>;

const intersection: IntersectionOperation = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  return new Set([...a].filter(x => b.has(x)));
};

const intersectionSet = intersection(setA, setB);
console.log("Intersection:", [...intersectionSet]);

// Difference (A - B)
type DifferenceOperation = <T>(a: Set<T>, b: Set<T>) => Set<T>;

const difference: DifferenceOperation = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  return new Set([...a].filter(x => !b.has(x)));
};

const differenceSet = difference(setA, setB);
console.log("Difference (A - B):", [...differenceSet]);

// ============================================================================
// 7. CONVERTING TO/FROM ARRAYS
// ============================================================================

console.log("\n=== Converting To/From Arrays ===");

// Map to array - type preservation
const sourceMap: Map<string, number> = new Map([
  ["a", 1],
  ["b", 2],
]);
const mapArray: [string, number][] = [...sourceMap];
console.log("Map to array:", mapArray);

// Array back to Map
const entries: [string, number][] = [
  ["x", 10],
  ["y", 20],
  ["z", 30],
];
const fromArray: Map<string, number> = new Map(entries);
console.log("Array to Map:", Object.fromEntries(fromArray));

// Set to array - type preservation
const sourceSet: Set<number> = new Set([1, 2, 3, 4, 5]);
const setArray: number[] = [...sourceSet];
console.log("Set to array:", setArray);

// Array back to Set (deduplication)
const duplicates: number[] = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const deduped: Set<number> = new Set(duplicates);
console.log("Deduplicated:", [...deduped]);

// Array to Map with index
type IndexedMap<T> = Map<number, T>;
const items: string[] = ["apple", "banana", "cherry"];
const indexedMap: IndexedMap<string> = new Map(items.map((item, index) => [index, item]));
console.log("Indexed map:", Object.fromEntries(indexedMap));

// ============================================================================
// 8. UTILITY TYPES FOR MAP/SET
// ============================================================================

console.log("\n=== Utility Types for Map/Set ===");

// Map entry type
type MapEntry<K, V> = [K, V];
type StringNumberEntry = MapEntry<string, number>;
const entry: StringNumberEntry = ["key", 42];
console.log("Map entry:", entry);

// Set value type
type SetValue<T> = T;
type StringValue = SetValue<string>;
const setVal: StringValue = "value";
console.log("Set value:", setVal);

// Map from object type
type UserMap = Map<number, User>;
const typedUserMap: UserMap = new Map();
typedUserMap.set(1, { id: 1, name: "Alice", email: "alice@example.com" });
console.log("Typed user map size:", typedUserMap.size);

// Extract types from Map
// (TypeScript doesn't have built-in MapKey/MapValue, but we can define them)
type MapKey<M> = M extends Map<infer K, any> ? K : never;
type MapValue<M> = M extends Map<any, infer V> ? V : never;

type NumberStringMap = Map<number, string>;
type ExtractedKey = MapKey<NumberStringMap>; // number
type ExtractedValue = MapValue<NumberStringMap>; // string
console.log("Extracted key/value types: number, string");

// ============================================================================
// 9. COMMON PITFALLS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Object key reference equality
const refMap: Map<{ id: number }, string> = new Map();
const refKey = { id: 1 };
refMap.set(refKey, "value");
console.log("get(refKey):", refMap.get(refKey)); // "value"
console.log("get({id: 1}):", refMap.get({ id: 1 })); // undefined (new object)

// PITFALL 2: Map.get() returns possibly undefined
const unsafeMap: Map<string, number> = new Map();
// const value: number = unsafeMap.get("missing"); // ❌ Error: Type 'undefined' is not assignable to type 'number'
const safeValue: number | undefined = unsafeMap.get("missing");
console.log("Safe undefined:", safeValue);

// PITFALL 3: JSON.stringify() on Map/Set returns {}
const jsonMap: Map<string, number> = new Map([
  ["a", 1],
  ["b", 2],
]);
const jsonSet: Set<number> = new Set([1, 2, 3]);
console.log("JSON.stringify(Map):", JSON.stringify(jsonMap)); // {}
console.log("JSON.stringify(Set):", JSON.stringify(jsonSet)); // {}

// ✅ SOLUTION: Convert before serializing
console.log("Correct Map JSON:", JSON.stringify(Object.fromEntries(jsonMap)));
console.log("Correct Set JSON:", JSON.stringify([...jsonSet]));

// PITFALL 4: WeakMap/WeakSet keys must be objects
// const badWeakMap = new WeakMap<string, number>(); // ❌ Compile error

// PITFALL 5: forEach callback types
type CallbackMap = Map<string, number>;
const cbMap: CallbackMap = new Map([
  ["a", 1],
  ["b", 2],
]);
cbMap.forEach((value, key, map) => {
  // TypeScript infers: (value: number, key: string, map: Map<string, number>) => void
  console.log(`  ${key}: ${value}`);
});

// PITFALL 6: Map/Set size is number, always truthy for non-empty
type SizeCheckMap = Map<string, string>;
const sizeMap: SizeCheckMap = new Map();
if (sizeMap.size) {
  // 0 is falsy, so this won't execute
  console.log("Map has items");
} else {
  console.log("Map is empty (size check works)");
}

// ============================================================================
// 10. BEST PRACTICES SUMMARY
// ============================================================================

/*
✅ DO:
1. Always specify generic types for Map<K, V> and Set<T>
2. Use Map when you need non-string keys or insertion order
3. Use Set for deduplication and uniqueness guarantees
4. Use WeakMap/WeakSet for object-associated data that should be GC'd
5. Check for undefined after Map.get() or use optional chaining
6. Use type predicates for Set operations
7. Convert Map/Set to arrays before JSON serialization
8. Use readonly for Map/Set that shouldn't be modified
9. Leverage type inference in iteration
10. Use interface types for complex Map values

❌ DON'T:
1. Use any for Map/Set generic parameters
2. Mix key types in Maps without union types
3. Forget that Map.get() returns T | undefined
4. Rely on Object.is() equality for object keys without understanding
5. Use Map when Object or Record is more appropriate
6. Forget that WeakMap/WeakSet are not iterable
7. Try to JSON.stringify Map/Set directly
8. Use Set for ordered collections (maintains insertion order but...)
9. Ignore type safety when converting between collections
10. Use WeakMap with primitive keys

⚠️ WATCH OUT FOR:
1. Map.get() returns undefined for missing keys
2. Object keys use reference equality, not deep equality
3. NaN is equal to itself in Map/Set (unlike ===)
4. WeakMap/WeakSet keys must be objects
5. JSON.stringify on Map/Set produces {}
6. forEach callback parameter order (value, key, map)
7. Set maintains insertion order but that's an implementation detail
8. Map.size vs Object.keys(obj).length
9. Weak references don't prevent GC
10. Type narrowing with Map.has() requires non-null assertion

🎯 MIGRATION TIPS: JS → TS
1. Add explicit type annotations: Map<K, V>, Set<T>
2. Define interfaces for complex value types
3. Handle undefined returns from Map.get()
4. Use type guards for Set membership checks
5. Convert Object maps to Map<string, T> for consistency
6. Replace array deduplication with Set for clarity
7. Use WeakMap for DOM element metadata
8. Add proper types to iteration callbacks
9. Use Record<K, V> for simple string-key objects
10. Enable strict mode for better null checking

📘 SUMMARY: TYPESCRIPT BENEFITS FOR MAP/SET
✅ Type-safe keys and values
✅ Compile-time checking of key/value compatibility
✅ Proper type inference during iteration
✅ IDE autocomplete for Map/Set methods
✅ Catch undefined access at compile time
✅ Generic constraints for collection operations
✅ Type-safe conversions to/from arrays
✅ Better refactoring support

⚠️ Runtime behavior identical to JavaScript
⚠️ Some edge cases (object equality, undefined returns)
⚠️ Additional syntax for type annotations

🎯 RECOMMENDATION: Use TypeScript for all collection handling!
*/

// ============================================================================
// 11. ADVANCED: CUSTOM MAP/SET TYPES
// ============================================================================

console.log("\n=== Advanced: Custom Collection Types ===");

// Bidirectional map (two-way lookup)
class BiMap<K, V> {
  private forward: Map<K, V> = new Map();
  private reverse: Map<V, K> = new Map();

  set(key: K, value: V): void {
    this.forward.set(key, value);
    this.reverse.set(value, key);
  }

  get(key: K): V | undefined {
    return this.forward.get(key);
  }

  getKey(value: V): K | undefined {
    return this.reverse.get(value);
  }

  has(key: K): boolean {
    return this.forward.has(key);
  }

  hasValue(value: V): boolean {
    return this.reverse.has(value);
  }
}

const biMap = new BiMap<string, number>();
biMap.set("one", 1);
biMap.set("two", 2);
console.log("Forward lookup:", biMap.get("one"));
console.log("Reverse lookup:", biMap.getKey(2));

// Typed event map
interface EventMap {
  "user:login": { userId: number; timestamp: Date };
  "user:logout": { userId: number; timestamp: Date };
  error: { message: string; code: number };
}

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, Array<(data: any) => void>> = new Map();

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(h => h(data));
    }
  }
}

const emitter = new TypedEventEmitter<EventMap>();
emitter.on("user:login", data => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});
emitter.emit("user:login", { userId: 1, timestamp: new Date() });

// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript Map/Set ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Map/Set basic usage        │       ✓         │       ✓         │
│ Generic type annotations   │       ✗         │       ✓         │
│ Type-safe keys/values      │       ✗         │       ✓         │
│ WeakMap/WeakSet typing     │       ✗         │       ✓         │
│ Iteration type inference   │       ✗         │       ✓         │
│ Compile-time checking      │       ✗         │       ✓         │
│ Custom collection types    │       ✗         │       ✓         │
│ Generic constraints        │       ✗         │       ✓         │
│ Type predicates            │       ✗         │       ✓         │
│ IDE autocomplete           │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds type safety to Map/Set operations
2. Generics ensure keys and values match expected types
3. WeakMap/WeakSet constrain keys to objects
4. Type inference works in iteration
5. Runtime behavior is identical to JavaScript
6. Use TypeScript for better collection handling
`);

console.log("\n=== TypeScript provides type safety at compile time ===");
console.log("=== But runtime behavior follows JavaScript rules ===");
