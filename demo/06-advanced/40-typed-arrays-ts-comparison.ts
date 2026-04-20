// TypeScript vs JavaScript: TypedArray and Binary Data Comparison
// 📘 For JavaScript examples, see: 40-typed-arrays.js
// This file demonstrates TypeScript-specific type features for binary data

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: ArrayBuffer Types
// ============================================

console.log("=== ArrayBuffer Types ===\n");

// TypeScript provides full type definitions for ArrayBuffer
const buffer: ArrayBuffer = new ArrayBuffer(16);
const byteLength: number = buffer.byteLength;

// ArrayBufferLike type includes ArrayBuffer and SharedArrayBuffer
type BufferSource = ArrayBuffer | SharedArrayBuffer;

function processBuffer(buffer: ArrayBufferLike): void {
  console.log("Buffer size:", buffer.byteLength);
}

processBuffer(buffer);

// Slicing is type-safe
const sliced: ArrayBuffer = buffer.slice(0, 8);

console.log(`
TypeScript ArrayBuffer types:
- ArrayBuffer: Fixed-length raw binary data
- SharedArrayBuffer: Shared between workers
- ArrayBufferLike: Union of ArrayBuffer | SharedArrayBuffer
- ArrayBufferView: TypedArray | DataView
`);

// ============================================
// Section 2: TypedArray Types
// ============================================

console.log("\n=== TypedArray Types ===\n");

// All TypedArray types are fully typed in TypeScript
const int8: Int8Array = new Int8Array(4);
const uint8: Uint8Array = new Uint8Array(4);
const uint8Clamped: Uint8ClampedArray = new Uint8ClampedArray(4);
const int16: Int16Array = new Int16Array(4);
const uint16: Uint16Array = new Uint16Array(4);
const int32: Int32Array = new Int32Array(4);
const uint32: Uint32Array = new Uint32Array(4);
const float32: Float32Array = new Float32Array(4);
const float64: Float64Array = new Float64Array(4);
const bigInt64: BigInt64Array = new BigInt64Array(4);
const bigUint64: BigUint64Array = new BigUint64Array(4);

// Type inference works correctly
const fromArray = new Uint8Array([10, 20, 30, 40]);
// fromArray: Uint8Array

// TypeScript enforces correct types
int8[0] = 127;  // OK
// int8[0] = "string"; // Error: Type 'string' is not assignable to type 'number'

// BigInt arrays require BigInt values
bigInt64[0] = 9007199254740991n; // OK
// bigInt64[0] = 123; // Error: Type 'number' is not assignable to type 'bigint'

console.log(`
TypeScript TypedArray benefits:
- Full type definitions for all TypedArray types
- Type inference for array methods
- Compile-time type checking
- Generic TypedArray<T> base type
`);

// ============================================
// Section 3: TypedArray Methods with Types
// ============================================

console.log("\n=== TypedArray Methods with Types ===\n");

const numbers: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);

// Type inference works through method chains
const doubled: Uint8Array = numbers.map(x => x * 2);
const filtered: Uint8Array = numbers.filter(x => x > 2);
const found: number | undefined = numbers.find(x => x > 3);
const sum: number = numbers.reduce((a, b) => a + b, 0);

// Type-safe callbacks
numbers.forEach((value: number, index: number, array: Uint8Array) => {
  console.log(`[${index}] = ${value}`);
});

// subarray returns same type
const sub: Uint8Array = numbers.subarray(1, 4);

// slice returns same type
const slicedArray: Uint8Array = numbers.slice(1, 4);

// set is type-safe
const target = new Uint8Array(10);
target.set([10, 20, 30], 2); // OK
// target.set(["a", "b"], 0); // Error: Type 'string' is not assignable to type 'number'

console.log("TypeScript ensures type safety through all array operations");

// ============================================
// Section 4: DataView with Types
// ============================================

console.log("\n=== DataView with Types ===\n");

const dataBuffer: ArrayBuffer = new ArrayBuffer(8);
const dataView: DataView = new DataView(dataBuffer);

// All DataView methods are fully typed
dataView.setInt8(0, 127);           // (byteOffset: number, value: number) => void
dataView.setInt16(1, 32767);        // (byteOffset: number, value: number, littleEndian?: boolean) => void
dataView.setFloat32(3, 3.14);       // (byteOffset: number, value: number, littleEndian?: boolean) => void

