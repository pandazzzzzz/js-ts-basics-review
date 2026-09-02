# Contributing to JS/TS Fundamentals Review

感谢你对本项目的关注！本文档提供贡献指南，特别关注 **ECMAScript 版本归属验证**。

## 📋 ES 版本归属验证流程

### 核心规则

**ES 版本归属取决于提案达到 Stage 4 的日期与当年度版本的"截稿窗口"，不是简单"年份 N → 版本 N+1"**：

- 每个年度 ES 版本于**当年 6 月发布**，收录此前达到 Stage 4 的提案
- 年份只是粗粒度线索；**精确归属必须看达到 Stage 4 的具体日期**（TC39 meeting notes 的 `for-stage-4` anchor）
- 同年 6 月截稿前达到 Stage 4 → 归入**当年**版本（如 `toSorted` 2023-01 → ES2023）
- 上年截稿后/当年较晚达到 Stage 4 → 归入**次年**版本（如 `Object.groupBy` 2023-11 → ES2024）
- **conditional Stage 4 特例**：标记为 conditional 的提案可能被推迟（如 `using`/Explicit Resource Management 2025-05 conditional Stage 4 → 实际归入 ES2027）

**重要理解**：
- **唯一权威源是 `reference/finished.json`**（含每条特性的 `status`/`stage4Date`/`stage4DateType`/`url` 溯源）——不要凭"年份+1"规则推断
- `stage4Date` 必须用 TC39 notes 的 `for-stage-4` anchor 日期（`stage4DateType: exact`）；早期/无 anchor 特性用合并 commit 里程碑（`stage4DateType: milestone`）
- 更新任何特性归属前，**先改 `reference/finished.json`（或 early/active/withdrawn.json）+ `reference/meta.json` 的 `lastVerified`，再同步 demo 文件与 verification block**（见 CLAUDE.md「ES Version Modification Rules」）

### 验证步骤

添加新 JavaScript 特性时，请遵循以下验证流程：

1. **查询 TC39 提案状态**
   ```bash
   # 访问 TC39 finished proposals 页面
   open https://github.com/tc39/proposals/blob/main/finished-proposals.md
   ```

2. **确定提案所属 ES 版本**
   - 找到提案达到 Stage 4 的确切日期（meeting notes 中的 `for-stage-4` anchor）
   - 对照 `reference/finished.json` 确认归属（不是"年份+1"简化规则）
   - 例如：`toSorted` 2023-01 达到 Stage 4 → ES2023（同年 6 月发布）

3. **验证浏览器/运行时支持**
   - 检查 Can I Use: https://caniuse.com/
   - 检查 Node.js 支持: https://node.green/
   - 检查 MDN 浏览器兼容性表

4. **添加验证注释**
   - 在文件头部添加版本验证注释块（见下文模板）
   - 在特性描述中明确标注 ES 版本或 Stage

5. **更新文档一致性**
   - 更新 `docs/TODOLIST.md`
   - 更新 `docs/JS-TS-KEY-DIFFERENCES.md`
   - 更新 `README.md` 版本要求表

### 版本验证注释块模板

```javascript
// 📘 ES Version Verification:
// - TC39 Finished Proposals: https://github.com/tc39/proposals/blob/main/finished-proposals.md
// - Last Verified: YYYY-MM-DD
// - Verification Rule: attribute by Stage 4 date vs edition freeze window; see reference/finished.json (NOT a fixed year N → N+1)
// - Example: 2024-03 Stage 4 → ES2025 (June 2025 release)
//
// ES Version Attribution in this file:
// - ES2024: Features finalized in 2023 (Object.groupBy, Promise.withResolvers, RegExp /v)
// - ES2025: Features finalized in 2024 (Set methods, Iterator helpers, Float16Array, Import Attributes)
// - ES2026: Features finalized in 2025 (Array.fromAsync, Math.sumPrecise, Error.isError, Uint8Array Base64)
// - ES2027: Features finalized in 2025-2026 (Temporal, Explicit Resource Management, DisposableStack)
// - Stage 2.7: Active proposals, nearing Stage 3 (Decorators)
```

