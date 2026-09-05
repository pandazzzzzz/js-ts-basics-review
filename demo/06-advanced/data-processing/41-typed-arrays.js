// TypedArray and Binary Data Demo
// 📘 For TypeScript comparison, see: 41-typed-arrays-ts-comparison.ts
// 📘 javascript.info Part 3 > "Binary data, files" > "ArrayBuffer, binary arrays"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces typed arrays as a way to work with binary data in JavaScript.
// The examples show how ArrayBuffer and typed views are used to represent structured memory.

// ============================================
// Table of Contents
// ============================================
// 1. ArrayBuffer
// 2. TypedArray Views
// 3. DataView
// 4. TypedArray Methods
// 5. Blob and File (Browser)
// 6. SharedArrayBuffer and Atomics
// 7. Encoding API (TextEncoder/TextDecoder)
// 8. Practical Applications
// 9. Common Pitfalls
// 10. Best Practices

// ============================================
// Section 1: ArrayBuffer
// ============================================

console.log("\n=== ArrayBuffer ===");

// ArrayBuffer - Fixed-length raw binary data buffer
// - Allocates contiguous memory
// - Cannot be read or written directly
// - Need a "view" to access the data

const buffer = new ArrayBuffer(16); // Allocate 16 bytes
console.log("Buffer byte length:", buffer.byteLength); // 16

// ArrayBuffer properties
console.log("Buffer is ArrayBuffer:", buffer instanceof ArrayBuffer); // true

// Slicing creates a copy
const slicedBuffer = buffer.slice(0, 8); // Copy first 8 bytes
console.log("Sliced buffer length:", slicedBuffer.byteLength); // 8

// Use case: Binary data storage, file I/O, network protocols

// ============================================
// Section 2: TypedArray Views
// ============================================

console.log("\n=== TypedArray Views ===");

// TypedArray types (all inherit from TypedArray base class):
// Int8Array    - 8-bit signed integer (-128 to 127)
// Uint8Array   - 8-bit unsigned integer (0 to 255)
// Uint8ClampedArray - 8-bit unsigned, clamped to 0-255
// Int16Array   - 16-bit signed integer
// Uint16Array  - 16-bit unsigned integer
// Int32Array   - 32-bit signed integer
// Uint32Array  - 32-bit unsigned integer
// Float32Array - 32-bit floating point
// Float64Array - 64-bit floating point
// BigInt64Array  - 64-bit signed BigInt (ES2020)
// BigUint64Array - 64-bit unsigned BigInt (ES2020)

// Creating TypedArrays:

// 1. From ArrayBuffer
const buf = new ArrayBuffer(8);
const int8View = new Int8Array(buf);
const int16View = new Int16Array(buf);
console.log("Int8 length:", int8View.length); // 8 elements (8 bytes / 1 byte each)
console.log("Int16 length:", int16View.length); // 4 elements (8 bytes / 2 bytes each)

// 2. From length
const uint8 = new Uint8Array(4); // Creates buffer of 4 bytes
console.log("Uint8Array:", uint8); // [0, 0, 0, 0]

// 3. From array or iterable
const fromArray = new Uint8Array([10, 20, 30, 40]);
console.log("From array:", fromArray); // [10, 20, 30, 40]

// 4. From another TypedArray
const copied = new Uint8Array(fromArray);
console.log("Copied:", copied); // [10, 20, 30, 40]

// TypedArray properties
console.log("\nTypedArray properties:");
console.log("buffer:", uint8.buffer); // Underlying ArrayBuffer
console.log("byteLength:", uint8.byteLength); // 4 bytes
console.log("byteOffset:", uint8.byteOffset); // 0 (start position in buffer)
console.log("length:", uint8.length); // 4 elements
console.log("BYTES_PER_ELEMENT:", Uint8Array.BYTES_PER_ELEMENT); // 1

