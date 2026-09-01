// ES2024 Features Demo
// 📘 For TypeScript comparison, see: 39.4-es2024-features-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2024 features:
// 1. Object.groupBy and Map.groupBy
// 2. Promise.withResolvers
// 3. RegExp v flag (Unicode Sets)
// 4. ArrayBuffer.transfer and Resizable ArrayBuffer
// 5. Atomics.waitAsync
// 6. Well-Formed Unicode Strings (isWellFormed, toWellFormed)

// ============================================
// Table of Contents
// ============================================
// 1. Object.groupBy() and Map.groupBy()
// 2. Promise.withResolvers()
// 3. RegExp v Flag (Unicode Sets)
// 4. Resizable ArrayBuffer and ArrayBuffer.transfer()
// 5. Atomics.waitAsync()
// 6. Well-Formed Unicode Strings
// 7. Common Pitfalls
// 8. Best Practices
// 9. Cross-references

console.log("\n=== ES2024 Features ===\n");

// ============================================
// 1. Object.groupBy() and Map.groupBy()
// ============================================
console.log("\n--- 1. Object.groupBy() and Map.groupBy() ---\n");

/*
 * verification:
 *   feature: Object.groupBy / Map.groupBy
 *   status: ES2024
 *   stage4Date: 2023-11
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2023-11/november-29.md#array-grouping-for-stage-4
 */

const inventory = [
  { name: "asparagus", type: "vegetable", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 10 },
  { name: "goat", type: "meat", quantity: 3 },
  { name: "cherries", type: "fruit", quantity: 7 },
  { name: "fish", type: "meat", quantity: 2 },
];

// Object.groupBy returns a plain object
const groupedByType = Object.groupBy(inventory, item => item.type);
console.log("Object.groupBy by type:");
console.log("Fruits:", groupedByType.fruit); // 2 items: bananas, cherries
console.log("Vegetables:", groupedByType.vegetable); // 1 item: asparagus
console.log("Meats:", groupedByType.meat); // 2 items: goat, fish

// Group by quantity
const groupedByQuantity = Object.groupBy(inventory, item => {
  return item.quantity > 5 ? "high" : "low";
});
console.log("\nGrouped by quantity:");
console.log("High quantity (>5):", groupedByQuantity.high); // bananas (10), cherries (7)
console.log("Low quantity (<=5):", groupedByQuantity.low); // asparagus (5), goat (3), fish (2)

// Map.groupBy returns a Map (can have non-string keys)
const restock = Symbol("restock");
const inStock = Symbol("inStock");

const stockStatus = Map.groupBy(inventory, item => {
  return item.quantity < 3 ? restock : inStock;
});
console.log("\nMap.groupBy by stock status:");
console.log("Needs restock:", stockStatus.get(restock)); // fish (2)
console.log("In stock:", stockStatus.get(inStock)); // all others

// Before ES2024: Manual grouping with reduce
const manualGroup = inventory.reduce((acc, item) => {
  const key = item.type;
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});
console.log(
  "\nManual reduce grouping same result:",
  JSON.stringify(manualGroup) === JSON.stringify(groupedByType)
); // true

// ============================================
// 2. Promise.withResolvers()
// ============================================
console.log("\n--- 2. Promise.withResolvers() ---\n");

/*
 * verification:
 *   feature: Promise.withResolvers
 *   status: ES2024
 *   stage4Date: 2023-11
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2023-11/november-29.md#promise-withresolvers-for-stage-4
 */

// 📘 Official MDN example (Promise.withResolvers):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
// Promise.withResolvers() is exactly equivalent to the following pre-ES2024 pattern,
// but more concise — no `let` bindings leaking the resolvers out of the executor:
const { promise: mdnPromise, resolve: mdnResolve, reject: mdnReject } = Promise.withResolvers();
mdnResolve("MDN withResolvers resolved");
mdnPromise.then(value => console.log("  MDN withResolvers:", value));
// MDN withResolvers resolved

// Practical use: resolve/reject are needed *outside* the Promise constructor
function delay(ms) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(() => resolve(`Resolved after ${ms}ms`), ms);
  return promise;
}

delay(1000).then(message => console.log("delay(1000):", message));

