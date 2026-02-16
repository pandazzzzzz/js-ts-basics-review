// 调试与测试基础 Demo
// 📘 javascript.info Part 1 > "Code quality" (6 个章节)
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools

// ============================================
// TODO List for Debugging & Testing
// ============================================

// Section 1: Console 方法大全
// TODO: console.log / warn / error / info
// TODO: console.table() — 表格化输出对象/数组
// TODO: console.dir() — 查看对象结构
// TODO: console.time() / console.timeEnd() — 性能计时
// TODO: console.count() / console.countReset() — 调用计数
// TODO: console.group() / console.groupEnd() — 分组输出
// TODO: console.trace() — 调用栈追踪
// TODO: console.assert() — 条件断言

// Section 2: 调试技巧
// TODO: debugger 语句
// TODO: 浏览器 DevTools 断点类型: 行断点、条件断点、DOM 断点
// TODO: 调用栈 (Call Stack) 阅读
// TODO: Watch 表达式与 Scope 面板
// TODO: 网络面板基础: 请求/响应查看

// Section 3: 错误追踪与处理
// TODO: Error 对象: message, name, stack
// TODO: window.onerror / window.onunhandledrejection (浏览器)
// TODO: process.on('uncaughtException') / process.on('unhandledRejection') (Node.js)
// TODO: Source Maps 概念

// Section 4: 测试基础概念
// TODO: 为什么需要自动化测试
// TODO: 测试类型: 单元测试、集成测试、端到端测试
// TODO: 测试框架简介: Jest, Vitest, Mocha
// TODO: 断言 (Assertions): expect().toBe(), toEqual(), toThrow()
// TODO: 简单的手写测试函数示例

// Section 5: 代码质量工具
// TODO: ESLint — 代码规范检查
// TODO: Prettier — 代码格式化
// TODO: 编码风格指南: Airbnb, Standard, Google
// TODO: JSDoc 注释规范

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE-LEVEL DEBUGGING
   TS:  编译时类型错误 vs 运行时错误
   TS:  类型错误在编辑器中即时反馈

2. TESTING WITH TYPES
   TS:  类型测试: expectTypeOf (vitest)
   TS:  @ts-expect-error 注释测试类型错误

3. SOURCE MAPS
   TS:  tsconfig.json 中 sourceMap: true
*/