Markdown 文件使用 HTML 注释：
```markdown
<!-- 
ES Version Verification Notes:
- Reference: TC39 Finished Proposals - https://github.com/tc39/proposals/blob/main/finished-proposals.md
- Verification Rule: attribute by Stage 4 date vs edition freeze; see reference/finished.json (not fixed N → N+1)
- ES2024: Features finalized in 2023
- ES2025: Features finalized in 2024
- ES2026: Features finalized in 2025
- ES2027: Features finalized in 2025-2026
- Stage 2-3: Active proposals, not yet finalized
-->
```

## 🔍 TC39 提案查询方法

### 官方资源

1. **TC39 Proposals GitHub**
   - 主仓库：https://github.com/tc39/proposals
   - Finished proposals：https://github.com/tc39/proposals/blob/main/finished-proposals.md
   - Active proposals：https://github.com/tc39/proposals/blob/main/README.md

2. **TC39 Meeting Notes**
   - https://github.com/tc39/notes
   - 查看每次会议的提案进展记录
   - Stage 推进日期的权威来源

3. **提案状态查询**
   - 每个提案仓库的 README.md 通常标注当前 Stage
   - 查看提案仓库的 issues 和 discussions 了解最新进展

### 提案状态理解

| Stage | 名称 | 说明 | 是否属于 ES 版本 |
|-------|------|------|-----------------|
| Stage 0 | Strawperson | 初始想法 | ❌ 否 |
| Stage 1 | Proposal | 正式提案，有 champion | ❌ 否 |
| Stage 2 | Draft | 初步规范文本 | ❌ 否 |
| Stage 3 | Candidate | 完整规范，等待实现反馈 | ❌ 否 |
| Stage 4 | Finished | 准备纳入标准 | ✅ 是（按截稿窗口归入对应年度 ES 版本） |

## ⚠️ 常见错误和注意事项

### 错误 1：提案年份 = ES 版本年份

**错误理解**：
```
2024 年 3 月达到 Stage 4 → ES2024 ❌
```

**正确理解**：
```
2024 年 3 月达到 Stage 4 → ES2025 ✅（2025 年 6 月发布）
```

**原因**：ES 版本命名是**发布年份**，归属看**达到 Stage 4 的具体日期是否落在该年度的截稿窗口**，而非提案最终化年份。例：`toSorted` 2023-01 达到 Stage 4 → **ES2023**（同年 6 月发布，截稿窗口内）；2024-03 达到 Stage 4 → ES2025。**不要套用"年份+1"固定规则**——见 `reference/finished.json` 逐条确认。

### 错误 2：Stage 3 提案属于某个 ES 版本

**错误理解**：
```
Decorators 是 Stage 2.7 → ES2027 特性 ❌
```

**正确理解**：
```
Decorators 是 Stage 2.7 → 尚不属于任何 ES 版本（active.json）✅
只有达到 Stage 4 后才属于某个 ES 版本（finished.json）
```

### 错误 3：假设提案永远不会改变

**错误做法**：
- 基于旧资料或记忆编写 ES 版本
- 不定期验证版本归属

**正确做法**：
- 每次更新前验证 TC39 finished proposals
- 每年 6 月 ES 发布后审查版本归属
- 在文件中添加验证日期

### 错误 4：混淆不同时间线

**Temporal API 时间线示例**：
- 2021-03：达到 Stage 3（候选阶段）
- 2026-03：达到 Stage 4（完成阶段）
- 2027-06：ES2027 发布（包含 Temporal）

**using/await using 时间线示例**：
- 2023：达到 Stage 3
- 2025-05：达到 conditional Stage 4（2026-03 仍在 conditional 状态，故归入 ES2027）
- 2027-06：ES2027 发布（包含 Resource Management）

## 📝 文档更新流程

### 添加新特性时

1. **验证 Stage 状态**
   - 检查 TC39 finished proposals
   - 确定达到 Stage 4 的年份
   - 计算 ES 版本归属

