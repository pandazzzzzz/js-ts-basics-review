// DOM 基础 Demo
// 📘 javascript.info Part 2 > Document
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
// ⚠️ 浏览器环境专属 — 需在 HTML 文件中引入或使用 jsdom

// ============================================
// TODO List for DOM Basics
// ============================================

// Section 1: DOM 树结构
// TODO: DOM 是什么 — 文档对象模型
// TODO: 节点类型: Element, Text, Comment, Document
// TODO: DOM 树的层级关系: parentNode, childNodes, firstChild, lastChild
// TODO: 兄弟节点: nextSibling, previousSibling
// TODO: Element-only 导航: children, firstElementChild, parentElement

// Section 2: 搜索与获取元素
// TODO: document.getElementById()
// TODO: document.querySelector() / querySelectorAll()
// TODO: document.getElementsByClassName() / getElementsByTagName()
// TODO: elem.closest() — 向上查找最近的祖先
// TODO: elem.matches() — 检查元素是否匹配选择器
// TODO: 实时集合 vs 静态集合的区别

// Section 3: 节点属性与内容
// TODO: innerHTML vs textContent vs innerText 的区别
// TODO: outerHTML — 包含元素自身的 HTML
// TODO: nodeValue / data — 文本节点内容
// TODO: hidden 属性

// Section 4: DOM 节点的属性 (Attributes & Properties)
// TODO: HTML 属性 vs DOM 属性的区别
// TODO: elem.getAttribute() / setAttribute() / removeAttribute()
// TODO: elem.hasAttribute() / elem.attributes
// TODO: 非标准属性与 dataset (data-* 属性)
// TODO: 属性同步: 何时属性与 property 同步，何时不同步

// Section 5: 样式与类
// TODO: elem.className / elem.classList (add, remove, toggle, contains)
// TODO: elem.style — 内联样式操作
// TODO: getComputedStyle() — 获取计算后的样式
// TODO: CSS 变量与 JavaScript 交互

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. DOM ELEMENT TYPES
   TS:  HTMLElement, HTMLInputElement, HTMLDivElement 等精确类型
   TS:  querySelector<T>() 泛型用法

2. NULL SAFETY
   TS:  document.getElementById() 返回 HTMLElement | null
   TS:  需要非空断言 (!) 或类型守卫

3. EVENT TARGET TYPING
   TS:  event.target as HTMLInputElement (类型断言)
*/
