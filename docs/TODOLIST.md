# 学习路线图

> **参考**: [JavaScript.info](https://javascript.info) · [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) · [roadmap.sh](https://roadmap.sh/javascript)
> **更新**: 2026-03-18

**进度**: 39/39 ✅ · 39 TypeScript 对比文件 ✅

---

## 📁 Stage 1: 基础语法 (01-05)

| # | 文件 | 主题 | 状态 |
|---|------|------|------|
| 01 | `demo/01-basics/01-variables.js` | 变量与数据类型 | ✅ |
| 02 | `demo/01-basics/02-operators.js` | 运算符与表达式 | ✅ |
| 03 | `demo/01-basics/03-control-flow.js` | 控制结构 | ✅ |
| 04 | `demo/01-basics/04-strings.js` | 字符串与模板字面量 | ✅ |
| 05 | `demo/01-basics/05-numbers-math.js` | 数字与 Math 对象 | ✅ |

TS 对比: `01-variables-ts-comparison.ts` · `02-operators-ts-comparison.ts` · `03-control-flow-ts-comparison.ts` · `04-strings-ts-comparison.ts` · `05-numbers-math-ts-comparison.ts`

### 知识点清单

**01 变量与数据类型** — var/let/const、原始类型、类型转换、TS 类型注解
**02 运算符** — 算术/比较/逻辑运算符、赋值运算符、三元运算符
**03 控制流** — if/else、switch、for/while/do-while、break/continue
**04 字符串** — 字符串方法、模板字面量、标签模板
**05 数字与 Math** — Number 方法、Math 对象、精度问题、BigInt

---

## 📁 Stage 2: 数据结构 (06-12)

| # | 文件 | 主题 | 状态 |
|---|------|------|------|
| 06 | `demo/02-data-structures/06-arrays.js` | 数组方法 | ✅ |
| 07 | `demo/02-data-structures/07-functions.js` | 函数 (16 节) | ✅ |
| 08 | `demo/02-data-structures/08-objects.js` | 对象与方法 | ✅ |
| 09 | `demo/02-data-structures/09-destructuring.js` | 解构赋值 | ✅ |
| 10 | `demo/02-data-structures/10-map-set.js` | Map 与 Set | ✅ |
| 11 | `demo/02-data-structures/11-json.js` | JSON 操作 | ✅ |
| 12 | `demo/02-data-structures/12-date-time.js` | 日期与时间 | ✅ |

TS 对比: `06-arrays-ts-comparison.ts` · `07-functions-ts-comparison.ts` · `08-objects-ts-comparison.ts` · `09-destructuring-ts-comparison.ts` · `10-map-set-ts-comparison.ts` · `11-json-ts-comparison.ts` · `12-date-time-ts-comparison.ts`

### 知识点清单

**06 数组** — 创建、迭代(forEach/map/filter/reduce)、查找、排序、解构与展开
**07 函数** — 声明/表达式/箭头、默认参数/剩余参数、高阶函数、闭包、IIFE、柯里化、纯函数
**08 对象** — 字面量、属性访问、方法、getter/setter、Object.keys/values/entries、冻结/密封
**09 解构赋值** — 数组解构、对象解构、嵌套解构、默认值、剩余模式、函数参数解构
**10 Map 与 Set** — Map 创建与方法、Set 创建与方法、WeakMap/WeakSet、使用场景
**11 JSON** — parse/stringify、数据类型、序列化/反序列化、错误处理、replacer/reviver
**12 日期与时间** — Date 对象、格式化与解析、时区处理、日期运算

---

## 📁 Stage 3: 核心概念 (13-23)

| # | 文件 | 主题 | 状态 |
|---|------|------|------|
| 13 | `demo/03-core-concepts/13-scope-closures.js` | 作用域与闭包 | ✅ |
| 14 | `demo/03-core-concepts/14-this-keyword.js` | this 关键字 | ✅ |
| 15 | `demo/03-core-concepts/15-prototypes-inheritance.js` | 原型与继承 | ✅ |
| 16 | `demo/03-core-concepts/16-classes.js` | 类 | ✅ |
| 17 | `demo/03-core-concepts/17-property-descriptors.js` | 属性描述符 | ✅ |
| 18 | `demo/03-core-concepts/18-modern-features.js` | ES6+ 特性 | ✅ |
| 19 | `demo/03-core-concepts/19-symbol-deep.js` | Symbol 深入 | ✅ |
| 20 | `demo/03-core-concepts/20-error-handling.js` | 错误处理 | ✅ |
| 21 | `demo/03-core-concepts/21-regex.js` | 正则表达式 | ✅ |
| 22 | `demo/03-core-concepts/22-iterators-generators.js` | 迭代器与生成器 | ✅ |
| 23 | `demo/03-core-concepts/23-proxy-reflect.js` | Proxy 与 Reflect | ✅ |

TS 对比: `13-scope-closures-ts-comparison.ts` · `14-this-keyword-ts-comparison.ts` · `15-prototypes-inheritance-ts-comparison.ts` · `16-classes-ts-comparison.ts` · `17-property-descriptors-ts-comparison.ts` · `18-modern-features-ts-comparison.ts` · `19-symbol-deep-ts-comparison.ts` · `20-error-handling-ts-comparison.ts` · `21-regex-ts-comparison.ts` · `22-iterators-generators-ts-comparison.ts` · `23-proxy-reflect-ts-comparison.ts`

### 知识点清单

**13 作用域与闭包** — 全局/局部/块级作用域、词法作用域、闭包原理与应用
**14 this 关键字** — this 绑定规则、丢失场景、call/apply/bind、箭头函数中的 this、类中的 this
**15 原型与继承** — 原型链、构造函数、Object.create()、类语法
**16 类** — class 语法、继承、Mixin、instanceof 深入、class vs prototype 对比
**17 属性描述符** — defineProperty、数据/访问器描述符、enumerable/configurable/writable
**18 ES6+ 特性** — 展开运算符、解构、默认/剩余参数、箭头函数、类与继承
**19 Symbol 深入** — Symbol 创建、内置 Symbol、Symbol.iterator、Symbol.toPrimitive
**20 错误处理** — try/catch/finally、throw、Error 类型、自定义错误
**21 正则表达式** — 模式语法、字符串方法、标志、常用模式
**22 迭代器与生成器** — 迭代器协议、生成器函数、yield、异步迭代器
**23 Proxy 与 Reflect** — Proxy 陷阱、Reflect 方法、元编程模式

---

## 📁 Stage 4: 异步编程 (24-28)

| # | 文件 | 主题 | 状态 |
|---|------|------|------|
| 24 | `demo/04-asynchronous/24-event-loop-callbacks.js` | 事件循环与回调 | ✅ |
| 25 | `demo/04-asynchronous/25-promises.js` | Promise | ✅ |
| 26 | `demo/04-asynchronous/26-async-await.js` | Async/Await | ✅ |
| 27 | `demo/04-asynchronous/27-modules.js` | ES Modules | ✅ |
| 28 | `demo/04-asynchronous/28-fetch-api.js` | Fetch API | ✅ |

TS 对比: `24-event-loop-callbacks-ts-comparison.ts` · `25-promises-ts-comparison.ts` · `26-async-await-ts-comparison.ts` · `27-modules-ts-comparison.ts` · `28-fetch-api-ts-comparison.ts`

### 知识点清单

**24 事件循环** — 事件循环机制、回调模式、回调地狱
**25 Promise** — 创建与链式调用、错误处理、Promise.all/race/allSettled/any
**26 Async/Await** — async 函数、await、try/catch 错误处理、并行 vs 串行
**27 模块** — import/export、默认导出 vs 命名导出、动态导入
**28 Fetch API** — fetch 基础、Request/Response、Headers、错误处理

---

## 📁 Stage 5: 浏览器与 DOM (29-32)

| # | 文件 | 主题 | 状态 |
|---|------|------|------|
| 29 | `demo/05-browser-dom/29-dom-basics.js` | DOM 基础 | ✅ |
| 30 | `demo/05-browser-dom/30-dom-manipulation.js` | DOM 操作 | ✅ |
| 31 | `demo/05-browser-dom/31-events.js` | 事件处理 | ✅ |
| 32 | `demo/05-browser-dom/32-forms-validation.js` | 表单与验证 | ✅ |

TS 对比: `29-dom-basics-ts-comparison.ts` · `30-dom-manipulation-ts-comparison.ts` · `31-events-ts-comparison.ts` · `32-forms-validation-ts-comparison.ts`

### 知识点清单

**29 DOM 基础** — DOM 树、节点类型、选择器(getElementById/querySelector)、遍历
**30 DOM 操作** — 创建/插入/删除节点、修改属性与样式、DocumentFragment、性能优化
**31 事件处理** — addEventListener、事件冒泡/捕获、事件委托、自定义事件
**32 表单与验证** — 表单元素、Constraint Validation API、自定义验证、表单提交

---

## 📁 Stage 6: 高级主题 (33-39)

| # | 文件 | 主题 | 状态 |
|---|------|------|------|
| 33 | `demo/06-advanced/33-es2022-plus-features.js` | ES2022+ 新特性 | ✅ |
| 34 | `demo/06-advanced/34-debugging-testing.js` | 调试与测试 | ✅ |
| 35 | `demo/06-advanced/35-memory-gc.js` | 内存与垃圾回收 | ✅ |
| 36 | `demo/06-advanced/36-typed-arrays.js` | 类型化数组 | ✅ |
| 37 | `demo/06-advanced/37-intl-api.js` | 国际化 API | ✅ |
| 38 | `demo/06-advanced/38-weakref-finalization.js` | WeakRef 与 FinalizationRegistry | ✅ |
| 39 | `demo/06-advanced/39-storage-network.js` | 存储与网络 | ✅ |

TS 对比: `33-es2022-plus-features-ts-comparison.ts` · `34-debugging-testing-ts-comparison.ts` · `35-memory-gc-ts-comparison.ts` · `36-typed-arrays-ts-comparison.ts` · `37-intl-api-ts-comparison.ts` · `38-weakref-finalization-ts-comparison.ts` · `39-storage-network-ts-comparison.ts`

### 知识点清单

**33 ES2022+** — at()、Object.hasOwn、错误 cause、top-level await、Array.findLast 等
**34 调试与测试** — console 方法、debugger、断点、单元测试基础
**35 内存与 GC** — 内存生命周期、垃圾回收算法、内存泄漏检测与预防
**36 类型化数组** — ArrayBuffer、TypedArray 视图、DataView、二进制数据处理
**37 国际化 API** — Intl.NumberFormat、DateTimeFormat、Collator、RelativeTimeFormat
**38 WeakRef** — WeakRef 创建与使用、FinalizationRegistry、缓存模式
**39 存储与网络** — localStorage/sessionStorage、IndexedDB、XMLHttpRequest、WebSocket
