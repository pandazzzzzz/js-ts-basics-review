// this 关键字 — 完整专题 Demo
// 📘 javascript.info: "Object methods, this", "Function binding"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

// ============================================
// TODO List for this Keyword
// ============================================

// Section 1: this 的基本规则
// TODO: 全局上下文中的 this (浏览器: window, Node: global/undefined)
// TODO: 对象方法中的 this — 指向调用者
// TODO: this 不是绑定的，而是在调用时确定的
// TODO: 方法简写 vs 函数属性中的 this

// Section 2: this 丢失问题
// TODO: 将方法赋值给变量后 this 丢失
// TODO: setTimeout/setInterval 中的 this 丢失
// TODO: 回调函数中的 this 丢失
// TODO: 事件处理器中的 this

// Section 3: 显式绑定 — call / apply / bind
// TODO: func.call(context, arg1, arg2) — 立即调用并指定 this
// TODO: func.apply(context, [args]) — 同 call，参数为数组
// TODO: func.bind(context) — 返回绑定 this 的新函数
// TODO: bind 的偏函数应用 (Partial Application)
// TODO: call/apply/bind 的区别与选择

// Section 4: 箭头函数的 this
// TODO: 箭头函数没有自己的 this，继承外层作用域
// TODO: 箭头函数 vs 普通函数的 this 对比
// TODO: 箭头函数在回调中的优势
// TODO: 箭头函数不能用作构造函数

// Section 5: 构造函数中的 this
// TODO: new 关键字与 this 的关系
// TODO: 构造函数的 this 指向新创建的对象
// TODO: 显式 return 对 this 的影响

// Section 6: class 中的 this
// TODO: class 方法中的 this
// TODO: class 中 this 丢失的常见场景
// TODO: 解决方案: bind in constructor / 箭头函数属性 / 装饰器
// TODO: 与 23-classes.js 的关联

// Section 7: 常见面试题与陷阱
// TODO: 嵌套函数中的 this
// TODO: 链式调用与 this (return this)
// TODO: globalThis (ES2020) — 跨环境统一全局对象

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. THIS PARAMETER TYPE
   TS:  function greet(this: User, greeting: string) {}
   TS:  编译时检查 this 的类型

2. NOIMPLICITTHIS
   TS:  tsconfig noImplicitThis: true 强制 this 类型标注

3. THISTYPE<T>
   TS:  ThisType<T> 工具类型用于对象字面量

📘 See related: 06-functions.js (call/apply/bind), 23-classes.js (class 中的 this)
*/