// Uint8ClampedArray - Special clamping behavior
const clamped = new Uint8ClampedArray(4);
clamped[0] = 300; // Clamped to 255
clamped[1] = -10; // Clamped to 0
console.log("Clamped array:", clamped); // [255, 0, 0, 0]

// BigInt TypedArrays (ES2020)
const bigInts = new BigInt64Array(2);
bigInts[0] = 9007199254740991n; // Larger than Number.MAX_SAFE_INTEGER
console.log("BigInt64Array:", bigInts);

// ============================================
// Section 3: DataView
// ============================================

console.log("\n=== DataView ===");

// DataView - Flexible multi-type view
// - Read/write different types at any byte offset
// - Control endianness (byte order)

const dataBuffer = new ArrayBuffer(8);
const dataView = new DataView(dataBuffer);

// Writing different types
dataView.setInt8(0, 127); // 1 byte at offset 0
dataView.setInt16(1, 32767); // 2 bytes at offset 1
dataView.setFloat32(3, 3.14); // 4 bytes at offset 3

// Reading back
console.log("Int8 at 0:", dataView.getInt8(0)); // 127
console.log("Int16 at 1:", dataView.getInt16(1)); // 32767
console.log("Float32 at 3:", dataView.getFloat32(3)); // 3.14...

// Endianness - Byte order
// Big-endian: Most significant byte first (network byte order)
// Little-endian: Least significant byte first (most CPUs)

const endianBuffer = new ArrayBuffer(4);
const endianView = new DataView(endianBuffer);

endianView.setUint32(0, 0x12345678, false); // Big-endian
console.log("Big-endian bytes:", new Uint8Array(endianBuffer)); // [0x12, 0x34, 0x56, 0x78]

endianView.setUint32(0, 0x12345678, true); // Little-endian
console.log("Little-endian bytes:", new Uint8Array(endianBuffer)); // [0x78, 0x56, 0x34, 0x12]

// When to use DataView vs TypedArray:
// DataView: Mixed types, need endianness control, parsing binary formats
// TypedArray: Uniform type, better performance, array-like operations

// ============================================
// Section 4: TypedArray Methods
// ============================================

console.log("\n=== TypedArray Methods ===");

const numbers = new Uint8Array([1, 2, 3, 4, 5]);

// Shared with regular arrays:
console.log(
  "map:",
  numbers.map(x => x * 2)
); // [2, 4, 6, 8, 10]
console.log(
  "filter:",
  numbers.filter(x => x > 2)
); // [3, 4, 5]
console.log(
  "find:",
  numbers.find(x => x > 3)
); // 4
console.log(
  "reduce:",
  numbers.reduce((a, b) => a + b, 0)
); // 15
numbers.forEach(x => console.log("forEach:", x));
console.log(
  "some:",
  numbers.some(x => x > 4)
); // true
console.log(
  "every:",
  numbers.every(x => x > 0)
); // true
console.log("sort:", new Uint8Array([3, 1, 2]).sort()); // [1, 2, 3]

// Methods NOT available (would change size):
// - splice() - Cannot change size
// - concat() - Cannot change size
// - push(), pop(), shift(), unshift() - Cannot change size

// TypedArray-specific methods:

// set() - Copy array into TypedArray
const target = new Uint8Array(10);
target.set([10, 20, 30], 2); // Copy at offset 2
console.log("After set:", target); // [0, 0, 10, 20, 30, 0, 0, 0, 0, 0]

// subarray() - Create view of portion (shares buffer)
const sub = numbers.subarray(1, 4); // Elements 1-3
console.log("Subarray:", sub); // [2, 3, 4]
sub[0] = 99; // Modifies original!
console.log("Original after subarray modification:", numbers); // [1, 99, 3, 4, 5]

// slice() - Create copy (new buffer)
const sliced = numbers.slice(1, 4);
sliced[0] = 88; // Doesn't modify original
console.log("Original after slice modification:", numbers); // [1, 99, 3, 4, 5]