// Return types are correctly inferred
const int8Value: number = dataView.getInt8(0);
const int16Value: number = dataView.getInt16(1);
const float32Value: number = dataView.getFloat32(3);

// Endianness parameter is typed as boolean
dataView.setUint32(0, 0x12345678, false); // Big-endian
dataView.setUint32(0, 0x12345678, true);  // Little-endian

// Type-safe DataView wrapper
class TypedDataView {
  private view: DataView;

  constructor(buffer: ArrayBuffer, byteOffset?: number, byteLength?: number) {
    this.view = new DataView(buffer, byteOffset, byteLength);
  }

  readInt8(offset: number): number {
    return this.view.getInt8(offset);
  }

  writeInt8(offset: number, value: number): void {
    this.view.setInt8(offset, value);
  }

  readUint32(offset: number, littleEndian = false): number {
    return this.view.getUint32(offset, littleEndian);
  }

  writeUint32(offset: number, value: number, littleEndian = false): void {
    this.view.setUint32(offset, value, littleEndian);
  }
}

// ============================================
// Section 5: BufferSource Type
// ============================================

console.log("\n=== BufferSource Type ===\n");

// BufferSource is used in Web APIs (TypeScript built-in type)
// type BufferSource = ArrayBufferView | ArrayBuffer;

// ArrayBufferView includes all TypedArrays and DataView
console.log(`
ArrayBufferView includes:
- Int8Array, Uint8Array, Uint8ClampedArray
- Int16Array, Uint16Array
- Int32Array, Uint32Array
- Float32Array, Float64Array
- BigInt64Array, BigUint64Array
- DataView
`);

// Type-safe function accepting any buffer source
function processBufferSource(data: ArrayBuffer | ArrayBufferView): void {
  if (data instanceof ArrayBuffer) {
    console.log("ArrayBuffer:", data.byteLength);
  } else if (ArrayBuffer.isView(data)) {
    console.log("ArrayBufferView:", data.byteLength, data.byteOffset);
  }
}

processBufferSource(buffer);
processBufferSource(uint8);
processBufferSource(dataView);

console.log(`
BufferSource type is used in:
- crypto.subtle.encrypt(algorithm, key, data: BufferSource)
- crypto.subtle.decrypt(algorithm, key, data: BufferSource)
- fetch body: new Response(data: BufferSource)
- WebSocket.send(data: BufferSource)
`);

// ============================================
// Section 6: Blob and File Types
// ============================================

console.log("\n=== Blob and File Types ===\n");

// Blob constructor is fully typed
type BlobPart = BufferSource | Blob | string;

// Type-safe Blob creation
// const blob: Blob = new Blob(
//   ["Hello, World!"],
//   { type: "text/plain" }
// );

// Blob from TypedArray
const binaryData = new Uint8Array([72, 101, 108, 108, 111]);
// const binaryBlob: Blob = new Blob([binaryData], { type: "application/octet-stream" });

// Blob methods return Promises with correct types
// const text: Promise<string> = blob.text();
// const arrayBuffer: Promise<ArrayBuffer> = blob.arrayBuffer();
// const stream: ReadableStream<Uint8Array> = blob.stream();

// File extends Blob with additional properties
// const file: File = new File(["content"], "filename.txt", {
//   type: "text/plain",
//   lastModified: Date.now()
// });

// const fileName: string = file.name;
// const lastModified: number = file.lastModified;

console.log(`
TypeScript Blob/File types:
- Blob: Immutable raw data
- File: Blob with name and lastModified
- BlobPart: BufferSource | Blob | string
- BlobPropertyBag: { type?: string; endings?: "transparent" | "native" }
- FilePropertyBag: BlobPropertyBag & { lastModified?: number }
`);

// ============================================
// Section 7: Binary Protocol Parsing
// ============================================

console.log("\n=== Binary Protocol Parsing with Types ===\n");

// Type-safe protocol header
interface ProtocolHeader {
  version: number;
  type: number;
  length: number;
  timestamp: number;
}

function parseHeader(buffer: ArrayBuffer): ProtocolHeader {
  const view = new DataView(buffer);
  return {
    version: view.getUint8(0),
    type: view.getUint8(1),
    length: view.getUint16(2, false),
    timestamp: view.getUint32(4, false)
  };
}

function serializeHeader(header: ProtocolHeader): ArrayBuffer {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint8(0, header.version);
  view.setUint8(1, header.type);
  view.setUint16(2, header.length, false);
  view.setUint32(4, header.timestamp, false);
  return buffer;
}

