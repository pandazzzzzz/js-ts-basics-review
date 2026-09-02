# Code Examples Quick Reference

按使用场景索引常用代码示例，方便快速查找。

## 📦 数组操作

| 场景 | 文件 | 说明 |
|------|------|------|
| 数组创建/类型判断 | `demo/02-data-structures/06-1-arrays-basics.js` | Array.of, Array.from, Array.isArray |
| 遍历/映射/过滤 | `demo/02-data-structures/06-2-arrays-iteration.js` | forEach, map, filter, reduce, flat, flatMap |
| 查找/排序 | `demo/02-data-structures/06-3-arrays-search-sort.js` | find, findIndex, includes, some, every, sort |
| 增删改/拷贝 | `demo/02-data-structures/06-4-arrays-manipulation.js` | push, pop, splice, slice, concat, spread |
| 不可变数组方法 | `demo/06-advanced/es-features/39-3-es2023-features.js` | toSorted, toSpliced, toReversed, with |
| 类型数组 | `demo/02-data-structures/06-5-typed-arrays.js` | TypedArray, ArrayBuffer, DataView |
| 深拷贝数组 | `demo/02-data-structures/06-4-arrays-manipulation.js` | 深拷贝 vs 浅拷贝 |

## 🔧 函数式编程

| 场景 | 文件 | 说明 |
|------|------|------|
| 函数柯里化 | `demo/03-core-concepts/24-1-function-composition.js` | Currying, Partial Application |
| 函数组合 | `demo/03-core-concepts/24-1-function-composition.js` | Compose, Pipe |
| 防抖节流 | `demo/03-core-concepts/24-2-debounce-throttle.js` | Debounce, Throttle 实现 |
| 记忆化缓存 | `demo/03-core-concepts/24-3-memoization-cache.js` | Memoization, LRU Cache |
| 高阶函数 | `demo/02-data-structures/07-2-functions-advanced.js` | Higher-Order Functions |

## 📅 异步编程

| 场景 | 文件 | 说明 |
|------|------|------|
| Promise 基础 | `demo/04-asynchronous/30-promises.js` | Promise 创建、链式调用、错误处理 |
| Promise 组合 | `demo/04-asynchronous/30-promises.js` | all, race, allSettled, any |
| async/await | `demo/04-asynchronous/31-async-await.js` | async 函数、await、串行/并行 |
| 异步错误处理 | `demo/04-asynchronous/34-async-error-handling.js` | 错误模式、unhandledrejection |
| Fetch 基础 | `demo/04-asynchronous/33-1-fetch-basics.js` | GET/POST, Response, FormData |
| Fetch 错误处理 | `demo/04-asynchronous/33-2-fetch-error-handling.js` | HTTP 错误、网络错误、超时 |
| Fetch 高级模式 | `demo/04-asynchronous/33-3-fetch-practical-patterns.js` | API Client, Retry, AbortController |
| 事件循环 | `demo/04-asynchronous/29-event-loop-callbacks.js` | Call Stack, Task Queue, Microtask |

## 🎭 面向对象

| 场景 | 文件 | 说明 |
|------|------|------|
| 原型链/继承 | `demo/03-core-concepts/15-prototypes-inheritance.js` | 原型、原型链、继承模式 |
| Class 语法 | `demo/03-core-concepts/16-classes.js` | class, extends, super, static |
| this 关键字 | `demo/03-core-concepts/14-this-keyword.js` | this 绑定规则、call/apply/bind |
| 属性描述符 | `demo/03-core-concepts/17-property-descriptors.js` | defineProperty, getter/setter |
| 设计模式 | `demo/06-advanced/architecture/44-design-patterns.js` | Singleton, Factory, Observer, Strategy |

## 🛡️ 类型与错误

| 场景 | 文件 | 说明 |
|------|------|------|
| 相等性比较 | `demo/01-basics/02-operators.js` | ==, ===, Object.is(), SameValueZero |
| 类型判断 | `demo/01-basics/01-variables.js` | typeof, instanceof, 类型转换 |
| 错误处理 | `demo/03-core-concepts/20-error-handling.js` | try/catch, Error, 自定义错误 |
| 可选链/空值合并 | `demo/03-core-concepts/18-es6-plus-syntax.js` | ?., ??=, 短路求值 |
| TypeScript 类型 | `demo/06-advanced/metaprogramming/47-metaprogramming-ts-comparison.ts` | 泛型、条件类型、映射类型 |

## 🖥️ 浏览器 DOM