// ============================================
// Section 5: Blob and File (Browser)
// ============================================

console.log("\n=== Blob and File (Browser) ===");

// Blob - Binary Large Object
// - Immutable raw data
// - Can represent files, images, etc.

// Creating Blobs (browser environment):
// const blob = new Blob(["Hello, World!"], { type: "text/plain" });
// console.log("Blob size:", blob.size);
// console.log("Blob type:", blob.type);

// Blob from TypedArray:
// const binaryData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
// const binaryBlob = new Blob([binaryData], { type: "application/octet-stream" });

// Blob methods:
// blob.slice(start, end, contentType) - Create sub-blob
// blob.text() - Read as text (returns Promise)
// blob.arrayBuffer() - Read as ArrayBuffer (returns Promise)
// blob.stream() - Get ReadableStream

// Creating object URLs:
// const url = URL.createObjectURL(blob);
// // Use URL for downloads, images, etc.
// // <a href={url} download="file.txt">Download</a>
// // <img src={url} />
// URL.revokeObjectURL(url); // Clean up when done

// FileReader - Read file contents (browser):
// const reader = new FileReader();
// reader.onload = (e) => {
//   console.log("File content:", e.target.result);
// };
// reader.readAsText(blob);           // Read as text
// reader.readAsArrayBuffer(blob);    // Read as ArrayBuffer
// reader.readAsDataURL(blob);        // Read as data URL (base64)

// File object (extends Blob):
// - Represents files from <input type="file">
// - Has additional properties: name, lastModified
// const file = new File(["content"], "filename.txt", { type: "text/plain" });
// console.log("File name:", file.name);
// console.log("Last modified:", file.lastModified);

console.log("Blob/File APIs are browser-specific");
console.log("Use for: file uploads, downloads, image processing");

// ============================================
// Section 6: SharedArrayBuffer and Atomics
// ============================================

console.log("\n=== SharedArrayBuffer and Atomics ===");

// SharedArrayBuffer - ArrayBuffer that can be shared between threads
// - Allows multiple Web Workers to access same memory
// - Requires careful synchronization with Atomics
// - Browser support: Requires CORS headers for security

console.log("\nSharedArrayBuffer:");
console.log("- Fixed-length raw binary data buffer");
console.log("- Can be shared between workers/threads");
console.log("- Same memory, no copying needed");
console.log("- Requires proper synchronization");

// Example: Creating SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(1024); // 1024 bytes shared memory
console.log("Shared buffer byte length:", sharedBuffer.byteLength);

// Create TypedArray view on shared buffer
const sharedArray = new Int32Array(sharedBuffer);
console.log("Shared Int32Array length:", sharedArray.length);

// ⚠️ SECURITY REQUIREMENTS:
console.log("\nSecurity requirements (browser):");
console.log("- Cross-Origin-Opener-Policy: same-origin");
console.log("- Cross-Origin-Embedder-Policy: require-corp");
console.log("Note: Cross-Origin-Resource-Policy (CORP) is a different security feature");
console.log("Reason: Prevent Spectre-style attacks");

// Atomics - Thread-safe operations on SharedArrayBuffer
console.log("\nAtomics object:");
console.log("- Provides atomic (thread-safe) operations");
console.log("- Ensures no race conditions");
console.log("- Operations are indivisible (complete before other operations)");

console.log("\nAtomic operations:");
console.log("- Atomics.load(typedArray, index): Read value");
console.log("- Atomics.store(typedArray, index, value): Write value");
console.log("- Atomics.add(typedArray, index, value): Add and return old");
console.log("- Atomics.sub(typedArray, index, value): Subtract and return old");
console.log("- Atomics.and(typedArray, index, value): Bitwise AND");
console.log("- Atomics.or(typedArray, index, value): Bitwise OR");
console.log("- Atomics.xor(typedArray, index, value): Bitwise XOR");
console.log("- Atomics.exchange(typedArray, index, value): Swap and return old");
console.log(
  "- Atomics.compareExchange(typedArray, index, expected, replacement): Conditional swap"
);

