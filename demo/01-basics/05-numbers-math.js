// Numbers 与 Math 对象 — 深入 Demo
// 📘 javascript.info: "Numbers"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

// ============================================
// TODO List for Numbers & Math
// ============================================

// Section 1: 数字表示方式
// TODO: 十进制、十六进制 (0x)、八进制 (0o)、二进制 (0b)
// TODO: 科学计数法: 1e6, 1.5e-3
// TODO: 数字分隔符 (ES2021): 1_000_000
// TODO: IEEE 754 双精度浮点数基础

// Section 2: 精度问题
// TODO: 0.1 + 0.2 !== 0.3 的原因
// TODO: toFixed() 四舍五入与精度
// TODO: 解决浮点精度的常见方案 (乘法/除法、epsilon 比较)
// TODO: Number.EPSILON 的用途

// Section 3: 数字转换与解析
// TODO: Number() vs parseInt() vs parseFloat() 的区别
// TODO: parseInt 的 radix 参数 (进制转换)
// TODO: + 一元运算符转换
// TODO: 转换边缘情况: "", null, undefined, true/false, "123abc"

// Section 4: 特殊数值
// TODO: Infinity / -Infinity
// TODO: NaN — 不等于自身的特殊值
// TODO: Number.isNaN() vs 全局 isNaN() 的区别
// TODO: Number.isFinite() vs 全局 isFinite()
// TODO: Number.isInteger()
// TODO: Number.isSafeInteger() 与 MAX_SAFE_INTEGER / MIN_SAFE_INTEGER

// Section 5: Number 方法
// TODO: toFixed(n) — 固定小数位
// TODO: toPrecision(n) — 固定有效数字
// TODO: toString(base) — 转换为指定进制字符串

// Section 6: Math 对象
// TODO: Math.round / Math.floor / Math.ceil / Math.trunc
// TODO: Math.random() 与生成范围随机数
// TODO: Math.max / Math.min (配合展开运算符)
// TODO: Math.pow / Math.sqrt / Math.abs
// TODO: Math.log / Math.log2 / Math.log10
// TODO: Math.PI / Math.E 常量
// TODO: Math.sign / Math.cbrt / Math.hypot (ES6)
// TODO: Math.clz32 / Math.fround / Math.imul (ES6 底层)

// Section 7: BigInt (ES2020)
// TODO: BigInt 创建: 123n, BigInt("123")
// TODO: BigInt 运算: +, -, *, /, %, **
// TODO: BigInt 不能与 Number 混合运算
// TODO: BigInt 比较: ==, ===, <, >
// TODO: BigInt 的限制: 不支持 Math 方法、不支持 JSON.stringify

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. NUMBER TYPE
   TS:  let x: number = 42;
   TS:  number 类型包含 NaN 和 Infinity

2. BIGINT TYPE
   TS:  let big: bigint = 123n;
   TS:  number 和 bigint 不能混合运算 (编译时检查)

3. NUMERIC LITERAL TYPES
   TS:  type Dice = 1 | 2 | 3 | 4 | 5 | 6;

📘 See related: 01-variables.js (基础数字类型)
*/
