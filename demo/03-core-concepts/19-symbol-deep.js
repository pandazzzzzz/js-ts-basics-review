// Symbol 深入 Demo
// 📘 javascript.info: "Symbol type", "Symbol.iterator", "Symbol.toPrimitive"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

// ============================================
// TODO List for Symbol Deep Dive
// ============================================

// Section 1: Symbol 基础回顾
// TODO: Symbol() 创建与描述 (description)
// TODO: Symbol 的唯一性: Symbol('a') !== Symbol('a')
// TODO: Symbol 作为对象属性键
// TODO: Symbol 属性不参与 for...in / Object.keys()
// TODO: Object.getOwnPropertySymbols() 获取 Symbol 属性

// Section 2: 全局 Symbol 注册表
// TODO: Symbol.for(key) — 全局共享 Symbol
// TODO: Symbol.keyFor(sym) — 反查全局 Symbol 的 key
// TODO: 全局 Symbol vs 普通 Symbol 的区别与用例

// Section 3: 内置 Well-Known Symbols
// TODO: Symbol.iterator — 定义迭代行为 (与 16-iterators-generators.js 关联)
// TODO: Symbol.toPrimitive — 自定义类型转换
// TODO: Symbol.toStringTag — 自定义 Object.prototype.toString 输出
// TODO: Symbol.hasInstance — 自定义 instanceof 行为
// TODO: Symbol.species — 派生对象的构造函数
// TODO: Symbol.isConcatSpreadable — 控制 Array.concat 行为

// Section 4: Symbol 实际应用
// TODO: 用 Symbol 实现"私有"属性 (对比 # 私有字段)
// TODO: 用 Symbol 避免属性名冲突 (库/框架场景)
// TODO: 用 Symbol 实现协议/接口模式
// TODO: 元编程: 通过 Symbol 自定义对象行为

// Section 5: Symbol 与其他特性的关系
// TODO: Symbol.iterator 与 for...of 循环
// TODO: Symbol.asyncIterator 与 for await...of
// TODO: Symbol 在 JSON.stringify 中被忽略
// TODO: Symbol 与 Proxy/Reflect 的交互

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. UNIQUE SYMBOL TYPE
   TS:  const sym: unique symbol = Symbol('id')
   TS:  unique symbol 只能用 const 声明

2. SYMBOL AS INDEX TYPE
   TS:  { [key: symbol]: string } — Symbol 索引签名

3. WELL-KNOWN SYMBOLS TYPING
   TS:  内置 Symbol 有完整的类型定义
   TS:  [Symbol.iterator](): Iterator<T>

📘 See related: 01-variables.js (Symbol 基础), 16-iterators-generators.js (Symbol.iterator)
*/