// Example: Atomic operations
sharedArray[0] = 10;
console.log("\nInitial value:", sharedArray[0]);

// Atomic read
const loaded = Atomics.load(sharedArray, 0);
console.log("Atomics.load(0):", loaded);

// Atomic write
Atomics.store(sharedArray, 0, 20);
console.log("After Atomics.store(0, 20):", sharedArray[0]);

// Atomic add
const oldValue = Atomics.add(sharedArray, 0, 5);
console.log("Atomics.add(0, 5) returned old value:", oldValue);
console.log("New value:", sharedArray[0]);

// Atomic compareExchange (conditional swap)
const expected = 25;
const replacement = 100;
const result = Atomics.compareExchange(sharedArray, 0, expected, replacement);
console.log("Atomics.compareExchange(0, 25, 100):", result);
console.log("Current value:", sharedArray[0]); // 100 if was 25, else unchanged

// Wait/wake operations for synchronization
console.log("\nSynchronization operations:");
console.log("- Atomics.wait(typedArray, index, expected, timeout): Block until value changes");
console.log("- Atomics.notify(typedArray, index, count): Wake up waiting agents");

/*
 * verification:
 *   feature: Atomics.waitAsync
 *   status: ES2024
 *   stage4Date: 2023-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("- Atomics.waitAsync(typedArray, index, expected, timeout): Async wait (ES2024)");

console.log("\nUse cases:");
console.log("- Multi-threaded computation (Web Workers)");
console.log("- Shared state between workers");
console.log("- Lock-free algorithms");
console.log("- Parallel data processing");
console.log("- Real-time collaborative editing");

console.log("\n⚠️ NOTE:");
console.log("- Atomics work on all integer TypedArrays (Int8 through BigInt64)");
console.log("- Atomics.wait/notify/waitAsync are limited to Int32Array and BigInt64Array");
console.log("- Never for Float32Array or Float64Array");
console.log("- Always use Atomics with SharedArrayBuffer, not regular ArrayBuffer");

// ============================================
// Section 7: Encoding API (TextEncoder/TextDecoder)
// ============================================

console.log("\n=== Encoding API ===");

/**
 * Encoding API - Convert between text and binary data
 *
 * TextEncoder: String → Uint8Array (UTF-8 encoding)
 * TextDecoder: Uint8Array → String (various encodings)
 *
 * Use Cases:
 * - File I/O with text content
 * - Network protocols with text data
 * - WebSocket binary messages
 * - Crypto operations with text
 * - Data compression/decompression
 */

// ============================================
// 7.1 TextEncoder - String to Binary
// ============================================

console.log("\n7.1 TextEncoder - String to Binary:");

// Create TextEncoder (always UTF-8)
const encoder = new TextEncoder();

// Encode string to Uint8Array
const text = "Hello, World!";
const encoded = encoder.encode(text);

console.log("Original text:", text);
console.log("Encoded bytes:", encoded);
console.log("Byte length:", encoded.length);
console.log("Encoding:", encoder.encoding); // Always "utf-8"

// Encoding special characters
const specialText = "Hello 世界 🌍";
const specialEncoded = encoder.encode(specialText);
console.log("\nSpecial characters:", specialText);
console.log("Encoded bytes:", specialEncoded);
console.log("Byte length:", specialEncoded.length); // More than character count

// Character vs Byte length
console.log("\nCharacter vs Byte length:");
console.log("  'Hello' - 5 chars, 5 bytes");
console.log("  '世界' - 2 chars, 6 bytes (3 bytes each in UTF-8)");
console.log("  '🌍' - 1 char, 4 bytes (emoji)");