// Usage
const headerBuffer = serializeHeader({
  version: 1,
  type: 2,
  length: 1024,
  timestamp: Date.now()
});

const parsed: ProtocolHeader = parseHeader(headerBuffer);
console.log("Parsed header:", parsed);

// Generic binary serializer
class BinarySerializer<T> {
  constructor(
    private serialize: (value: T) => ArrayBuffer,
    private deserialize: (buffer: ArrayBuffer) => T
  ) {}

  toBuffer(value: T): ArrayBuffer {
    return this.serialize(value);
  }

  fromBuffer(buffer: ArrayBuffer): T {
    return this.deserialize(buffer);
  }
}

// Usage
const headerSerializer = new BinarySerializer<ProtocolHeader>(
  serializeHeader,
  parseHeader
);

// ============================================
// Section 8: Type Guards for Binary Data
// ============================================

console.log("\n=== Type Guards for Binary Data ===\n");

// Type guard for TypedArray
function isTypedArray(value: unknown): value is ArrayBufferView {
  return ArrayBuffer.isView(value);
}

// Type guard for specific TypedArray
function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array;
}

// Type guard for ArrayBuffer
function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

// Usage
function processData(data: unknown): void {
  if (isArrayBuffer(data)) {
    console.log("ArrayBuffer:", data.byteLength);
  } else if (isUint8Array(data)) {
    console.log("Uint8Array:", data.length);
  } else if (isTypedArray(data)) {
    console.log("TypedArray:", data.byteLength);
  } else {
    console.log("Unknown type");
  }
}

// ============================================
// Section 9: Generic TypedArray Utilities
// ============================================

console.log("\n=== Generic TypedArray Utilities ===\n");

// Generic function for any TypedArray
type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | BigInt64ArrayConstructor
  | BigUint64ArrayConstructor;

type TypedArrayInstance =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

