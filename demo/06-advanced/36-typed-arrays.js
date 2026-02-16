// TypedArray 与二进制数据 Demo
// 📘 javascript.info Part 3 > "Binary data, files" > "ArrayBuffer, binary arrays"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays

// ============================================
// TODO List for Typed Arrays & Binary Data
// ============================================

// Section 1: ArrayBuffer
// TODO: new ArrayBuffer(byteLength) — 分配固定大小的内存
// TODO: ArrayBuffer 不能直接读写，需要通过视图 (View)
// TODO: arrayBuffer.byteLength — 字节长度
// TODO: arrayBuffer.slice() — 复制部分内容

// Section 2: TypedArray 视图
// TODO: Int8Array, Uint8Array, Uint8ClampedArray
// TODO: Int16Array, Uint16Array
// TODO: Int32Array, Uint32Array
// TODO: Float32Array, Float64Array
// TODO: BigInt64Array, BigUint64Array (ES2020)
// TODO: 创建方式: new Uint8Array(buffer), new Uint8Array(length), new Uint8Array(array)

// Section 3: DataView
// TODO: new DataView(buffer) — 灵活的多类型读写
// TODO: getInt8(), getUint16(), getFloat32() 等方法
// TODO: 字节序 (Endianness): 大端 vs 小端
// TODO: DataView vs TypedArray 的选择

// Section 4: TypedArray 方法
// TODO: 与普通数组共享的方法: map, filter, find, reduce, forEach, sort
// TODO: 缺少的方法: splice, concat (无法改变大小)
// TODO: TypedArray 特有: set(), subarray()

// Section 5: Blob 与 File (浏览器)
// TODO: new Blob(parts, options) — 二进制大对象
// TODO: Blob.slice() — 分片
// TODO: URL.createObjectURL(blob) — 创建临时 URL
// TODO: FileReader — 读取文件内容
// TODO: File 对象 (继承自 Blob)

// Section 6: 实际应用
// TODO: 图片处理 (Canvas + TypedArray)
// TODO: 音频处理 (Web Audio API)
// TODO: WebSocket 二进制数据传输
// TODO: 文件上传与下载

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPED ARRAY TYPES
   TS:  Uint8Array, Float32Array 等有完整类型定义
   TS:  ArrayBufferLike, ArrayBufferView 类型

2. BUFFER SOURCE TYPES
   TS:  BufferSource = ArrayBufferView | ArrayBuffer
   TS:  BlobPart = BufferSource | Blob | string
*/