// encodeInto() - More efficient for pre-allocated buffers
const encodeBuffer = new Uint8Array(50);
const encodeResult = encoder.encodeInto("Hello", encodeBuffer);
console.log("\nencodeInto() result:");
console.log("  read:", encodeResult.read); // Characters read from source
console.log("  written:", encodeResult.written); // Bytes written to buffer
console.log("  buffer:", encodeBuffer.slice(0, encodeResult.written));

// ============================================
// 7.2 TextDecoder - Binary to String
// ============================================

console.log("\n7.2 TextDecoder - Binary to String:");

// Create TextDecoder (default UTF-8)
const decoder = new TextDecoder();

// Decode Uint8Array to string
const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
const decoded = decoder.decode(bytes);
console.log("Decoded text:", decoded);

// Decode with different encodings
const utf8Decoder = new TextDecoder("utf-8");
const utf16Decoder = new TextDecoder("utf-16");
const latin1Decoder = new TextDecoder("iso-8859-1");

console.log("\nSupported encodings:");
console.log("  - utf-8 (default)");
console.log("  - utf-16le, utf-16be");
console.log("  - iso-8859-1 (latin1)");
console.log("  - windows-1252");
console.log("  - and many more...");

// Decode special characters
const specialBytes = new Uint8Array([
  72,
  101,
  108,
  108,
  111,
  32, // "Hello "
  228,
  184,
  150,
  231,
  149,
  140,
  32, // "世界 "
  240,
  159,
  140,
  141, // "🌍"
]);
const specialDecoded = decoder.decode(specialBytes);
console.log("\nDecoded special chars:", specialDecoded);

// Streaming decode (for large data)
const streamDecoder = new TextDecoder("utf-8", { stream: true });

const chunk1 = new Uint8Array([72, 101, 108]); // "Hel"
const chunk2 = new Uint8Array([108, 111]); // "lo"

const part1 = streamDecoder.decode(chunk1, { stream: true });
const part2 = streamDecoder.decode(chunk2, { stream: false });

console.log("\nStreaming decode:");
console.log("  Chunk 1:", part1);
console.log("  Chunk 2:", part2);
console.log("  Combined:", part1 + part2);

// Error handling options
const strictDecoder = new TextDecoder("utf-8", { fatal: true });
const lenientDecoder = new TextDecoder("utf-8", { fatal: false });

const invalidBytes = new Uint8Array([0xff, 0xfe]); // Invalid UTF-8

try {
  strictDecoder.decode(invalidBytes);
} catch (error) {
  console.log("\nStrict decoder throws:", error.name);
}

const lenientResult = lenientDecoder.decode(invalidBytes);
console.log("Lenient decoder replaces with:", lenientResult); // Replacement character �

// ============================================
// 7.3 Practical Applications
// ============================================

console.log("\n7.3 Practical Applications:");

// Application 1: File reading with encoding
console.log("\n1. File Reading:");
console.log(`
async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(bytes);
  return text;
}

// Usage
const file = document.querySelector('input[type="file"]').files[0];
const content = await readTextFile(file);
`);

// Application 2: WebSocket binary messages
console.log("\n2. WebSocket Binary Messages:");
console.log(`
const ws = new WebSocket('ws://example.com');
ws.binaryType = 'arraybuffer';

// Send text as binary
ws.addEventListener('open', () => {
  const encoder = new TextEncoder();
  const message = encoder.encode('Hello Server');
  ws.send(message.buffer);
});

// Receive binary as text
ws.addEventListener('message', (event) => {
  if (event.data instanceof ArrayBuffer) {
    const decoder = new TextDecoder();
    const bytes = new Uint8Array(event.data);
    const text = decoder.decode(bytes);
    console.log('Received:', text);
  }
});
`);

// Application 3: Crypto operations with text
console.log("\n3. Crypto Operations:");
console.log(`
async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const hash = await hashText('Hello, World!');
console.log('SHA-256:', hash);
`);

// Application 4: Base64 encoding/decoding
function base64Encode(text) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

