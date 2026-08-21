// ES2021 Features Demo
// 📘 For TypeScript comparison, see: 39.1-es2021-features-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2021 features:
// 1. String.prototype.replaceAll()
// 2. Logical Assignment Operators (||=, &&=, ??=)
// 3. Numeric Separators
// 4. WeakRef and FinalizationRegistry
// 5. Promise.any() and AggregateError (covered in 30-promises.js)

// ============================================
// Table of Contents
// ============================================
// 1. String.prototype.replaceAll()
// 2. Logical Assignment Operators
// 3. Numeric Separators
// 4. WeakRef (Weak References)
// 5. FinalizationRegistry
// 6. Common Pitfalls
// 7. Best Practices
// 8. Cross-references

console.log("\n=== ES2021 Features ===\n");

// ============================================
// 1. String.prototype.replaceAll()
// ============================================
console.log("\n--- 1. String.prototype.replaceAll() ---\n");

// 📘 Official MDN example (String.replaceAll):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
console.log("MDN 'aabbcc'.replaceAll('b', '.'):", "aabbcc".replaceAll("b", "."));
// 'aa..cc'

// Before ES2021: only replace first occurrence, or use regex with /g flag
const str = "foo foo foo";
console.log("Original:", str);
console.log("replace('foo', 'bar'):", str.replace("foo", "bar")); // "bar foo foo"
console.log("replace(/foo/g, 'bar'):", str.replace(/foo/g, "bar")); // "bar bar bar"

// ES2021: replaceAll() replaces all occurrences without regex
console.log("replaceAll('foo', 'bar'):", str.replaceAll("foo", "bar")); // "bar bar bar"

// Special case: $ in replacement string
const money = "$100 $200 $300";
console.log("\nMoney string:", money);
console.log("replaceAll('$', '€'):", money.replaceAll("$", "€")); // "€100 €200 €300"

// Works with special regex characters (no escaping needed)
const regexStr = "a.b.c";
console.log("\nRegex string:", regexStr);
console.log("replaceAll('.', '-'):", regexStr.replaceAll(".", "-")); // "a-b-c"

// Edge case: empty search string
const emptySearch = "test";
console.log("\nEmpty search string:", emptySearch);
console.log("replaceAll('', 'x'):", emptySearch.replaceAll("", "x")); // "xtxexsxtx"

// ============================================
// 2. Logical Assignment Operators
// ============================================
console.log("\n--- 2. Logical Assignment Operators ---\n");

// ||= (Logical OR Assignment)
// Equivalent to: a || (a = b)
let a = null;
a ||= "default";
console.log("a ||= 'default':", a); // "default"

let b = "existing";
b ||= "default";
console.log("b ||= 'default':", b); // "existing" (unchanged)

// Common use case: set default values
const config = {};
config.port ||= 3000;
config.host ||= "localhost";
console.log("\nConfig with defaults:", config); // { port: 3000, host: "localhost" }

// &&= (Logical AND Assignment)
// Equivalent to: a && (a = b)
let user = { name: "Alice", age: 30 };
user &&= { ...user, isAdmin: false };
console.log("\nuser &&= extended:", user); // { name: "Alice", age: 30, isAdmin: false }

// Use case: update only if object exists
let maybeNull = null;
maybeNull &&= { updated: true }; // No operation, remains null
console.log("maybeNull &&= update:", maybeNull); // null

// ??= (Nullish Coalescing Assignment)
// Equivalent to: a ?? (a = b)
// Only assigns if a is null/undefined (NOT falsy values like 0 or '')
let count = 0;
count ??= 10;
console.log("\ncount ??= 10:", count); // 0 (0 is not null/undefined)

let undefinedVar = undefined;
undefinedVar ??= 10;
console.log("undefinedVar ??= 10:", undefinedVar); // 10

let emptyString = "";
emptyString ??= "default";
console.log("emptyString ??= 'default':", emptyString); // "" (empty string is not null/undefined)

// Comparison of the three operators
console.log("\nOperator comparison:");
let x = 0;
x ||= 100; // 0 is falsy, so assign 100
console.log("x = 0, x ||= 100:", x); // 100

let y = 0;
y ??= 100; // 0 is not null/undefined, so no assignment
console.log("y = 0, y ??= 100:", y); // 0

// ============================================
// 3. Numeric Separators
// ============================================
console.log("\n--- 3. Numeric Separators ---\n");

// Improve readability of large numbers
const billion = 1_000_000_000;
console.log("1_000_000_000 === 1000000000:", billion === 1000000000); // true

// Works with decimal points
const pi = 3.1415_9265_3589;
console.log("PI with separators:", pi); // 3.141592653589

// Works with different bases
const binary = 0b1010_0001_1000_0101;
const hex = 0xFF_FF_FF_FF;
console.log("Binary 0b1010_0001_1000_0101:", binary); // 41349
console.log("Hex 0xFF_FF_FF_FF:", hex); // 4294967295

// Invalid positions (will throw syntax error)
// const invalid1 = 1._000; // Can't be adjacent to decimal point
// const invalid2 = _1000; // Can't be at start
// const invalid3 = 1000_; // Can't be at end

// Use case: financial calculations
const price = 100_000_000; // $100 million
const fee = 0.000_1; // 0.01% fee
console.log("\nPrice:", price, "Fee rate:", fee);
console.log("Total fee:", price * fee); // 10000

// ============================================
// 4. WeakRef (Weak References)
// ============================================
console.log("\n--- 4. WeakRef (Weak References) ---\n");

