// Property Descriptors & Configuration Demo
// 📘 javascript.info: "Property flags and descriptors", "Property getters and setters"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

// ============================================
// TODO List for Property Descriptors
// ============================================

// Section 1: 属性标志 (Property Flags)
// TODO: 三个属性标志: writable, enumerable, configurable
// TODO: Object.getOwnPropertyDescriptor() 查看属性描述符
// TODO: Object.getOwnPropertyDescriptors() 查看所有属性

// Section 2: Object.defineProperty()
// TODO: 定义新属性与修改现有属性
// TODO: writable: false — 不可写属性
// TODO: enumerable: false — 不可枚举属性 (for...in / Object.keys 中隐藏)
// TODO: configurable: false — 不可配置属性 (不可删除、不可修改标志)
// TODO: configurable: false 的不可逆性

// Section 3: Object.defineProperties()
// TODO: 批量定义多个属性
// TODO: 与 Object.getOwnPropertyDescriptors() 配合实现完整克隆

// Section 4: 对象级别的限制方法
// TODO: Object.preventExtensions() — 禁止添加新属性
// TODO: Object.seal() — 禁止添加/删除属性，所有属性 configurable: false
// TODO: Object.freeze() — 禁止添加/删除/修改属性
// TODO: Object.isExtensible() / Object.isSealed() / Object.isFrozen()
// TODO: 浅冻结 vs 深冻结的区别与实现

// Section 5: Getter 与 Setter (访问器属性)
// TODO: get / set 语法定义访问器属性
// TODO: 访问器描述符 vs 数据描述符的区别
// TODO: 用 Object.defineProperty 定义 getter/setter
// TODO: 智能 getter/setter: 验证、计算属性、兼容性
// TODO: 实际用例: 数据验证、日志记录、懒加载

// Section 6: 与其他概念的关系
// TODO: 属性描述符与 Proxy/Reflect 的配合
// TODO: 属性描述符在框架中的应用 (Vue 2 响应式原理)
// TODO: 与 07-objects.js 中 freeze/seal 的深入对比

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. READONLY MODIFIER
   JS:  Object.defineProperty(obj, 'x', { writable: false })
   TS:  readonly x: number (编译时检查)

2. PROPERTY DESCRIPTORS TYPING
   TS:  PropertyDescriptor 接口类型
   TS:  ThisType<T> 用于描述符中的 this

3. CONST ASSERTIONS
   TS:  as const 实现深层只读 (类似深冻结的类型版本)

📘 See related: 07-objects.js for basic getter/setter examples
*/