function base64Decode(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, m => m.codePointAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

console.log("\n4. Base64 Encoding:");
const original = "Hello, 世界!";
const base64 = base64Encode(original);
const restored = base64Decode(base64);
console.log("  Original:", original);
console.log("  Base64:", base64);
console.log("  Restored:", restored);

// Application 5: CSV parsing from binary
console.log("\n5. CSV Parsing from Binary:");
console.log(`
async function parseCSV(arrayBuffer) {
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(arrayBuffer);
  const lines = text.split('\\n');
  const data = lines.map(line => line.split(','));
  return data;
}

// Usage with fetch
const response = await fetch('/data.csv');
const buffer = await response.arrayBuffer();
const csvData = await parseCSV(buffer);
`);

// Application 6: Protocol buffer parsing
console.log("\n6. Protocol Buffer Parsing:");
console.log(`
function parseMessage(bytes) {
  const decoder = new TextDecoder('utf-8');
  
  // Read header (first 4 bytes)
  const headerBytes = bytes.slice(0, 4);
  const header = new DataView(headerBytes.buffer).getUint32(0);
  
  // Read body (remaining bytes)
  const bodyBytes = bytes.slice(4);
  const body = decoder.decode(bodyBytes);
  
  return { header, body };
}
`);

// ============================================
// 7.4 Character Encoding Conversion
// ============================================

console.log("\n7.4 Character Encoding Conversion:");

// Convert between encodings
function convertEncoding(bytes, fromEncoding, toEncoding) {
  // Decode from source encoding
  const decoder = new TextDecoder(fromEncoding);
  const text = decoder.decode(bytes);

  // Encode to target encoding
  const encoder = new TextEncoder(); // Always UTF-8
  const converted = encoder.encode(text);

  return converted;
}

// Example: Latin1 to UTF-8
const latin1Bytes = new Uint8Array([72, 233, 108, 108, 111]); // "Héllo" in Latin1
const utf8Bytes = convertEncoding(latin1Bytes, "iso-8859-1", "utf-8");
console.log("Latin1 bytes:", latin1Bytes);
console.log("UTF-8 bytes:", utf8Bytes);
console.log("Decoded:", new TextDecoder().decode(utf8Bytes));

// Detect encoding (heuristic)
function detectEncoding(bytes) {
  // Check for BOM (Byte Order Mark)
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return "utf-8";
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return "utf-16be";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return "utf-16le";
  }

  // Default to UTF-8
  return "utf-8";
}

console.log("\nEncoding detection:");
const utf8BOM = new Uint8Array([0xef, 0xbb, 0xbf, 72, 101, 108, 108, 111]);
console.log("  Detected:", detectEncoding(utf8BOM));

// ============================================
// 7.5 Performance Considerations
// ============================================

console.log("\n7.5 Performance Considerations:");

console.log("\nTextEncoder.encode() vs encodeInto():");
console.log("  encode():");
console.log("    - Allocates new Uint8Array");
console.log("    - Simpler API");
console.log("    - Use for small strings");
console.log("  encodeInto():");
console.log("    - Uses pre-allocated buffer");
console.log("    - More efficient for large data");
console.log("    - Requires buffer management");

console.log("\nStreaming decode:");
console.log("  - Use { stream: true } for chunked data");
console.log("  - Handles multi-byte characters across chunks");
console.log("  - Essential for large files");

console.log("\nBest practices:");
console.log("  ✅ Reuse TextEncoder/TextDecoder instances");
console.log("  ✅ Use encodeInto() for large strings");
console.log("  ✅ Use streaming decode for large files");
console.log("  ✅ Handle encoding errors gracefully");
console.log("  ✅ Validate encoding before decoding");
console.log("  ⚠️ Be aware of UTF-8 byte length vs character length");
console.log("  ⚠️ Handle BOM (Byte Order Mark) if present");

// ============================================
// 7.6 Common Use Cases Summary
// ============================================