/*
 * verification:
 *   feature: WeakRef
 *   status: ES2021
 *   stage4Date: 2020-07
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/notes/blob/main/meetings/2020-07/july-21.md#weakrefs-for-stage-4
 */

// WeakRef creates a weak reference to an object that doesn't prevent GC
// Use cases: caching, mapping to external resources, event systems

// Create a target object
let target = { data: "some large object" };

// Create a weak reference to the target
const weakRef = new WeakRef(target);

// Get the target from the weak ref
const deref = weakRef.deref();
if (deref) {
  console.log("WeakRef deref successful:", deref.data); // "some large object"
} else {
  console.log("Target has been garbage collected");
}

// If target is set to null and GC runs, weakRef.deref() may return undefined
target = null;
// Note: GC is non-deterministic, so we can't reliably demonstrate collection here
console.log("Note: WeakRef targets may be GC'd when no strong references exist");

// Important: Use WeakRef sparingly, GC behavior is implementation-dependent

// ============================================
// 5. FinalizationRegistry
// ============================================
console.log("\n--- 5. FinalizationRegistry ---\n");

/*
 * verification:
 *   feature: FinalizationRegistry
 *   status: ES2021
 *   stage4Date: 2020-07
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/notes/blob/main/meetings/2020-07/july-21.md#weakrefs-for-stage-4
 */

// FinalizationRegistry allows you to register a callback when an object is GC'd
// Use case: cleaning up external resources associated with an object

// Create a registry with a cleanup callback
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Cleaning up: ${heldValue}`);
});

// Register an object for finalization
let resource = { id: 123 };
const heldValue = "resource-123"; // Value passed to cleanup callback
registry.register(resource, heldValue);

// When resource is GC'd, the callback will be called with "resource-123"
resource = null;
console.log("Registered resource for finalization. Callback will run when GC collects it.");
console.log("Note: Finalization callbacks run at an unspecified time, don't rely on them for critical logic.");

// Unregister if needed
// const unregisterToken = {};
// registry.register(obj, value, unregisterToken);
// registry.unregister(unregisterToken);

// ============================================
// 6. Common Pitfalls
// ============================================
console.log("\n--- 6. Common Pitfalls ---\n");

// Pitfall 1: Confusing ??= with ||= for falsy values
let countPitfall = 0;
countPitfall ||= 10; // ❌ Overwrites 0 with 10
countPitfall ??= 10; // ✅ Preserves 0
console.log("countPitfall after ||= 10:", countPitfall); // 10

// Pitfall 2: Using replaceAll with regex without /g flag (throws error)
try {
  "test".replaceAll(/t/, "x"); // ❌ Regex without g flag
} catch (e) {
  console.log("replaceAll with non-global regex:", e.message); // String.prototype.replaceAll called with a non-global RegExp argument
}

// Pitfall 3: Overusing WeakRef/FinalizationRegistry
// - They are for specialized use cases only
// - GC behavior is not guaranteed, don't rely on them for correctness
// - They can have performance implications

// Pitfall 4: Using numeric separators in APIs that expect string numbers
const apiData = { id: 123_456 };
console.log("JSON.stringify(apiData):", JSON.stringify(apiData)); // {"id":123456} - works fine, separators are ignored
// But if you convert to string manually, ensure you handle correctly

// ============================================
// 7. Best Practices
// ============================================
console.log("\n--- 7. Best Practices ---\n");

console.log("✅ Use replaceAll() instead of regex /g for simple string replacements");
console.log("✅ Use ??= for default values when you want to preserve 0 and empty strings");
console.log("✅ Use ||= only when you want to replace all falsy values");
console.log("✅ Use numeric separators for numbers with more than 4 digits to improve readability");
console.log("⚠️  Use WeakRef/FinalizationRegistry only for specialized use cases (caching, resource cleanup)");
console.log("⚠️  Don't rely on GC timing for application logic");
console.log("✅ Group numeric separators by thousands, bytes, or logical units");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 Promise.any() and AggregateError: 30-promises.js");
console.log("📘 Nullish coalescing operator (??): 02-operators.js");
console.log("📘 Logical operators: 02-operators.js");
console.log("📘 String methods: 04-strings.js");
console.log("📘 Garbage collection: 27-memory-management.js");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39.1-es2021-features-ts-comparison.ts
*/

// == verification block ==
// feature: replaceAll
// stage4Date: 2020-06
// stage4DateType: exact
// source: https://github.com/tc39/proposal-string-replaceall
// lastVerified: 2026-08-21
// == end verification block ==

// == verification block ==
// feature: Logical Assignment
// stage4Date: 2020-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-logical-assignment
// lastVerified: 2026-08-21
// == end verification block ==

// == verification block ==
// feature: Numeric Separators
// stage4Date: 2020-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-numeric-separator
// lastVerified: 2026-08-21
// == end verification block ==

// == verification block ==
// feature: WeakRef
// stage4Date: 2020-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-weakrefs
// lastVerified: 2026-08-21
// == end verification block ==

// == verification block ==
// feature: FinalizationRegistry
// stage4Date: 2020-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-weakrefs
// lastVerified: 2026-08-21
// == end verification block ==

// == verification block ==
// feature: Promise.any
// stage4Date: 2020-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-promise-any
// lastVerified: 2026-08-21
// == end verification block ==

// == verification block ==
// feature: AggregateError
// stage4Date: 2020-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-promise-any
// lastVerified: 2026-08-21
// == end verification block ==