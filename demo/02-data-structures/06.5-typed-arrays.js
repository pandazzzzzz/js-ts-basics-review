// Arrays - Typed Arrays Demo
// 📘 For TypeScript comparison, see: 06.5-typed-arrays-ts-comparison.ts

export {};

// ============================================
// This file covers typed arrays (ES6) for binary data:
//   1. TypedArray types  2. ArrayBuffer  3. DataView  4. Methods/patterns
// ============================================

console.log("=== Arrays - Typed Arrays Demo ===\n");

// ============================================
// 1. Typed Arrays Overview
// ============================================
/**
 * Typed Arrays - Fixed-type numeric arrays (ES6/ES2015)
 *
 * Key Differences from regular arrays:
 * - Fixed element type (Int8, Uint8, Float64, etc.)
 * - Fixed size after creation
 * - Backed by ArrayBuffer (raw binary memory)
 * - Much faster for numeric operations
 *
 * Use Cases:
 * - WebGL / WebGPU graphics
 * - Audio/Video processing (Web Audio API)
 * - Binary file I/O (File API, Fetch with ArrayBuffer)
 * - Network protocols (WebSocket binary frames)
 * - Cryptography (Web Crypto API)
 * - WASM interop
 *
 * Available Types:
 * - Int8Array, Uint8Array, Uint8ClampedArray
 * - Int16Array, Uint16Array
 * - Int32Array, Uint32Array
 * - Float32Array, Float64Array
 * - BigInt64Array, BigUint64Array
 */

console.log("=== 1. Typed Arrays Overview ===");
console.log("Typed arrays provide efficient binary data storage");
console.log("Backed by ArrayBuffer (raw memory)");
console.log("Fixed element type and size\n");

// ============================================
// 2. Typed Array Types
// ============================================
/**
 * Each TypedArray type corresponds to a numeric format:
 *
 * Type                | Bytes | Range                         | Use Case
 * --------------------|-------|-------------------------------|----------
 * Int8Array           | 1     | -128 to 127                   | signed bytes
 * Uint8Array          | 1     | 0 to 255                      | unsigned bytes, colors
 * Uint8ClampedArray   | 1     | 0 to 255 (clamped)            | Canvas pixels
 * Int16Array          | 2     | -32768 to 32767               | signed shorts
 * Uint16Array         | 2     | 0 to 65535                    | unsigned shorts
 * Int32Array          | 4     | -2^31 to 2^31-1               | signed ints
 * Uint32Array         | 4     | 0 to 2^32-1                   | unsigned ints
 * Float32Array        | 4     | ~±3.4e38 (7 digits)           | graphics coordinates
 * Float64Array        | 8     | ~±1.8e308 (15 digits)         | standard JS numbers
 * BigInt64Array       | 8     | -2^63 to 2^63-1               | big 64-bit signed
 * BigUint64Array      | 8     | 0 to 2^64-1                   | big 64-bit unsigned
 */

console.log("=== 2. Typed Array Types ===");

// 2.1 Creating TypedArrays
// From array literal
const int8 = new Int8Array([10, 20, 30, 127, -128]);
console.log("Int8Array:", int8);
console.log("Bytes per element:", Int8Array.BYTES_PER_ELEMENT);
console.log("Byte length:", int8.byteLength); // 5 (5 elements × 1 byte)

// Uint8Array - unsigned 8-bit (0-255)
const uint8 = new Uint8Array(5); // Creates array of 5 zeros
console.log("\nUint8Array (empty, size 5):", uint8);
uint8[0] = 255; // Max value
uint8[1] = 300; // Overflow! Wraps to 44 (300 - 256 = 44)
console.log("After setting 255 and 300:", uint8); // [255, 44, 0, 0, 0]
console.log("⚠️  Uint8Array wraps on overflow (mod 256)");

// Uint8ClampedArray - clamps instead of wrapping
const clamped = new Uint8ClampedArray(3);
clamped[0] = 255;
clamped[1] = 300; // Clamps to 255
clamped[2] = -10; // Clamps to 0
console.log("\nUint8ClampedArray:", clamped); // [255, 255, 0]
console.log("Clamped clamps values to [0, 255] instead of wrapping");