| 场景 | 文件 | 说明 |
|------|------|------|
| DOM 查询 | `demo/05-browser-dom/35-dom-basics.js` | querySelector, getElementById |
| DOM 操作 | `demo/05-browser-dom/36-dom-manipulation.js` | 创建、修改、删除元素 |
| 事件处理 | `demo/05-browser-dom/37-events.js` | 事件冒泡/捕获、委托、常用事件类型 |
| 表单验证 | `demo/05-browser-dom/38-forms-validation.js` | 约束验证、自定义验证 |
| 存储方案 | `demo/06-advanced/web-platform/43-storage-network.js` | localStorage, IndexedDB, Cookie |
| Web API | `demo/06-advanced/web-platform/45-web-apis.js` | Service Worker, WebSocket, 各种 API |
| 动画 | `demo/06-advanced/web-platform/45-web-apis.js` | CSS 动画, Web Animations API, rAF |

## 🔄 迭代器与生成器

| 场景 | 文件 | 说明 |
|------|------|------|
| 迭代器协议 | `demo/03-core-concepts/22-iterators-generators.js` | Iterable, Iterator 接口 |
| 生成器函数 | `demo/03-core-concepts/22-iterators-generators.js` | function*, yield, yield* |
| Iterator helpers | `demo/06-advanced/es-features/39-5-es2025-features.js` | map, filter, take, drop, toArray |

## 🎨 元编程

| 场景 | 文件 | 说明 |
|------|------|------|
| Proxy | `demo/03-core-concepts/23-proxy-reflect.js` | 代理、拦截器、陷阱 |
| Reflect API | `demo/03-core-concepts/23-proxy-reflect.js` | Reflect 对象方法 |
| Symbol | `demo/03-core-concepts/19-symbol-deep.js` | 唯一标识符、Well-known Symbols |
| 装饰器 | `demo/06-advanced/metaprogramming/47-metaprogramming.js` | Stage 2.7 装饰器提案 |
| JSDoc 类型 | `demo/06-advanced/metaprogramming/47-metaprogramming.js` | JSDoc 类型注解 |

## 🚀 性能优化

| 场景 | 文件 | 说明 |
|------|------|------|
| 性能优化技巧 | `demo/06-advanced/architecture/46-performance.js` | 重绘重排、防抖节流、懒加载 |
| 内存管理 | `demo/03-core-concepts/27-memory-management.js` | GC、内存泄漏、WeakRef |
| 性能测量 | `demo/06-advanced/architecture/46-performance.js` | performance API, User Timing |
| Web Workers | `demo/06-advanced/web-platform/45-web-apis.js` | 主线程外计算 |

## 🌐 国际化

| 场景 | 文件 | 说明 |
|------|------|------|
| 数字格式化 | `demo/06-advanced/data-processing/42-intl-api.js` | Intl.NumberFormat |
| 日期时间格式化 | `demo/06-advanced/data-processing/42-intl-api.js` | Intl.DateTimeFormat, Temporal |
| 相对时间 | `demo/06-advanced/data-processing/42-intl-api.js` | Intl.RelativeTimeFormat |
| 复数规则 | `demo/06-advanced/data-processing/42-intl-api.js` | Intl.PluralRules |
| 列表格式化 | `demo/06-advanced/data-processing/42-intl-api.js` | Intl.ListFormat |

## 📝 正则表达式

| 场景 | 文件 | 说明 |
|------|------|------|
| 基础语法 | `demo/03-core-concepts/21-regex.js` | 元字符、量词、分组 |
| 常用方法 | `demo/03-core-concepts/21-regex.js` | test, exec, match, replace |
| ES2024 v flag | `demo/06-advanced/es-features/39-4-es2024-features.js` | Unicode 属性类、集合操作 |
| RegExp.escape | `demo/06-advanced/es-features/39-5-es2025-features.js` | 转义用户输入 |

---

## 🔍 按难度查找

### Beginner (入门)
`01-basics/`, `06-1-arrays-basics`, `07-1-functions-basics`, `08-objects`, `11-json`, `12-date-time`, `35-dom-basics`

### Intermediate (中级)
`02-data-structures/` 大部分文件, `03-core-concepts/` 基础概念, `04-asynchronous/`, `05-browser-dom/`, `40-debugging-testing`, `42-intl-api`, `43-storage-network`, `45-web-apis`

### Advanced (高级)
`15-prototypes-inheritance`, `17-property-descriptors`, `19-symbol-deep`, `22-iterators-generators`, `23-proxy-reflect`, `24-function-patterns-advanced`, `25-inheritance-patterns`, `26-optimization-performance`, `27-memory-management`, `34-async-error-handling`, `39-5 / 39-6 / 39-7`, `41-typed-arrays`, `44-design-patterns`, `46-performance`, `47-metaprogramming`, `48-security`
