// Arrays - Typed Arrays TypeScript Comparison
// 📘 Complementary to: 06.5-typed-arrays.js

export {};

console.log("=== Arrays - Typed Arrays TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. TYPED ARRAY TYPES
 *    JS:  Constructor creates typed array, runtime checks
 *    TS:  Types like Int8Array, Uint8Array, Float64Array are built-in
 *
 * 2. ARRAYBUFFER AND DATAVIEW
 *    JS:  Buffer operations, byte-level access
 *    TS:  ArrayBuffer and DataView have strong type definitions
 *
 * 3. GENERIC TYPED ARRAY CREATION
 *    TS:  Can use generic TypedArray types for utilities
 *
 * 4. TYPE GUARDS
 *    TS:  Array.isArray checks for regular arrays, not TypedArrays
 */

// Example 1: Typed array types
console.log("1. Typed array types:");
const int8: Int8Array = new Int8Array([10, 20, 30, 127, -128]);
const uint8: Uint8Array = new Uint8Array(5);
const float64: Float64Array = new Float64Array([1.1, 2.2, Math.PI]);
const bigInt64: BigInt64Array = new BigInt64Array([1n, 2n, 3n]);

console.log("  Int8Array:", int8);
console.log("  Uint8Array:", uint8);
console.log("  Float64Array:", float64);
console.log("  BigInt64Array:", bigInt64);

// Example 2: ArrayBuffer creation
console.log("\n2. ArrayBuffer creation:");
const buffer: ArrayBuffer = new ArrayBuffer(16);
console.log("  buffer byteLength:", buffer.byteLength);
console.log("  buffer is resizable:", buffer.resizable);

// Resizable ArrayBuffer (ES2023+)
const resizableBuffer = new ArrayBuffer(32, { maxByteLength: 64 });
console.log("  resizableBuffer:", resizableBuffer);
console.log("  resizableBuffer.maxByteLength:", resizableBuffer.maxByteLength);

// Example 3: TypedArray views on ArrayBuffer
console.log("\n3. TypedArray views on ArrayBuffer:");
const viewBuffer: ArrayBuffer = new ArrayBuffer(16);
const int32View: Int32Array = new Int32Array(viewBuffer, 0, 2);
const uint8View: Uint8Array = new Uint8Array(viewBuffer, 8, 8);

int32View[0] = 1000;
int32View[1] = 2000;
console.log("  Int32 view:", [...int32View]);
console.log("  Uint8 view:", [...uint8View]);

// Example 4: DataView for flexible access
console.log("\n4. DataView:");
const dvBuffer: ArrayBuffer = new ArrayBuffer(16);
const view: DataView = new DataView(dvBuffer);

view.setInt8(0, 42);
view.setFloat64(1, Math.PI);
view.setUint32(9, 0x12345678);

console.log("  getInt8(0):", view.getInt8(0));
console.log("  getFloat64(1):", view.getFloat64(1).toFixed(4));
console.log("  getUint32(9):", view.getUint32(9).toString(16));

// Example 5: Endianness control
console.log("\n5. Endianness:");
const endianBuffer: ArrayBuffer = new ArrayBuffer(4);
const endianView: DataView = new DataView(endianBuffer);

endianView.setUint32(0, 0x12345678, false); // big-endian
const bytesBig: Uint8Array = new Uint8Array(endianBuffer);
console.log(
  "  big-endian:",
  [...bytesBig].map(b => b.toString(16))
);

endianView.setUint32(0, 0x12345678, true); // little-endian
const bytesLittle: Uint8Array = new Uint8Array(endianBuffer);
console.log(
  "  little-endian:",
  [...bytesLittle].map(b => b.toString(16))
);

// Example 6: TypedArray iteration methods
console.log("\n6. TypedArray iteration:");
const typedArr: Int16Array = new Int16Array([5, 3, 8, 1, 9, 4]);

const doubled: Int16Array = typedArr.map(x => x * 2);
const filtered: Int16Array = typedArr.filter(x => x > 5);
const sum: number = typedArr.reduce((acc, n) => acc + n, 0);

console.log("  map (doubled):", doubled);
console.log("  filter (>5):", filtered);
console.log("  reduce (sum):", sum);

// Example 7: TypedArray methods
console.log("\n7. TypedArray methods:");
const originalTA: Float32Array = new Float32Array([1.0, 2.0, 3.0]);

// set() - bulk copy
const targetTA: Int32Array = new Int32Array(8);
targetTA.set([10, 20, 30]);
targetTA.set([40, 50], 3);
console.log("  after set():", targetTA);

// subarray() - view (not copy)
const fullArray: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6]);
const firstHalf: Uint8Array = fullArray.subarray(0, 3);
console.log("  subarray:", firstHalf);
firstHalf[0] = 99;
console.log("  original after subarray modify:", fullArray); // Shows mutation