// Float64Array - matches standard JS numbers
const float64 = new Float64Array([1.1, 2.2, 3.3, Math.PI]);
console.log("\nFloat64Array:", float64);
console.log("Bytes per element:", Float64Array.BYTES_PER_ELEMENT); // 8

// Float32Array - lower precision but smaller
const float32 = new Float32Array([1.1, 2.2, 3.3]);
console.log("Float32Array:", float32);
console.log("Bytes per element:", Float32Array.BYTES_PER_ELEMENT); // 4
console.log("Note: Float32 has limited precision (~7 decimal digits)");

// 2.2 Creating from size
const emptyInt32 = new Int32Array(4);
console.log("\nEmpty Int32Array(4):", emptyInt32); // [0, 0, 0, 0]

// 2.3 Creating from another TypedArray
const source = new Int8Array([1, 2, 3]);
const copied = new Uint16Array(source);
console.log("\nCopy from another TypedArray:", copied); // Uint16Array [1, 2, 3]

// 2.4 Type sizes reference
console.log("\n📋 All TypedArray types and sizes:");
console.log("  Int8Array:", Int8Array.BYTES_PER_ELEMENT, "byte");
console.log("  Uint8Array:", Uint8Array.BYTES_PER_ELEMENT, "byte");
console.log("  Uint8ClampedArray:", Uint8ClampedArray.BYTES_PER_ELEMENT, "byte");
console.log("  Int16Array:", Int16Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Uint16Array:", Uint16Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Int32Array:", Int32Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Uint32Array:", Uint32Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Float32Array:", Float32Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Float64Array:", Float64Array.BYTES_PER_ELEMENT, "bytes");
console.log("  BigInt64Array:", BigInt64Array.BYTES_PER_ELEMENT, "bytes");
console.log("  BigUint64Array:", BigUint64Array.BYTES_PER_ELEMENT, "bytes");

// ============================================
// 3. ArrayBuffer - Raw Binary Memory
// ============================================
/**
 * ArrayBuffer - Fixed-length raw binary data buffer (ES6)
 *
 * - Represents a chunk of memory
 * - Cannot read/write directly (need TypedArray or DataView)
 * - Can be shared between multiple views
 * - Size in bytes specified at creation
 *
 * Multiple views can read/write to the same buffer!
 */

console.log("\n=== 3. ArrayBuffer ===");

// 3.1 Creating an ArrayBuffer
const buffer = new ArrayBuffer(16); // 16 bytes of raw memory
console.log("ArrayBuffer byte length:", buffer.byteLength); // 16
console.log("ArrayBuffer is resizable:", buffer.resizable); // false (default); .resizable/.resize() are ES2024

// 3.2 Multiple views on same buffer
const int32View = new Int32Array(buffer, 0, 2);   // First 8 bytes as 2 Int32s
const uint8View = new Uint8Array(buffer, 0, 8);    // Same first 8 bytes as 8 Uint8s

// Write through Int32 view
int32View[0] = 1000;
int32View[1] = 2000;

console.log("\nShared ArrayBuffer:");
console.log("Int32 view:", [...int32View]); // [1000, 2000]
console.log("Same bytes as Uint8 (little-endian):", [...uint8View]); // [232,3,0,0, 208,7,0,0]
// 1000 = 0x3E8 = [232, 3, 0, 0]; 2000 = 0x7D0 = [208, 7, 0, 0]
console.log("⚠️  Views share memory - writing to one affects others!");

// 3.3 Overlapping views example
const overlapBuf = new ArrayBuffer(4);
const uint32view = new Uint32Array(overlapBuf);
const byteView = new Uint8Array(overlapBuf);

uint32view[0] = 0x41424344; // "ABCD" as a 32-bit integer
console.log("\nOverlapping views:");
console.log("As Uint32:", uint32view[0].toString(16)); // 41424344
console.log("As bytes:", [...byteView].map(b => String.fromCharCode(b)));
// In little-endian: ['D', 'C', 'B', 'A']

// ============================================
// 4. DataView - Flexible Data Access
// ============================================
/**
 * DataView - Low-level interface for reading/writing multiple types (ES6)
 *
 * Key Benefits:
 * - Control endianness (big-endian / little-endian)
 * - Read/write different types at different offsets
 * - No alignment requirements
 *
 * Use Cases:
 * - Parsing binary file formats
 * - Network protocol parsing
 * - When you need mixed types in one buffer
 */

console.log("\n=== 4. DataView ===");

// 4.1 Creating a DataView
const dvBuffer = new ArrayBuffer(16);
const view = new DataView(dvBuffer);

// Write various types at specific offsets
view.setInt8(0, 42);           // 1 byte at offset 0
view.setFloat64(1, Math.PI);    // 8 bytes at offset 1
view.setUint32(9, 0x12345678);  // 4 bytes at offset 9
view.setUint8(13, 255);         // 1 byte at offset 13

// Read back
console.log("DataView reads:");
console.log("Int8 at 0:", view.getInt8(0)); // 42
console.log("Float64 at 1:", view.getFloat64(1).toFixed(4)); // ~3.1416
console.log("Uint32 at 9:", view.getUint32(9).toString(16)); // 12345678
console.log("Uint8 at 13:", view.getUint8(13)); // 255

// 4.2 Endianness control
console.log("\nEndianness:");
const endianBuf = new ArrayBuffer(4);
const endianView = new DataView(endianBuf);

endianView.setUint32(0, 0x12345678, false); // big-endian (network byte order)
const bytesBig = new Uint8Array(endianBuf);
console.log("Big-endian bytes:", [...bytesBig].map(b => b.toString(16))); // [12, 34, 56, 78]

endianView.setUint32(0, 0x12345678, true); // little-endian (x86 native)
const bytesLittle = new Uint8Array(endianBuf);
console.log("Little-endian bytes:", [...bytesLittle].map(b => b.toString(16))); // [78, 56, 34, 12]

// Default is big-endian (false) for network protocol compatibility

// ============================================
// 5. Typed Array Methods and Patterns
// ============================================
/**
 * TypedArray Methods - Similar to regular arrays but with differences
 *
 * Similar methods: map, filter, reduce, forEach, find, sort, etc.
 * Key differences:
 * - Fixed size (no push/pop/splice)
 * - Returns same TypedArray type from map/filter
 * - No holes/sparse arrays
 */

console.log("\n=== 5. Typed Array Methods and Patterns ===");

// 5.1 Available iteration methods
const typed = new Int16Array([5, 3, 8, 1, 9, 4]);
console.log("TypedArray:", typed);

// Iteration works like regular arrays
console.log("forEach:");
typed.forEach((val, i) => console.log(`  [${i}]: ${val}`));

// map returns same TypedArray type
const doubled = typed.map(x => x * 2);
console.log("map (doubled):", doubled);
console.log("map result type:", doubled.constructor.name); // Int16Array

// filter returns same type
const filtered = typed.filter(x => x > 5);
console.log("filter (>5):", filtered); // Int16Array [8, 9]

// reduce works
const sum = typed.reduce((acc, n) => acc + n, 0);
console.log("reduce (sum):", sum); // 30

// sort
console.log("sorted:", typed.slice().sort()); // [1, 3, 4, 5, 8, 9]
console.log("⚠️  sort still mutates (use slice first like regular arrays)");

// 5.2 Methods NOT available on TypedArrays
console.log("\nMethods NOT on TypedArray:");
console.log("  ❌ push/pop (fixed size)");
console.log("  ❌ shift/unshift (fixed size)");
console.log("  ❌ splice (fixed size)");
console.log("  ❌ concat (use spread or construct from arrays)");

// Alternative for push - copy to larger array
const originalTA = new Float32Array([1.0, 2.0, 3.0]);
const withAppend = new Float32Array(originalTA.length + 1);
withAppend.set(originalTA);
withAppend[originalTA.length] = 4.0;
console.log("\nAppend to TypedArray pattern:", withAppend); // [1, 2, 3, 4]

// 5.3 set() - Copy data in bulk
const target = new Int32Array(8);
target.set([10, 20, 30]); // Write at offset 0
target.set([40, 50], 3);  // Write at offset 3
console.log("\nset() - bulk copy:", target); // [10, 20, 30, 40, 50, 0, 0, 0]

// 5.4 subarray() - Create view without copying
const fullArray = new Uint8Array([1, 2, 3, 4, 5, 6]);
const firstHalf = fullArray.subarray(0, 3);
const secondHalf = fullArray.subarray(3);
console.log("\nsubarray() - view (no copy):");
console.log("First half:", firstHalf); // [1, 2, 3]
console.log("Second half:", secondHalf); // [4, 5, 6]
firstHalf[0] = 99;
console.log("After modifying firstHalf, original:", fullArray); // [99, 2, 3, 4, 5, 6]
console.log("⚠️  subarray shares memory! Changes affect original");

// 5.5 Converting to/from regular arrays
const regularArray = [1, 2, 3, 4, 5];
const fromRegular = new Uint16Array(regularArray);
const backToRegular = Array.from(fromRegular);
const backToRegular2 = [...fromRegular];
console.log("\nConversion:");
console.log("Regular → Typed:", fromRegular);
console.log("Typed → regular (Array.from):", backToRegular);
console.log("Typed → regular (spread):", backToRegular2);

// 5.6 Performance example - sum comparison
const bigRegular = Array.from({ length: 1000000 }, (_, i) => i);
const bigTyped = new Float64Array(bigRegular);

console.log("\nPerformance comparison (1 million elements):");
console.time("Regular array sum");
let regularSum = 0;
for (let i = 0; i < bigRegular.length; i++) regularSum += bigRegular[i];
console.timeEnd("Regular array sum");

console.time("Typed array sum");
let typedSum = 0;
for (let i = 0; i < bigTyped.length; i++) typedSum += bigTyped[i];
console.timeEnd("Typed array sum");

console.log("Typed arrays are typically faster for numeric operations");

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Overflow/wrapping
console.log("\nPitfall 1 - Overflow wrapping:");
const overflowUint8 = new Uint8Array(1);
overflowUint8[0] = 300;
console.log("Uint8Array[0] = 300 →", overflowUint8[0]); // 44 (wraps!)
console.log("✅ Use Uint8ClampedArray if you need clamping to 0-255");

// Pitfall 2: Endianness
console.log("\nPitfall 2 - Endianness:");
console.log("❌ x86 is little-endian; network protocols use big-endian");
console.log("✅ Use DataView with explicit endianness flag for binary protocols");

// Pitfall 3: Views share memory
console.log("\nPitfall 3 - Shared buffer views:");
console.log("❌ Multiple views on same ArrayBuffer share memory");
console.log("✅ Create a new buffer + copy if you need independent data");

// Pitfall 4: TypedArrays are fixed size
console.log("\nPitfall 4 - Fixed size:");
console.log("❌ No push/pop/splice on TypedArrays");
console.log("✅ Create new larger TypedArray + set() to simulate growth");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use TypedArrays for large numeric datasets (performance)");
console.log("✅ Use Float64Array for general numeric work (matches JS number)");
console.log("✅ Use Uint8ClampedArray for canvas/image pixel data");
console.log("✅ Use DataView when parsing binary formats with mixed types");
console.log("✅ Be explicit about endianness when reading/writing binary");
console.log("✅ Remember TypedArrays have fixed size after creation");
console.log("✅ Use set() for bulk copying (much faster than element-by-element)");
console.log("⚠️  Views on same ArrayBuffer share memory (mutations propagate)");
console.log("⚠️  Uint8Array wraps on overflow; Uint8ClampedArray clamps");
console.log("⚠️  subarray() creates a view, not a copy (unlike slice())");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────────┬──────────────────────────────────────┐
│ Component       │ Purpose                              │
├─────────────────┼──────────────────────────────────────┤
│ ArrayBuffer     │ Raw memory allocation                │
│ TypedArray      │ Typed view (Int8, Float64, etc.)    │
│ DataView        │ Flexible multi-type access           │
└─────────────────┴──────────────────────────────────────┘

TypedArray hierarchy:
  ArrayBuffer (raw bytes)
    └── TypedArray view (Int8Array, Float32Array, etc.)
    └── DataView (flexible byte-level access)

Key rules:
  - Fixed size (no push/pop)
  - Same-type elements only
  - Multiple views can share one buffer
  - Much faster than regular arrays for numeric code
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06.1-arrays-basics.js / 06.2-arrays-iteration.js / 06.3-arrays-search-sort.js / 06.4-arrays-manipulation.js - Regular array methods");
console.log("📘 45-web-apis.js - Web APIs that use TypedArrays (Canvas, Web Audio)");
console.log("📘 43-storage-network.js - Fetch API with ArrayBuffer");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06.5-typed-arrays-ts-comparison.ts
*/