console.log("\n7.6 Common Use Cases:");
console.log("  1. File I/O - Read/write text files as binary");
console.log("  2. WebSocket - Send/receive text as binary");
console.log("  3. Crypto - Hash/encrypt text data");
console.log("  4. Network protocols - Parse binary messages");
console.log("  5. Data compression - Compress/decompress text");
console.log("  6. CSV/JSON parsing - Parse from binary");
console.log("  7. Base64 encoding - Convert text to/from base64");
console.log("  8. Character encoding conversion - Convert between encodings\n");

// ============================================
// Section 8: Practical Applications (Updated)
// ============================================

console.log("\n=== Practical Applications ===");

// Application 1: Image processing (Canvas + TypedArray)
console.log("\n1. Image Processing:");
console.log("- Get image data from canvas");
console.log("- Manipulate pixels with Uint8ClampedArray");
console.log("- Apply filters, effects");

// Example (browser):
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// const pixels = imageData.data; // Uint8ClampedArray [R, G, B, A, R, G, B, A, ...]
//
// // Invert colors
// for (let i = 0; i < pixels.length; i += 4) {
//   pixels[i] = 255 - pixels[i];     // Red
//   pixels[i+1] = 255 - pixels[i+1]; // Green
//   pixels[i+2] = 255 - pixels[i+2]; // Blue
//   // pixels[i+3] is alpha, leave unchanged
// }
//
// ctx.putImageData(imageData, 0, 0);

// Application 2: Audio processing (Web Audio API)
console.log("\n2. Audio Processing:");
console.log("- AudioBuffer uses Float32Array");
console.log("- Process audio samples");
console.log("- Apply effects, filters");

// Example (browser):
// const audioContext = new AudioContext();
// const buffer = audioContext.createBuffer(1, 44100, 44100); // 1 second
// const channelData = buffer.getChannelData(0); // Float32Array
//
// // Generate sine wave
// for (let i = 0; i < channelData.length; i++) {
//   channelData[i] = Math.sin(2 * Math.PI * 440 * i / 44100); // 440 Hz
// }

// Application 3: WebSocket binary data
console.log("\n3. WebSocket Binary Data:");
console.log("- Send/receive binary messages");
console.log("- More efficient than JSON for large data");

// Example:
// const ws = new WebSocket('ws://example.com');
// ws.binaryType = 'arraybuffer';
//
// ws.onmessage = (event) => {
//   if (event.data instanceof ArrayBuffer) {
//     const view = new Uint8Array(event.data);
//     console.log('Received binary data:', view);
//   }
// };
//
// // Send binary data
// const data = new Uint8Array([1, 2, 3, 4]);
// ws.send(data.buffer);

// Application 4: File upload/download
console.log("\n4. File Upload/Download:");
console.log("- Read files as ArrayBuffer");
console.log("- Process before upload");
console.log("- Generate files for download");

// Example upload:
// const input = document.querySelector('input[type="file"]');
// input.addEventListener('change', async (e) => {
//   const file = e.target.files[0];
//   const buffer = await file.arrayBuffer();
//   const bytes = new Uint8Array(buffer);
//   // Process bytes...
// });

// Example download:
// const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
// const blob = new Blob([data], { type: 'application/octet-stream' });
// const url = URL.createObjectURL(blob);
// const a = document.createElement('a');
// a.href = url;
// a.download = 'data.bin';
// a.click();
// URL.revokeObjectURL(url);

// Application 5: Binary protocol parsing
console.log("\n5. Binary Protocol Parsing:");
console.log("- Parse network protocols");
console.log("- Read structured binary data");

// Example: Parse simple header
function parseHeader(buffer) {
  const view = new DataView(buffer);
  return {
    version: view.getUint8(0),
    type: view.getUint8(1),
    length: view.getUint16(2, false), // Big-endian
    timestamp: view.getUint32(4, false),
  };
}