// Before ES2024:
function delayOld(ms) {
  let resolve;
  const promise = new Promise(res => {
    resolve = res;
  });
  setTimeout(() => resolve(`Old resolved after ${ms}ms`), ms);
  return promise;
}

// Use case: callback-based API wrapping
function readFile(path) {
  const { promise, resolve, reject } = Promise.withResolvers();
  // Simulate fs.readFile
  setTimeout(() => {
    if (path === "config.json") {
      resolve(JSON.stringify({ port: 3000 }));
    } else {
      reject(new Error("File not found"));
    }
  }, 100);
  return promise;
}

readFile("config.json")
  .then(data => console.log("\nreadFile config.json:", JSON.parse(data)))
  .catch(err => console.error(err));

// Use case: queuing systems
class Queue {
  #items = [];
  #waitingConsumers = [];

  enqueue(item) {
    if (this.#waitingConsumers.length > 0) {
      const { resolve } = this.#waitingConsumers.shift();
      resolve(item);
    } else {
      this.#items.push(item);
    }
  }

  dequeue() {
    if (this.#items.length > 0) {
      return Promise.resolve(this.#items.shift());
    } else {
      const { promise, resolve } = Promise.withResolvers();
      this.#waitingConsumers.push({ resolve });
      return promise;
    }
  }
}

// ============================================
// 3. RegExp v Flag (Unicode Sets)
// ============================================
console.log("\n--- 3. RegExp v Flag (Unicode Sets) ---\n");

// v flag extends u flag with Unicode set operations
const text = "Hello 🌍! Café 123 カタカナ";
console.log("Text:", text);

// Match Greek letters, but exclude those in other scripts
const greekRegex = /[\p{Script=Greek}]/v;
console.log("Has Greek letters?", greekRegex.test(text)); // false

// Match all emojis
const emojiRegex = /\p{RGI_Emoji}/v;
const matchEmoji = text.match(emojiRegex);
console.log("First emoji:", matchEmoji[0]); // "🌍"

// Set operations: intersection (&)
// Match letters that are both ASCII and uppercase
const upperAscii = /[[a-z]&[A-Z]]/v; // Empty set
console.log("Upper AND lower ASCII match:", "aA".match(upperAscii)); // null

// Union: Match Greek or Cyrillic letters
const greekOrCyrillic = /[\p{Script=Greek}\p{Script=Cyrillic}]/v;

// Nested sets and negation
// Match all punctuation except ? and !
const punctuation = /[\p{Punctuation}--[?!]]/v;

// Use case: Validate input with complex Unicode requirements
// In v mode, escape literal characters like '-' or place them where they're valid
const validName = /^[\p{Letter}\s]+$/v;
console.log("\nName validation:");
console.log("'José García':", validName.test("José García")); // true
console.log("'김지민':", validName.test("김지민")); // true
console.log("'山本太郎':", validName.test("山本太郎")); // true
console.log("'User123':", validName.test("User123")); // false (numbers not allowed)

// ============================================
// 4. Resizable ArrayBuffer and ArrayBuffer.transfer()
// ============================================
console.log("\n--- 4. Resizable ArrayBuffer and ArrayBuffer.transfer() ---\n");

/*
 * verification:
 *   feature: Resizable ArrayBuffer
 *   status: ES2024
 *   stage4Date: 2023-09
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2023-09/september-26.md#resizable-buffers-for-stage-4
 */

/*
 * verification:
 *   feature: ArrayBuffer.transfer
 *   status: ES2024
 *   stage4Date: 2024-02
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2024-02/feb-6.md#arraybuffer-transfer-for-stage-4
 */

// Resizable ArrayBuffer allows changing size after creation
const buffer = new ArrayBuffer(8, { maxByteLength: 16 });
console.log("Initial buffer.byteLength:", buffer.byteLength); // 8
console.log("buffer.maxByteLength:", buffer.maxByteLength); // 16
console.log("Is resizable:", buffer.resizable); // true

// Resize the buffer
buffer.resize(12);
console.log("\nAfter resize(12):");
console.log("buffer.byteLength:", buffer.byteLength); // 12

// Can resize up to maxByteLength
buffer.resize(16);
console.log("After resize(16):", buffer.byteLength); // 16

// buffer.resize(17); // ❌ RangeError: Cannot resize above maxByteLength

// ArrayBuffer.transfer() moves data to a new buffer
// Note: transfer requires the new size to be >= current byteLength
const newBuffer = buffer.transfer(16); // Creates new buffer of 16 bytes, copies data, old buffer becomes detached
console.log("\nAfter transfer(16):");
console.log("Old buffer detached:", buffer.detached); // true
console.log("New buffer.byteLength:", newBuffer.byteLength); // 16
console.log("New buffer.maxByteLength:", newBuffer.maxByteLength); // 16 (resizable by default)

// Use case: Dynamic binary data processing (e.g., growing buffers for network streams)
class DynamicBuffer {
  #buffer;
  #pos = 0;

