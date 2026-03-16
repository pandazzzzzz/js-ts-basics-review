// TypedArray and Binary Data Demo
// 📘 javascript.info Part 3 > "Binary data, files" > "ArrayBuffer, binary arrays"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays

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
console.log("Int8 length:", int8View.length);   // 8 elements (8 bytes / 1 byte each)
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
console.log("buffer:", uint8.buffer);           // Underlying ArrayBuffer
console.log("byteLength:", uint8.byteLength);   // 4 bytes
console.log("byteOffset:", uint8.byteOffset);   // 0 (start position in buffer)
console.log("length:", uint8.length);           // 4 elements
console.log("BYTES_PER_ELEMENT:", Uint8Array.BYTES_PER_ELEMENT); // 1

// Uint8ClampedArray - Special clamping behavior
const clamped = new Uint8ClampedArray(4);
clamped[0] = 300;  // Clamped to 255
clamped[1] = -10;  // Clamped to 0
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
dataView.setInt8(0, 127);           // 1 byte at offset 0
dataView.setInt16(1, 32767);        // 2 bytes at offset 1
dataView.setFloat32(3, 3.14);       // 4 bytes at offset 3

// Reading back
console.log("Int8 at 0:", dataView.getInt8(0));       // 127
console.log("Int16 at 1:", dataView.getInt16(1));     // 32767
console.log("Float32 at 3:", dataView.getFloat32(3)); // 3.14...

// Endianness - Byte order
// Big-endian: Most significant byte first (network byte order)
// Little-endian: Least significant byte first (most CPUs)

const endianBuffer = new ArrayBuffer(4);
const endianView = new DataView(endianBuffer);

endianView.setUint32(0, 0x12345678, false); // Big-endian
console.log("Big-endian bytes:", new Uint8Array(endianBuffer)); // [0x12, 0x34, 0x56, 0x78]

endianView.setUint32(0, 0x12345678, true);  // Little-endian
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
console.log("map:", numbers.map(x => x * 2));        // [2, 4, 6, 8, 10]
console.log("filter:", numbers.filter(x => x > 2));  // [3, 4, 5]
console.log("find:", numbers.find(x => x > 3));      // 4
console.log("reduce:", numbers.reduce((a, b) => a + b, 0)); // 15
numbers.forEach(x => console.log("forEach:", x));
console.log("some:", numbers.some(x => x > 4));      // true
console.log("every:", numbers.every(x => x > 0));    // true
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
// Section 6: Practical Applications
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
    timestamp: view.getUint32(4, false)
  };
}

const headerBuffer = new ArrayBuffer(8);
const headerView = new DataView(headerBuffer);
headerView.setUint8(0, 1);           // version
headerView.setUint8(1, 2);           // type
headerView.setUint16(2, 1024, false); // length
headerView.setUint32(4, Date.now(), false); // timestamp

console.log("Parsed header:", parseHeader(headerBuffer));

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPED ARRAY TYPES
   JS:  Runtime type checking only
   TS:  Full type definitions for all TypedArray types
   TS:  Uint8Array, Float32Array, etc. are distinct types
   TS:  Type inference works with TypedArray methods

2. ARRAYBUFFER TYPES
   TS:  ArrayBuffer, SharedArrayBuffer types
   TS:  ArrayBufferLike = ArrayBuffer | SharedArrayBuffer
   TS:  ArrayBufferView = TypedArray | DataView

3. BUFFER SOURCE TYPES
   TS:  BufferSource = ArrayBufferView | ArrayBuffer
   TS:  Used in Web APIs (crypto, fetch, etc.)
   TS:  Type-safe buffer operations

4. BLOB/FILE TYPES
   TS:  Blob, File interfaces fully typed
   TS:  BlobPart = BufferSource | Blob | string
   TS:  FileReader event types

5. DATAVIEW METHODS
   TS:  Type-safe get/set methods
   TS:  Endianness parameter typed as boolean
   TS:  Return types match the method name

⚠️ COMMON PITFALLS:
- TypedArrays have fixed size (no push/pop/splice)
- subarray() shares buffer, slice() copies
- Uint8ClampedArray clamps values (0-255)
- DataView is slower but more flexible
- Remember to revoke object URLs to prevent memory leaks
- Check browser support for BigInt TypedArrays
- Be careful with endianness in binary protocols

🔧 PERFORMANCE TIPS:
- Use TypedArrays for numeric data (faster than regular arrays)
- Prefer subarray() over slice() when possible (no copy)
- Use set() for bulk copying
- DataView is slower, use TypedArray when possible
- Reuse buffers instead of creating new ones
- Use appropriate type (Uint8 vs Uint32) for your data

📘 See related:
- 05-arrays.js (Array methods)
- 39-storage-network.js (WebSocket binary data)
- 35-memory-gc.js (Memory management)
*/