2. **验证浏览器/运行时支持**
   - Can I Use
   - Node.green
   - MDN 兼容性表

3. **编写代码示例**
   - 添加正确的 ES 版本注释
   - 注明浏览器/运行时要求
   - 如果是 Stage 2/2.7/3，添加警告说明

4. **更新文档**
   - TODOLIST.md：添加到相应阶段
   - JS-TS-KEY-DIFFERENCES.md：如果涉及 TypeScript
   - README.md：更新版本要求表

### 版本归属变更时

提案从 Stage 3 推进到 Stage 4 时：

1. **立即更新所有引用**
   - 从 "Stage 3 Proposal" 改为 "ES 版本特性"
   - 添加 Stage 4 达到日期
   - 计算并标注正确的 ES 版本

2. **更新浏览器支持信息**
   - 检查新实现的运行时版本
   - 更新 Node.js 最低版本要求

3. **创建提交**
   - 使用清晰的提交信息：`fix: correct [feature] from Stage 3 to ES[version]`
   - 列出所有修改的文件

### 浏览器/运行时支持更新

定期（建议每月）检查：

1. **Node.js 版本支持**
   - https://node.green/
   - 更新 README.md 版本要求表

2. **浏览器支持**
   - https://caniuse.com/
   - 更新 demo 文件中的浏览器支持注释

3. **TypeScript 支持**
   - TypeScript 版本发布公告
   - 更新 TS 比较文件中的版本注释

## 📚 参考资源

### 官方标准资源

- **TC39 Official**: https://github.com/tc39/proposals
- **ECMAScript Specification**: https://tc39.es/ecma262/
- **MDN JavaScript Reference**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook

### 兼容性查询

- **Kangax Compat Table**: https://kangax.github.io/compat-table/
- **Can I Use**: https://caniuse.com/
- **Node.js ES Support**: https://node.green/

### 学习资源

- **JavaScript.info**: https://javascript.info
- **JavaScript Roadmap**: https://roadmap.sh/javascript
- **TypeScript Roadmap**: https://github.com/microsoft/TypeScript/wiki/Roadmap

### 运行时文档

- **Node.js**: https://nodejs.org/docs/
- **Deno**: https://deno.land/manual
- **Bun**: https://bun.sh/docs

## 🎯 贡献检查清单

提交 Pull Request 前，请确认：

- [ ] 已验证所有 ES 版本归属（对照 TC39 finished proposals）
- [ ] 已添加版本验证注释块到相关文件
- [ ] 已验证浏览器/运行时支持信息
- [ ] 已更新 TODOLIST.md（如有新特性）
- [ ] 已更新 JS-TS-KEY-DIFFERENCES.md（如涉及 TypeScript）
- [ ] 已更新 README.md 版本要求表（如有版本变化）
- [ ] demo 文件可正常运行（`node demo/xx/xx-file.js`）
- [ ] TypeScript 比较文件语法正确（如有）
- [ ] 提交信息符合规范（见下方）

### 提交信息规范

```
<type>: <subject>

type 可选值：
- feat: 新特性
- fix: 修复错误（包括 ES 版本归属错误）
- docs: 文档更新
- refactor: 重构
- test: 测试
- chore: 构建/依赖

例子：
- feat: add Iterator helpers examples (ES2025)
- fix: correct Temporal API attribution to ES2027
- docs: update browser support for Set methods
- docs: add ES version verification comment blocks
```

## 💡 维护建议

### 每年 6 月（ES 发布后）

- 对照 TC39 finished proposals 验证所有版本归属
- 更新浏览器/运行时支持状态
- 检查是否有提案推进到 Stage 4

### 每月

- 检查 Node.js 新版本发布
- 更新 README.md 版本要求表
- 检查浏览器支持更新

### 每次更新时

- 添加版本验证注释
- 验证 Stage 状态
- 更新文档一致性

---

**文档版本**: 2026-07-15
**验证依据**: TC39 Finished Proposals (https://github.com/tc39/proposals/blob/main/finished-proposals.md)

如有疑问，请参考本指南或查阅 TC39 官方资料。Happy contributing! 🎉