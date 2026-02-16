// 解构赋值 — 完整专题 Demo
// 📘 javascript.info: "Destructuring assignment"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// 📌 ES6 (ES2015)

// ============================================
// TODO List for Destructuring Assignment
// ============================================

// Section 1: 数组解构
// TODO: 基本语法: const [a, b] = [1, 2]
// TODO: 跳过元素: const [, , third] = arr
// TODO: 剩余元素: const [first, ...rest] = arr
// TODO: 默认值: const [a = 1, b = 2] = arr
// TODO: 交换变量: [a, b] = [b, a]
// TODO: 嵌套解构: const [[a, b], [c, d]] = nested
// TODO: 与任何可迭代对象配合 (String, Set, Map)

// Section 2: 对象解构
// TODO: 基本语法: const { name, age } = obj
// TODO: 重命名: const { name: userName } = obj
// TODO: 默认值: const { name = "Guest" } = obj
// TODO: 重命名 + 默认值: const { name: userName = "Guest" } = obj
// TODO: 剩余属性: const { a, ...rest } = obj (ES2018)
// TODO: 嵌套解构: const { address: { city } } = obj
// TODO: 计算属性名解构: const { [key]: value } = obj

// Section 3: 函数参数解构
// TODO: 对象参数解构: function({ name, age }) {}
// TODO: 带默认值的参数解构: function({ name = "Guest" } = {}) {}
// TODO: 数组参数解构: function([first, second]) {}
// TODO: 复杂参数解构: 嵌套 + 默认值 + 重命名

// Section 4: 高级用法
// TODO: 解构赋值给已声明的变量 (需要括号): ({ a, b } = obj)
// TODO: for...of 循环中的解构
// TODO: Map.entries() 解构: for (const [key, value] of map)
// TODO: import 解构: import { useState, useEffect } from 'react'
// TODO: 解构与 JSON 数据处理

// Section 5: 常见陷阱与最佳实践
// TODO: 解构 null/undefined 会报错
// TODO: 深层嵌套解构的可读性问题
// TODO: 解构与默认参数的交互
// TODO: 何时使用解构 vs 直接访问

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE ANNOTATIONS WITH DESTRUCTURING
   TS:  const { name, age }: { name: string; age: number } = obj
   TS:  注意: 冒号在解构中是重命名，不是类型标注

2. FUNCTION PARAMETER DESTRUCTURING TYPING
   TS:  function greet({ name, age }: { name: string; age: number }) {}
   TS:  通常用 interface/type 简化

3. REST ELEMENTS TYPING
   TS:  const [first, ...rest]: [string, ...number[]] = tuple

📘 See related: 05-arrays.js (数组解构), 07-objects.js (对象解构), 14-modern-features.js (ES6 特性)
*/