  constructor(initialSize = 1024, maxSize = 1024 * 1024) {
    this.#buffer = new ArrayBuffer(initialSize, { maxByteLength: maxSize });
  }

  write(data) {
    const requiredSize = this.#pos + data.byteLength;
    if (requiredSize > this.#buffer.byteLength) {
      // Grow buffer by 2x or to required size, whichever is larger
      const newSize = Math.min(
        Math.max(this.#buffer.byteLength * 2, requiredSize),
        this.#buffer.maxByteLength
      );
      this.#buffer.resize(newSize);
    }
    // Write data to buffer...
    this.#pos += data.byteLength;
  }

  get buffer() {
    return this.#buffer;
  }
}

// ============================================
// 5. Atomics.waitAsync()
// ============================================
console.log("\n--- 5. Atomics.waitAsync() ---\n");

/*
 * verification:
 *   feature: Atomics.waitAsync
 *   status: ES2024
 *   stage4Date: 2023-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2023-05/may-17.md#atomicswaitasync-for-stage-4
 */

// Async version of Atomics.wait(), doesn't block the main thread
const sharedBuffer = new SharedArrayBuffer(4);
const int32 = new Int32Array(sharedBuffer);

// Wait asynchronously for value at index 0 to change from 0
// Atomics.waitAsync(int32, 0, 0).then(result => {
//   console.log("Wait completed:", result); // { value: "ok" } or { value: "timed-out" }
// });

// // Wake the waiter after 1 second
// setTimeout(() => {
//   Atomics.store(int32, 0, 1);
//   Atomics.notify(int32, 0);
// }, 1000);

console.log("Atomics.waitAsync allows non-blocking waits on shared memory");
console.log("Useful in main threads where blocking is not allowed");

// ============================================
// 6. Well-Formed Unicode Strings
// ============================================
console.log("\n--- 6. Well-Formed Unicode Strings ---\n");

// Check and convert strings to well-formed Unicode
// Lone surrogate (invalid Unicode)
const invalidString = "a\uD800b"; // U+D800 is a lone high surrogate
console.log("String:", invalidString);
console.log("isWellFormed():", invalidString.isWellFormed()); // false

// Convert to well-formed (replaces lone surrogates with U+FFFD replacement character)
const validString = invalidString.toWellFormed();
console.log("toWellFormed():", validString); // "a�b"
console.log("validString.isWellFormed():", validString.isWellFormed()); // true

// Use case: Processing user input or external data that may have invalid Unicode
function processInput(input) {
  if (!input.isWellFormed()) {
    console.warn("Input contained invalid Unicode, normalized");
    input = input.toWellFormed();
  }
  // Process input...
  return input;
}

// Invalid Unicode can cause issues with string operations
const loneSurrogate = "\uD800";
console.log("\nLone surrogate length:", loneSurrogate.length); // 1
console.log("charCodeAt(0):", loneSurrogate.charCodeAt(0).toString(16)); // d800
try {
  encodeURIComponent(loneSurrogate); // ❌ URIError: URI malformed
} catch (e) {
  console.log("encodeURIComponent on invalid Unicode throws:", e.message);
}

// Well-formed string works fine
const fixed = loneSurrogate.toWellFormed();
console.log("Fixed string encodeURIComponent:", encodeURIComponent(fixed)); // "%EF%BF%BD"

// ============================================
// 7. Common Pitfalls
// ============================================
console.log("\n--- 7. Common Pitfalls ---\n");

// Pitfall 1: Object.groupBy returns a plain object with string keys
const numbersArr = [1, 2, 3, 4, 5];
const grouped = Object.groupBy(numbersArr, n => n % 2);
console.log("grouped keys:", Object.keys(grouped)); // ["0", "1"] (string keys, not numbers)
console.log("grouped[0]:", grouped[0]); // [2,4]
console.log("grouped['0']:", grouped["0"]); // same as above

// Pitfall 2: Map.groupBy keys preserve type
const mapGrouped = Map.groupBy(numbersArr, n => n % 2);
console.log("\nMap.groupBy keys are numbers:");
console.log("mapGrouped.get(0):", mapGrouped.get(0)); // [2,4] (number key works)
console.log("mapGrouped.get('0'):", mapGrouped.get("0")); // undefined (string key doesn't)

// Pitfall 3: Resizable ArrayBuffer can change underfoot
const resizableBuf = new ArrayBuffer(8, { maxByteLength: 16 });
const view = new Uint8Array(resizableBuf);
resizableBuf.resize(16); // view remains valid, length updates
console.log("\nAfter resizing buffer, view length:", view.length); // 16 (automatically updates)

// Pitfall 4: transfer() detaches the old buffer
const buf1 = new ArrayBuffer(8);
const buf2 = buf1.transfer();
console.log("\nbuf1 detached after transfer:", buf1.detached); // true
// new Uint8Array(buf1); // ❌ TypeError: Cannot perform Construct on a detached ArrayBuffer

// ============================================
// 8. Best Practices
// ============================================
console.log("\n--- 8. Best Practices ---\n");

console.log("✅ Use Object.groupBy/Map.groupBy instead of manual reduce for grouping");
console.log("✅ Use Map.groupBy when you need non-string keys or want to preserve key types");
console.log(
  "✅ Use Promise.withResolvers for cleaner promise creation when resolve/reject are needed outside"
);
console.log("✅ Use v flag regex for complex Unicode matching and set operations");
console.log(
  "✅ Use resizable ArrayBuffer for dynamic binary data instead of concatenating buffers"
);
console.log("✅ Always validate user input strings with isWellFormed() before processing");
console.log(
  "⚠️  Remember that Object.groupBy returns a plain object with prototype (use Object.create(null) if needed)"
);
console.log(
  "⚠️  Atomics.waitAsync is only useful with SharedArrayBuffer (requires COOP/COEP headers in browsers)"
);

// ============================================
// 9. Cross-references
// ============================================
console.log("\n--- 9. Cross-references ---\n");

console.log("📘 Promises: 30-promises.js");
console.log("📘 Regular Expressions: 21-regex.js");
console.log("📘 Typed Arrays: 41-typed-arrays.js");
console.log("📘 Atomics: 41-typed-arrays.js");
console.log("� Unicode and Strings: 04-strings.js");
console.log("📘 Arrays: 06-arrays.js");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39.4-es2024-features-ts-comparison.ts
*/

// == verification block ==
// feature: Object.groupBy
// stage4Date: 2023-11
// stage4DateType: exact
// source: https://github.com/tc39/proposal-array-grouping
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Map.groupBy
// stage4Date: 2023-11
// stage4DateType: exact
// source: https://github.com/tc39/proposal-array-grouping
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Promise.withResolvers
// stage4Date: 2023-11
// stage4DateType: exact
// source: https://github.com/tc39/proposal-promise-with-resolvers
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: RegExp v flag
// stage4Date: 2023-05
// stage4DateType: exact
// source: https://github.com/tc39/proposal-regexp-v-flag
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: ArrayBuffer.transfer
// stage4Date: 2024-02
// stage4DateType: exact
// source: https://github.com/tc39/proposal-arraybuffer-transfer
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Resizable ArrayBuffer
// stage4Date: 2023-09
// stage4DateType: exact
// source: https://github.com/tc39/proposal-resizablearraybuffer
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Well-Formed Unicode Strings
// stage4Date: 2023-05
// stage4DateType: exact
// source: https://github.com/tc39/proposal-is-usv-string
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Atomics.waitAsync
// stage4Date: 2023-05
// stage4DateType: exact
// source: https://github.com/tc39/proposal-atomics-wait-async
// lastVerified: 2026-09-01
// == end verification block ==
