// ES2022+ 新特性汇总 Demo
// 📘 javascript.info 散布章节 + MDN "New in JavaScript"
// 📘 https://github.com/tc39/proposals/blob/main/finished-proposals.md
// 📌 覆盖 ES2022 ~ ES2025 的重要新特性

// ============================================
// TODO List for ES2022+ Features
// ============================================

// === ES2022 ===

// Section 1: 类的增强 (已在 23-classes.js 详细覆盖)
// TODO: 简要回顾: #私有字段、static 属性、static 初始化块

// Section 2: Error.cause
// TODO: new Error('msg', { cause: originalError })
// TODO: 错误链追踪的实际用例
// TODO: 与 12-error-handling.js 的关联

// Section 3: Top-level await
// TODO: 模块顶层直接使用 await
// TODO: 使用场景: 动态导入、配置加载
// TODO: 注意: 仅在 ES Modules 中可用

// Section 4: .at() 方法
// TODO: Array.prototype.at() — 支持负索引
// TODO: String.prototype.at()
// TODO: TypedArray.prototype.at()
// TODO: 与 [] 访问的对比

// Section 5: Object.hasOwn()
// TODO: Object.hasOwn(obj, prop) 替代 obj.hasOwnProperty(prop)
// TODO: 更安全: 不受原型链覆盖影响

// Section 6: RegExp /d 标志 (indices)
// TODO: 匹配结果包含 indices 属性
// TODO: 获取捕获组的起止位置

// === ES2023 ===

// Section 7: 不可变数组方法 (已在 05-arrays.js 覆盖)
// TODO: 简要回顾: toSorted(), toReversed(), toSpliced(), with()
// TODO: findLast(), findLastIndex()

// Section 8: Hashbang (#!) 语法
// TODO: #!/usr/bin/env node — 脚本文件首行
// TODO: 使 JS 文件可直接在命令行执行

// === ES2024 ===

// Section 9: Object.groupBy / Map.groupBy
// TODO: Object.groupBy(items, callback) — 按条件分组
// TODO: Map.groupBy(items, callback) — 返回 Map
// TODO: 替代手动 reduce 分组的简洁方案

// Section 10: Promise.withResolvers()
// TODO: const { promise, resolve, reject } = Promise.withResolvers()
// TODO: 替代 new Promise((resolve, reject) => ...) 的场景
// TODO: 在外部控制 Promise 的 resolve/reject

// Section 11: 正则表达式 /v 标志 (unicodeSets)
// TODO: 替代 /u 标志的增强版
// TODO: 集合操作: 交集 (&&)、差集 (--)
// TODO: 字符串属性: \p{...}

// === ES2025 (Stage 4 / 即将发布) ===

// Section 12: Set 方法
// TODO: set.union(other) — 并集
// TODO: set.intersection(other) — 交集
// TODO: set.difference(other) — 差集
// TODO: set.symmetricDifference(other) — 对称差集
// TODO: set.isSubsetOf(other) / set.isSupersetOf(other)
// TODO: set.isDisjointFrom(other)

// Section 13: Iterator Helpers
// TODO: iterator.map(), .filter(), .take(), .drop(), .forEach()
// TODO: iterator.reduce(), .toArray(), .flatMap()
// TODO: 惰性求值的优势

// Section 14: 资源管理 (using / await using)
// TODO: using 声明 — 自动调用 Symbol.dispose
// TODO: await using — 异步资源清理 (Symbol.asyncDispose)
// TODO: DisposableStack / AsyncDisposableStack
// TODO: 实际用例: 文件句柄、数据库连接、锁

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. USING DECLARATIONS
   TS 5.2+: 已支持 using / await using
   TS:  需要 Disposable / AsyncDisposable 接口

2. SATISFIES OPERATOR (TS 4.9)
   TS:  const config = { ... } satisfies Config
   TS:  保留字面量类型的同时进行类型检查

3. CONST TYPE PARAMETERS (TS 5.0)
   TS:  function foo<const T>(arg: T) {}

📘 See related: 05-arrays.js (ES2023 数组方法), 23-classes.js (ES2022 类特性)
*/
