// DOM 操作 Demo
// 📘 javascript.info Part 2 > "Modifying the document"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
// ⚠️ 浏览器环境专属

// ============================================
// TODO List for DOM Manipulation
// ============================================

// Section 1: 创建元素
// TODO: document.createElement(tag)
// TODO: document.createTextNode(text)
// TODO: elem.cloneNode(deep) — 浅克隆 vs 深克隆
// TODO: DocumentFragment — 批量操作优化

// Section 2: 插入元素
// TODO: 现代方法: append, prepend, before, after, replaceWith
// TODO: 传统方法: appendChild, insertBefore, replaceChild
// TODO: insertAdjacentHTML / insertAdjacentText / insertAdjacentElement
// TODO: 插入位置: beforebegin, afterbegin, beforeend, afterend

// Section 3: 删除元素
// TODO: elem.remove() — 现代方法
// TODO: parent.removeChild(elem) — 传统方法
// TODO: 移动元素 (插入已存在的元素会自动移动)

// Section 4: 批量操作与性能
// TODO: DocumentFragment 减少重排
// TODO: innerHTML 批量替换 vs 逐个操作
// TODO: requestAnimationFrame 与 DOM 更新
// TODO: 虚拟 DOM 概念简介 (React/Vue 的核心思想)

// Section 5: 表格与列表的特殊 API
// TODO: table.rows, table.insertRow(), row.cells
// TODO: select.options, select.selectedIndex

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. createElement OVERLOADS
   TS:  document.createElement('div') 返回 HTMLDivElement
   TS:  document.createElement('input') 返回 HTMLInputElement

2. GENERIC METHODS
   TS:  elem.querySelector<HTMLInputElement>('.input')
*/
