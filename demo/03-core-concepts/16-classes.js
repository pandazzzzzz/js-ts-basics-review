// Classes (ES6+) — 完整专题 Demo
// 📘 javascript.info Part 1 > Classes (6 个章节)
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

// ============================================
// TODO List for Classes
// ============================================

// Section 1: Class 基本语法
// TODO: class 声明 vs class 表达式
// TODO: constructor 构造函数
// TODO: 实例方法与属性
// TODO: class 的本质：语法糖 vs 构造函数的区别
// TODO: typeof class、class 与 function 的关系

// Section 2: Class 继承 (extends & super)
// TODO: extends 关键字实现继承
// TODO: super() 调用父类构造函数
// TODO: super.method() 调用父类方法
// TODO: 方法重写 (method overriding)
// TODO: 继承链与 instanceof

// Section 3: 静态属性与方法 (static)
// TODO: static 方法定义与调用
// TODO: static 属性 (ES2022)
// TODO: 静态方法继承
// TODO: 工厂模式与静态方法的实际用例

// Section 4: 私有与受保护的属性 (Private & Protected)
// TODO: # 私有字段 (ES2022) — 属性和方法
// TODO: 约定俗成的 _ 前缀 "受保护" 属性
// TODO: 私有 getter/setter
// TODO: 私有静态字段与方法
// TODO: 与 WeakMap 实现私有属性的对比

// Section 5: instanceof 与类型检查
// TODO: instanceof 运算符
// TODO: Symbol.hasInstance 自定义 instanceof 行为
// TODO: Object.prototype.toString 进行类型检查

// Section 6: Mixin 模式
// TODO: JavaScript 不支持多继承的原因
// TODO: Mixin 的实现方式 (Object.assign)
// TODO: 事件 Mixin 实际案例
// TODO: Mixin 的优缺点

// Section 7: 与 13-prototypes-inheritance.js 的关系
// TODO: class 语法 vs 原型链的对应关系
// TODO: 何时用 class、何时用原型
// TODO: 从 prototype 迁移到 class 的模式

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. ACCESS MODIFIERS
   JS:  # 私有字段 (运行时强制)
   TS:  public / private / protected (编译时检查)

2. ABSTRACT CLASSES
   JS:  无原生支持，需手动抛错
   TS:  abstract class / abstract method

3. INTERFACES & IMPLEMENTS
   JS:  无 interface 概念
   TS:  interface + implements 实现契约

4. PARAMETER PROPERTIES
   JS:  constructor(name) { this.name = name; }
   TS:  constructor(public name: string) {} // 简写

5. DECORATORS (Stage 3 / TS 5.0+)
   JS:  提案阶段
   TS:  @decorator 语法已可用

📘 See 23-classes-ts-comparison.ts for detailed examples!
*/