// Example 8: Conversion between regular and typed arrays
console.log("\n8. Conversions:");
const regularArray: number[] = [1, 2, 3, 4, 5];
const toTyped: Uint16Array = new Uint16Array(regularArray);
const backToRegular1: number[] = Array.from(toTyped);
const backToRegular2: number[] = [...toTyped];

console.log("  regular → typed:", toTyped);
console.log("  typed → regular (Array.from):", backToRegular1);
console.log("  typed → regular (spread):", backToRegular2);

// Example 9: Generic typed array utility
console.log("\n9. Generic utilities:");
interface TypedArrayConstructor<T> {
  new (buffer: ArrayBufferLike, byteOffset?: number, length?: number): T;
  BYTES_PER_ELEMENT: number;
}
function createTypedArray<
  T extends ArrayBufferView & { BYTES_PER_ELEMENT: number },
>(ctor: TypedArrayConstructor<T>, size: number): T {
  const buffer = new ArrayBuffer(size * ctor.BYTES_PER_ELEMENT);
  return new ctor(buffer);
}

const int32Typed = createTypedArray(Int32Array, 5);
console.log("  generic Int32Array:", int32Typed);

const float32Typed = createTypedArray(Float32Array, 3);
console.log("  generic Float32Array:", float32Typed);

// Example 10: Type guard for TypedArrays
console.log("\n10. Type guard:");
function processArrayBuffer(data: ArrayBuffer | Uint8Array): Uint8Array {
  if (data instanceof Uint8Array) {
    return data;
  }
  return new Uint8Array(data);
}

const input1: Uint8Array = new Uint8Array([1, 2, 3]);
const input2: ArrayBuffer = new ArrayBuffer(4);
console.log("  processArrayBuffer(Uint8Array):", processArrayBuffer(input1));
console.log("  processArrayBuffer(ArrayBuffer):", processArrayBuffer(input2));

// Example 11: Clamped vs regular array
console.log("\n11. Clamped array:");
const clamped: Uint8ClampedArray = new Uint8ClampedArray(3);
clamped[0] = 255;
clamped[1] = 300; // Clamps to 255
clamped[2] = -10; // Clamps to 0
console.log("  Uint8ClampedArray:", clamped);

const regularUint8: Uint8Array = new Uint8Array(3);
regularUint8[0] = 255;
regularUint8[1] = 300; // Wraps to 44
regularUint8[2] = -10; // Wraps
console.log("  Uint8Array:", regularUint8);

// Example 12: TypedArray with BigInt
console.log("\n12. BigInt typed arrays:");
const bigIntArr: BigUint64Array = new BigUint64Array([1n, 2n, 3n]);
bigIntArr[0] = 10000000000n;
console.log("  BigUint64Array:", bigIntArr);

// Example 13: SharedArrayBuffer
console.log("\n13. SharedArrayBuffer:");
const sharedBuffer: SharedArrayBuffer = new SharedArrayBuffer(1024);
const sharedView: Int32Array = new Int32Array(sharedBuffer);
sharedView[0] = 42;
console.log("  SharedArrayBuffer view[0]:", sharedView[0]);

/**
 * 📋 Key Takeaways:
 * - TypedArray types are built-in: Int8Array, Uint8Array, Float64Array, etc.
 * - ArrayBuffer and DataView have strong type definitions
 * - Views on same ArrayBuffer share memory (important for performance)
 * - DataView provides flexible byte-level access with endianness control
 * - Uint8ClampedArray clamps values; Uint8Array wraps
 * - Generic utilities can work with any TypedArray type
 * - SharedArrayBuffer enables shared memory between workers
 * - Type guards (instanceof) distinguish between ArrayBuffer and TypedArrays
 */
