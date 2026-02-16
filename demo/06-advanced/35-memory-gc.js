// 垃圾回收与内存管理 Demo
// 📘 javascript.info: "Garbage collection"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management

// ============================================
// TODO List for Memory & Garbage Collection
// ============================================

// Section 1: 内存生命周期
// TODO: 分配 → 使用 → 释放 三个阶段
// TODO: JavaScript 自动内存管理 vs 手动管理 (C/C++)
// TODO: 栈内存 (原始类型) vs 堆内存 (对象/引用类型)

// Section 2: 垃圾回收算法
// TODO: 可达性 (Reachability) — GC 的核心概念
// TODO: 根 (Roots): 全局变量、当前调用栈中的变量
// TODO: 标记-清除 (Mark-and-Sweep) 算法
// TODO: 引用计数 (Reference Counting) 及其循环引用问题
// TODO: 分代回收 (Generational GC) 概念

// Section 3: 常见内存泄漏模式
// TODO: 意外的全局变量 (忘记 let/const)
// TODO: 被遗忘的定时器 (setInterval 未清除)
// TODO: 闭包持有大对象引用
// TODO: DOM 引用未释放 (浏览器环境)
// TODO: 事件监听器未移除
// TODO: 大数组/对象未置 null

// Section 4: 内存泄漏检测
// TODO: Chrome DevTools Memory 面板
// TODO: Heap Snapshot 堆快照
// TODO: Allocation Timeline 分配时间线
// TODO: Node.js: process.memoryUsage()
// TODO: Node.js: --inspect 配合 Chrome DevTools

// Section 5: 内存优化技巧
// TODO: 及时解除引用 (obj = null)
// TODO: 使用 WeakMap/WeakSet 避免阻止 GC (与 08-map-set.js 关联)
// TODO: 使用 WeakRef 弱引用 (与 31-weakref-finalization.js 关联)
// TODO: 对象池 (Object Pool) 模式
// TODO: 避免在热路径中创建临时对象
// TODO: 字符串驻留 (String Interning) 概念

// Section 6: 与其他概念的关系
// TODO: 闭包与内存 (与 11-scope-closures.js 关联)
// TODO: WeakMap/WeakSet 的 GC 行为 (与 08-map-set.js 关联)
// TODO: WeakRef/FinalizationRegistry (与 31-weakref-finalization.js 关联)
// TODO: 事件监听器清理 (与 28-events.js 关联)

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. NO RUNTIME DIFFERENCE
   TS 不改变 JavaScript 的内存管理行为
   类型信息在编译后被擦除，不影响运行时内存

2. DISPOSABLE PATTERN (TS 5.2+)
   TS:  using / await using 声明
   TS:  Disposable / AsyncDisposable 接口
   TS:  自动资源清理，减少内存泄漏风险

📘 See related: 11-scope-closures.js (闭包内存), 31-weakref-finalization.js (弱引用)
*/