function concatenateTypedArrays<T extends TypedArrayInstance>(
  arrays: T[],
  ArrayType: TypedArrayConstructor
): T {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new (ArrayType as any)(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result as T;
}

// Usage
const arr1 = new Uint8Array([1, 2, 3]);
const arr2 = new Uint8Array([4, 5, 6]);
const combined = concatenateTypedArrays([arr1, arr2], Uint8Array);
console.log("Combined:", combined);

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use specific TypedArray types (Uint8Array, not any)");
console.log("2. Leverage type inference for array methods");
console.log("3. Use BufferSource type for Web API parameters");
console.log("4. Create type-safe wrappers for binary protocols");
console.log("5. Use type guards to narrow ArrayBufferView types");
console.log("6. Define interfaces for binary data structures");

console.log("\n❌ DON'T:");
console.log("1. Don't use any type with TypedArrays");
console.log("2. Don't forget BigInt suffix for BigInt arrays");
console.log("3. Don't mix number and bigint types");
console.log("4. Don't ignore byteOffset and byteLength");
console.log("5. Don't use type assertions when type guards work");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - TYPED ARRAYS                            │
├─────────────────────────────────────────────────────────────────────┤
│ Type Safety:                                                        │
│   JavaScript: Runtime type checking only                           │
│   TypeScript: Compile-time type checking                           │
│                                                                     │
│ Method Return Types:                                               │
│   JavaScript: Inferred at runtime                                  │
│   TypeScript: Known at compile time                                │
│                                                                     │
│ BufferSource:                                                       │
│   JavaScript: No type definition                                   │
│   TypeScript: ArrayBufferView | ArrayBuffer                        │
│                                                                     │
│ Blob/File:                                                          │
│   JavaScript: Runtime properties                                   │
│   TypeScript: Full type definitions                                │
│                                                                     │
│ Binary Protocols:                                                   │
│   JavaScript: Manual type tracking                                 │
│   TypeScript: Interface-based type safety                          │
└─────────────────────────────────────────────────────────────────────┘
`);


// ============================================
// TEXTENCODER AND TEXTDECODER TYPES
// ============================================

console.log("\n=== TextEncoder and TextDecoder Types ===\n");

// TypeScript: Built-in types for Encoding API
// TextEncoder: Always UTF-8 encoding
// TextDecoder: Supports multiple encodings

// TextEncoder with types
const encoder: TextEncoder = new TextEncoder();
const encoding: string = encoder.encoding; // Always "utf-8"

// encode() returns Uint8Array
const text: string = "Hello, World!";
const encoded: Uint8Array = encoder.encode(text);

console.log("Encoded type:", encoded.constructor.name);
console.log("Encoded length:", encoded.length);

// encodeInto() with typed result
interface EncodeIntoResult {
  read: number;
  written: number;
}

const targetBuffer: Uint8Array = new Uint8Array(50);
const result: TextEncoderEncodeIntoResult = encoder.encodeInto(text, targetBuffer);

// result.read and result.written are typed as numbers
const charsRead: number = result.read;
const bytesWritten: number = result.written;

console.log(\`encodeInto: read \${charsRead} chars, wrote \${bytesWritten} bytes\`);

// TextDecoder with types
const decoder: TextDecoder = new TextDecoder('utf-8');
const decoderEncoding: string = decoder.encoding;
const fatal: boolean = decoder.fatal;
const ignoreBOM: boolean = decoder.ignoreBOM;

// decode() returns string
const bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
const decoded: string = decoder.decode(bytes);

console.log("Decoded:", decoded);

// Typed decoder with options
interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextDecodeOptions {
  stream?: boolean;
}

const strictDecoder: TextDecoder = new TextDecoder('utf-8', { fatal: true });
const streamDecoder: TextDecoder = new TextDecoder('utf-8', { fatal: false });

// Streaming decode with types
const chunk1: Uint8Array = new Uint8Array([72, 101, 108]);
const chunk2: Uint8Array = new Uint8Array([108, 111]);

const part1: string = streamDecoder.decode(chunk1, { stream: true });
const part2: string = streamDecoder.decode(chunk2, { stream: false });

console.log("Streamed:", part1 + part2);

// Generic encoding function with types
function encodeText(text: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

function decodeBytes(bytes: Uint8Array, encoding: string = 'utf-8'): string {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(bytes);
}

// Type-safe encoding conversion
function convertEncoding(
  bytes: Uint8Array,
  fromEncoding: string,
  toEncoding: string = 'utf-8'
): Uint8Array {
  const decoder = new TextDecoder(fromEncoding);
  const text = decoder.decode(bytes);
  
  const encoder = new TextEncoder(); // Always UTF-8
  return encoder.encode(text);
}

// Usage with type safety
const latin1Bytes: Uint8Array = new Uint8Array([72, 233, 108, 108, 111]);
const utf8Bytes: Uint8Array = convertEncoding(latin1Bytes, 'iso-8859-1', 'utf-8');

console.log("Converted encoding:", decodeBytes(utf8Bytes));

// Async file reading with types
async function readTextFile(file: File): Promise<string> {
  const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
  const bytes: Uint8Array = new Uint8Array(arrayBuffer);
  const decoder: TextDecoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}

// WebSocket binary message handling with types
interface WebSocketMessage {
  type: 'text' | 'binary';
  data: string | Uint8Array;
}

function handleWebSocketMessage(event: MessageEvent): WebSocketMessage {
  if (typeof event.data === 'string') {
    return { type: 'text', data: event.data };
  } else if (event.data instanceof ArrayBuffer) {
    const decoder = new TextDecoder();
    const bytes = new Uint8Array(event.data);
    const text = decoder.decode(bytes);
    return { type: 'binary', data: bytes };
  }
  throw new Error('Unknown message type');
}

// Base64 encoding with types
function base64EncodeTyped(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

function base64DecodeTyped(base64: string): string {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

// Type-safe CSV parsing
async function parseCSVFromBinary(arrayBuffer: ArrayBuffer): Promise<string[][]> {
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(arrayBuffer);
  const lines = text.split('\\n');
  return lines.map(line => line.split(','));
}

// Crypto operations with typed encoding
async function hashTextTyped(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

console.log("\nTextEncoder/TextDecoder TypeScript Features:");
console.log("  - Full type definitions for encoding/decoding");
console.log("  - Type-safe encode() and decode() methods");
console.log("  - Typed encodeInto() result");
console.log("  - Type-safe encoding options");
console.log("  - Generic encoding functions");

console.log("\nBest Practices:");
console.log("  ✅ Use TextEncoder/TextDecoder types explicitly");
console.log("  ✅ Type encoding options and results");
console.log("  ✅ Create generic encoding utilities");
console.log("  ✅ Handle encoding errors with try/catch");
console.log("  ✅ Use type guards for binary data");

console.log("\n📘 See 36-typed-arrays.js for detailed Encoding API examples!");
