// WeakRef 与 FinalizationRegistry Demo
// 📘 javascript.info: "WeakRef and FinalizationRegistry"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef
// 📌 ES2021 (ES12)

// ============================================
// TODO List for WeakRef & FinalizationRegistry
// ============================================

// Section 1: 垃圾回收基础回顾
// TODO: JavaScript 垃圾回收机制简介 (可达性)
// TODO: 强引用 vs 弱引用的概念
// TODO: WeakMap/WeakSet 中的弱引用回顾 (与 08-map-set.js 关联)

// Section 2: WeakRef
// TODO: new WeakRef(target) 创建弱引用
// TODO: weakRef.deref() 获取目标对象 (可能返回 undefined)
// TODO: WeakRef 不阻止垃圾回收
// TODO: 使用场景: 缓存、大对象引用

// Section 3: FinalizationRegistry
// TODO: new FinalizationRegistry(callback) 创建注册表
// TODO: registry.register(target, heldValue) 注册对象
// TODO: registry.unregister(unregisterToken) 取消注册
// TODO: 清理回调的执行时机 (不确定性)

// Section 4: 实际应用
// TODO: 实现弱引用缓存 (WeakRef + FinalizationRegistry)
// TODO: 资源清理: 文件句柄、网络连接
// TODO: 内存泄漏检测辅助

// Section 5: 注意事项与最佳实践
// TODO: 不要依赖 FinalizationRegistry 的回调时机
// TODO: 不要用于关键业务逻辑
// TODO: 浏览器兼容性与 Node.js 支持
// TODO: 与 WeakMap/WeakSet 的选择指南

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. WEAKREF TYPING
   TS:  WeakRef<T> 泛型
   TS:  deref() 返回 T | undefined

2. FINALIZATIONREGISTRY TYPING
   TS:  FinalizationRegistry<T> 泛型指定 heldValue 类型
*/