const headerBuffer = new ArrayBuffer(8);
const headerView = new DataView(headerBuffer);
headerView.setUint8(0, 1); // version
headerView.setUint8(1, 2); // type
headerView.setUint16(2, 1024, false); // length
headerView.setUint32(4, Date.now(), false); // timestamp

console.log("Parsed header:", parseHeader(headerBuffer));

// ============================================
// 9. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: TypedArrays have fixed size
console.log("\nPitfall 1: TypedArrays have fixed size");
console.log("  No push(), pop(), splice() methods");
console.log("  Cannot dynamically grow/shrink");
console.log("  Fix: Create new TypedArray with desired size");

// Pitfall 2: subarray() shares buffer
console.log("\nPitfall 2: subarray() vs slice()");
console.log("  subarray() shares underlying buffer");
console.log("  Changes to subarray affect original");
console.log("  slice() creates new buffer copy");

// Pitfall 3: Endianness confusion
console.log("\nPitfall 3: Endianness in DataView");
console.log("  Default is big-endian (false) — most significant byte first");
console.log("  Network protocols use big-endian");
console.log("  Fix: Always specify explicitly");

// Pitfall 4: Uint8ClampedArray behavior
console.log("\nPitfall 4: Uint8ClampedArray special behavior");
console.log("  Values clamped to 0-255 (not wrapped)");
console.log("  Different from Uint8Array (wraps around)");
console.log("  Use for canvas image data only");

// Pitfall 5: TypedArray type confusion
console.log("\nPitfall 5: Wrong TypedArray type");
console.log("  Int8Array: -128 to 127");
console.log("  Uint8Array: 0 to 255");
console.log("  Overflow truncates silently");
console.log("  Fix: Choose appropriate type for data range");

// Pitfall 6: Blob URL memory leaks
console.log("\nPitfall 6: Blob URL memory leaks");
console.log("  URL.createObjectURL() creates reference");
console.log("  Must call URL.revokeObjectURL() to free");
console.log("  Fix: Revoke after use");

// ============================================
// 10. Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Choose correct TypedArray type for data range");
console.log("2. Use DataView for mixed-type binary data");
console.log("3. Use subarray() for views (no copy overhead)");
console.log("4. Use slice() when you need independent copy");
console.log("5. Specify endianness explicitly in DataView");
console.log("6. Revoke Blob URLs after use");
console.log("7. Reuse buffers instead of creating new ones");
console.log("8. Use set() for bulk copying into TypedArray");
console.log("9. Check browser support for BigInt TypedArrays");
console.log("10. Use appropriate byte offset for parsing");

console.log("\n❌ DON'T:");
console.log("1. Don't try push/pop/splice on TypedArrays");
console.log("2. Don't forget subarray shares buffer");
console.log("3. Don't ignore endianness in binary protocols");
console.log("4. Don't use Uint8ClampedArray for general data");
console.log("5. Don't forget to revoke Blob URLs");
console.log("6. Don't mix signed/unsigned TypedArrays incorrectly");
console.log("7. Don't create new buffers unnecessarily");
console.log("8. Don't use DataView when TypedArray is sufficient");
console.log("9. Don't ignore byte alignment issues");
console.log("10. Don't forget BigInt TypedArrays require ES2020");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Buffer sharing in subarray()");
console.log("2. Endianness (little vs big endian)");
console.log("3. Uint8ClampedArray clamping behavior");
console.log("4. Memory leaks from Blob URLs");
console.log("5. Type overflow/truncation");
console.log("6. DataView vs TypedArray performance");
console.log("7. BigInt TypedArray browser support");
console.log("8. Buffer alignment and offsets");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06-5-typed-arrays.js - Typed arrays basics");
console.log("📘 27-memory-management.js - Memory management");
console.log("📘 ../web-platform/43-storage-network.js - Binary data and storage");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 41-typed-arrays-ts-comparison.ts
*/
