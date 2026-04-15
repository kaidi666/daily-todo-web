# AI 编程助手进阶：Rules、Skills 与 Subagents 实战指南

> 适用对象：有开发经验，首次使用 AI IDE 的开发者
>
> 核心目标：从"聊天式"进阶到"工程化"使用 AI 编程助手

---

## 目录

1. [概念总览](#概念总览)
2. [Rules：项目级规则配置](#rules项目级规则配置)
3. [Skills：可复用的技能模块](#skills可复用的技能模块)
4. [Subagents：并行子代理](#subagents并行子代理)
5. [三者对比与选择](#三者对比与选择)
6. [实战案例](#实战案例)
7. [最佳实践](#最佳实践)

---

## 概念总览

如果你之前只用过聊天窗口和 AI 沟通，可能会遇到这些问题：

| 痛点 | 传统聊天方式 | 工程化方案 |
|------|-------------|-----------|
| 每次都要重复说"用 TypeScript"、"遵循 ESLint" | ❌ 重复劳动 | ✅ Rules 自动生效 |
| 复杂任务容易遗漏步骤 | ❌ 靠记忆 | ✅ Skills 流程化 |
| 多个独立任务串行执行慢 | ❌ 一个个来 | ✅ Subagents 并行 |

**一句话理解三者：**

- **Rules** = 项目宪法，定义"必须遵守的规则"
- **Skills** = 技能包，定义"如何完成某类任务"
- **Subagents** = 分身术，定义"谁来做、做什么"

---

## Rules：项目级规则配置

### 什么是 Rules？

Rules 是项目级别的持久化配置，告诉 AI 在这个项目中**必须遵守的约定**。

类似 Cursor 的 `.cursorrules`，我们的编辑器通过 `CLAUDE.md` 文件实现。

### 基本结构

在项目根目录创建 `CLAUDE.md`：

```markdown
# 项目规则

## 技术栈
- 前端：React 18 + TypeScript + Tailwind CSS
- 后端：Node.js + Express
- 数据库：PostgreSQL

## 编码规范
- 使用函数式组件，避免 class 组件
- 所有 API 响应使用统一格式 { code, data, message }
- 变量命名使用 camelCase，常量使用 UPPER_SNAKE_CASE

## 禁止事项
- 不要使用 any 类型
- 不要在组件中直接调用 fetch，使用封装的 apiClient
```

### 实战示例：前后端分离项目

```markdown
# CLAUDE.md

## 项目结构
- /frontend - React 前端应用
- /backend - Express 后端应用
- /shared - 共享类型定义

## 前端规则
- 样式使用 Tailwind，禁止内联 style
- 状态管理优先使用 Zustand
- 表单使用 React Hook Form + Zod 校验

## 后端规则
- 所有路由必须有 TypeScript 类型定义
- 数据库操作使用 Prisma ORM
- 错误处理使用 AppError 类统一抛出

## Git 提交规范
- feat: 新功能
- fix: 修复 bug
- refactor: 重构
- docs: 文档更新
```

### Rules 的生效范围

| 文件位置 | 生效范围 |
|---------|---------|
| `~/.claude/CLAUDE.md` | 全局，所有项目 |
| `项目根目录/CLAUDE.md` | 当前项目 |
| `子目录/CLAUDE.md` | 当前子目录及下级 |

---

## Skills：可复用的技能模块

### 什么是 Skills？

Skills 是**可复用的任务模板**，把"如何做某件事"固化下来，避免每次重复描述。

### Skill 的结构

```
skills/
└── code-review/
    └── SKILL.md          # 必需：技能定义文件
```

**SKILL.md 示例：**

```markdown
---
name: code-review
description: 代码审查专家。用于审查 PR、检查代码质量、发现潜在问题。
---

# 代码审查流程

## 审查清单

### 代码质量
- [ ] 命名是否清晰、有意义
- [ ] 函数是否单一职责
- [ ] 是否有重复代码可抽取

### 安全检查
- [ ] 是否有 SQL 注入风险
- [ ] 是否有 XSS 漏洞
- [ ] 敏感数据是否正确处理

### 性能考量
- [ ] 是否有 N+1 查询问题
- [ ] 是否有不必要的循环嵌套

## 输出格式

请按以下格式输出审查结果：

### 🔴 严重问题
（必须修复的问题）

### 🟡 建议改进
（可选的优化建议）

### 🟢 亮点
（值得肯定的做法）
```

### 如何使用 Skill

**方式一：自动触发（推荐）**

AI 会根据 `description` 自动判断何时使用：

```
用户：帮我审查一下 src/auth/login.ts 的代码
AI：[自动调用 code-review skill]
```

**方式二：显式调用**

```
用户：/code-review src/auth/login.ts
```

### 实战示例：创建一个 API 文档生成 Skill

```markdown
---
name: api-docs
description: 生成 API 接口文档。用于为 Express/Fastify 路由生成 OpenAPI 文档。
---

# API 文档生成

## 分析步骤

1. 扫描路由文件，识别所有端点
2. 提取请求参数、响应格式
3. 生成 OpenAPI 3.0 规范

## 文档模板

对于每个接口，生成以下内容：

```yaml
/api/users:
  get:
    summary: 获取用户列表
    parameters:
      - name: page
        in: query
        schema:
          type: integer
    responses:
      200:
        description: 成功
        content:
          application/json:
            schema:
              type: object
              properties:
                code:
                  type: integer
                data:
                  type: array
                  items:
                    $ref: '#/components/schemas/User'
```

## 输出位置

将生成的文档保存到 `docs/api.yaml`
```

---

## Subagents：并行子代理

### 什么是 Subagents？

Subagents 是**独立的 AI 实例**，可以：
- 并行执行多个任务
- 拥有独立的上下文（不会互相干扰）
- 限制可用的工具权限

### 为什么需要 Subagents？

**场景：你需要同时做三件事**

```
1. 审查前端代码的安全性
2. 审查后端代码的性能
3. 运行测试并分析覆盖率
```

传统方式：串行执行，耗时 3x

使用 Subagents：并行执行，耗时 1x

### Subagent 类型

| 类型 | 用途 | 特点 |
|-----|------|-----|
| `general-purpose` | 通用任务 | 全功能 |
| `Explore` | 代码探索 | 快速搜索，不修改代码 |
| `Plan` | 架构规划 | 只读分析，输出计划 |
| `code-reviewer` | 代码审查 | 只读权限，专注质量 |

### 实战示例：并行代码审查

**场景：审查一个全栈项目的 PR**

```markdown
我需要审查这个 PR，请并行执行：

1. 使用 code-reviewer agent 审查前端代码（src/frontend/）
   - 关注：React 最佳实践、性能问题
   - 工具权限：只读（Read, Grep, Glob）

2. 使用 code-reviewer agent 审查后端代码（src/backend/）
   - 关注：API 安全、数据库查询效率
   - 工具权限：只读

3. 使用 test-runner agent 运行测试
   - 运行 npm test
   - 分析覆盖率报告
   - 工具权限：Bash, Read
```

AI 会自动创建三个 Subagent 并行工作：

```
┌─────────────────────────────────────────────────┐
│                   Main Agent                     │
│                   (协调者)                        │
└─────────────────┬───────────────────────────────┘
                  │
       ┌──────────┼──────────┐
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Agent 1  │ │ Agent 2  │ │ Agent 3  │
│ 前端审查  │ │ 后端审查  │ │ 测试运行  │
└──────────┘ └──────────┘ └──────────┘
```

### 定义自定义 Subagent

在代码中定义（SDK 方式）：

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "审查这个项目的代码质量",
  options: {
    allowedTools: ["Read", "Grep", "Glob", "Agent"],
    agents: {
      "security-reviewer": {
        description: "安全审查专家，检查 OWASP Top 10 漏洞",
        prompt: `你是安全审查专家。
        重点检查：
        - SQL 注入
        - XSS 攻击
        - 敏感数据泄露`,
        tools: ["Read", "Grep", "Glob"], // 只读权限
        model: "sonnet"
      },
      "perf-analyzer": {
        description: "性能分析专家，检查性能瓶颈",
        prompt: `你是性能分析专家。
        重点检查：
        - N+1 查询
        - 内存泄漏风险
        - 不必要的重渲染`,
        tools: ["Read", "Grep", "Glob"],
      }
    }
  }
})) {
  if ("result" in message) console.log(message.result);
}
```

---

## 三者对比与选择

### 功能对比

| 特性 | Rules | Skills | Subagents |
|-----|-------|--------|-----------|
| **目的** | 定义约束 | 定义流程 | 分配执行者 |
| **生效方式** | 自动（全局） | 自动或手动触发 | 显式调用 |
| **可复用性** | 项目级 | 跨项目共享 | 任务级 |
| **修改代码** | 不直接修改 | 可以修改 | 看权限配置 |
| **并行能力** | 无 | 无 | ✅ 支持 |

### 选择决策树

```
你的需求是什么？
│
├─ "我希望 AI 记住项目的编码规范"
│   └─ 使用 Rules (CLAUDE.md)
│
├─ "我有一个复杂的任务流程想固化下来"
│   └─ 使用 Skills (SKILL.md)
│
└─ "我有多个独立任务想同时执行"
    └─ 使用 Subagents
```

### 组合使用场景

**场景：新项目初始化**

```
1. Rules (CLAUDE.md)
   └─ 定义技术栈、编码规范

2. Skills
   ├─ /init-project - 初始化项目结构
   ├─ /setup-ci - 配置 CI/CD
   └─ /add-component - 创建组件模板

3. Subagents
   ├─ Agent 1: 初始化前端
   ├─ Agent 2: 初始化后端
   └─ Agent 3: 配置共享类型
```

---

## 实战案例

### 案例 1：团队代码规范落地

**问题**：团队成员编码风格不一致，每次 Code Review 都要重复指出相同问题

**解决方案**：Rules + Skills 组合

**Step 1：创建 Rules**

```markdown
# CLAUDE.md

## 命名规范
- 组件文件：PascalCase（如 UserProfile.tsx）
- 工具函数：camelCase（如 formatDate.ts）
- 常量：UPPER_SNAKE_CASE（如 API_BASE_URL）

## React 规范
- 组件必须有明确的 TypeScript 类型
- Props 接口命名为 ComponentNameProps
- 事件处理函数以 handle 开头

## 测试规范
- 测试文件与源文件同目录
- 测试命名：describe('功能', () => { it('场景', ...) })
```

**Step 2：创建 Code Review Skill**

```markdown
---
name: team-review
description: 团队代码审查，检查是否符合团队规范
---

# 团队代码审查

## 检查项

### 命名检查
- [ ] 文件名是否符合规范
- [ ] 变量名是否清晰
- [ ] 是否有缩写需要解释

### 类型检查
- [ ] 是否有 any 类型
- [ ] Props 是否有类型定义
- [ ] 返回值是否有类型

### React 检查
- [ ] 是否使用函数式组件
- [ ] 是否正确使用 hooks
- [ ] 是否有性能问题（如缺少 memo）
```

**使用效果**：

```
开发者：帮我审查 src/components/UserList.tsx

AI：[自动应用 Rules + 调用 team-review skill]

审查结果：
🔴 严重问题
- Props 缺少类型定义，请添加 UserListProps 接口

🟡 建议改进
- 建议使用 React.memo 包裹组件以避免不必要渲染
- handleDelete 函数建议使用 useCallback 缓存
```

---

### 案例 2：大型重构任务

**问题**：需要将一个单体应用拆分为微服务，涉及多个模块的并行分析

**解决方案**：Subagents 并行分析

```
用户：我要将这个单体应用拆分为微服务，请分析各模块的依赖关系

AI：我将启动多个 Subagent 并行分析：

[Agent 1: auth-module] 分析认证模块
  - 依赖：数据库、Redis、JWT
  - 对外接口：登录、注册、验证

[Agent 2: order-module] 分析订单模块
  - 依赖：数据库、消息队列、支付网关
  - 对外接口：创建订单、查询订单

[Agent 3: user-module] 分析用户模块
  - 依赖：数据库、文件存储
  - 对外接口：用户信息、头像上传

[Agent 4: shared-code] 分析共享代码
  - 工具函数：日期处理、加密
  - 中间件：认证中间件、错误处理

综合分析结果：
┌─────────────┐     ┌─────────────┐
│  Auth Svc   │────▶│  User Svc   │
└─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Order Svc   │────▶│ Shared Lib  │
└─────────────┘     └─────────────┘

建议拆分顺序：
1. 先抽取 Shared Lib
2. 再拆分 User Svc（无外部依赖）
3. 然后是 Auth Svc（依赖 User）
4. 最后是 Order Svc（依赖 Auth）
```

---

### 案例 3：日常开发提效

**场景**：开发一个新功能，需要创建多个文件

**传统方式**：

```
用户：帮我创建一个用户管理页面
AI：好的，我来创建...（创建文件）
用户：还需要添加 API 接口
AI：好的...（创建接口）
用户：还要写测试
AI：好的...（创建测试）
用户：还要更新文档
AI：好的...（更新文档）
```

**使用 Skills 后**：

```markdown
---
name: add-feature
description: 添加新功能的完整流程
---

# 新功能开发流程

当用户要求添加新功能时，按以下步骤执行：

## 1. 创建组件
- 在 src/components/ 创建组件文件
- 使用项目组件模板

## 2. 创建 API
- 在 src/api/ 创建接口文件
- 添加 TypeScript 类型

## 3. 创建测试
- 创建 *.test.tsx 测试文件
- 覆盖基本场景

## 4. 更新文档
- 在 docs/features/ 添加功能说明

## 5. 输出总结
- 列出创建的所有文件
- 说明如何使用新功能
```

**使用效果**：

```
用户：/add-feature 用户管理页面

AI：正在创建用户管理功能...

✅ 创建组件：src/components/UserManagement.tsx
✅ 创建 API：src/api/users.ts
✅ 创建类型：src/types/user.ts
✅ 创建测试：src/components/UserManagement.test.tsx
✅ 更新文档：docs/features/user-management.md

功能已就绪！使用方式：
import { UserManagement } from '@/components/UserManagement';
```

---

## 最佳实践

### Rules 最佳实践

1. **保持简洁**：只写真正重要的规则，避免冗长
2. **分层管理**：全局规则 + 项目规则 + 目录规则
3. **定期更新**：随着项目演进更新规则
4. **团队共识**：Rules 应该是团队讨论的结果

### Skills 最佳实践

1. **单一职责**：一个 Skill 只做一件事
2. **清晰的 description**：让 AI 能准确判断何时使用
3. **提供检查清单**：帮助 AI 系统性执行任务
4. **包含输出模板**：统一输出格式

### Subagents 最佳实践

1. **任务独立**：确保子任务之间没有依赖
2. **权限最小化**：只给必要的工具权限
3. **合理分片**：不要创建太多 Subagent（建议 ≤ 5 个）
4. **结果聚合**：主 Agent 负责汇总各 Subagent 结果

---

## 快速上手清单

### 今天就可以尝试

- [ ] 在项目中创建 `CLAUDE.md`，写下 3 条最重要的规则
- [ ] 创建一个 `code-review` Skill，固化你的审查流程
- [ ] 尝试用 Subagents 并行执行 2 个独立任务

### 进阶探索

- [ ] 为团队创建共享的 Skills 库
- [ ] 编写项目特定的 Subagent 定义
- [ ] 结合 CI/CD 自动化代码审查

---

## 附录：常用 Skills 模板

### 1. 代码审查 Skill

```markdown
---
name: code-review
description: 代码审查，检查质量、安全、性能
---

## 审查清单

### 质量
- [ ] 命名清晰
- [ ] 单一职责
- [ ] 无重复代码

### 安全
- [ ] 无注入风险
- [ ] 无敏感数据泄露

### 性能
- [ ] 无 N+1 查询
- [ ] 无内存泄漏风险
```

### 2. Git 提交 Skill

```markdown
---
name: commit
description: 生成规范的 Git 提交信息
---

## 提交格式

<type>(<scope>): <subject>

<body>

<footer>

## Type 类型
- feat: 新功能
- fix: 修复
- refactor: 重构
- docs: 文档
- test: 测试
- chore: 构建/工具
```

### 3. 测试生成 Skill

```markdown
---
name: gen-tests
description: 为函数生成单元测试
---

## 测试原则

1. 测试正常路径
2. 测试边界条件
3. 测试错误处理

## 测试模板

describe('functionName', () => {
  it('should ...', () => {
    // arrange
    // act
    // assert
  });
});
```

---

## 总结

| 概念 | 一句话 | 何时使用 |
|-----|-------|---------|
| **Rules** | 项目宪法 | 有需要 AI 记住的约定 |
| **Skills** | 技能包 | 有重复执行的任务流程 |
| **Subagents** | 分身术 | 有多个独立任务要并行 |

**从聊天到工程化**：

```
聊天模式：每次都要说清楚要求
    ↓
Rules：项目约定自动生效
    ↓
Skills：任务流程标准化
    ↓
Subagents：复杂任务并行化
```

祝大家 AI 编程愉快！🚀

---

## 进阶：OpenSpec — 规范驱动开发框架

> OpenSpec 是一个 AI 原生的规范驱动开发框架，让 AI 编程从"随意发挥"变成"有章可循"。

### 什么是 OpenSpec？

OpenSpec 是由 Fission AI 开发的开源工具，核心理念是：

```
先定义规范（Spec），再编写代码
让 AI 和人类在动手之前达成共识
```

**GitHub**: https://github.com/Fission-AI/OpenSpec
**官网**: https://openspec.dev/
**NPM**: `@fission-ai/openspec`

### 为什么需要 OpenSpec？

| 痛点 | 传统 AI 编程 | OpenSpec 方案 |
|------|-------------|--------------|
| AI 理解偏差 | "帮我做个登录功能" → 结果不符合预期 | 先写 proposal.md，明确需求再动手 |
| 需求遗漏 | 做到一半发现漏了边界情况 | spec.md 强制覆盖所有场景 |
| 代码与需求脱节 | 需求在聊天记录里，代码在文件里 | 每个变更都有独立的规范文件夹 |
| 团队协作困难 | AI 生成的代码缺少文档 | 自动生成 proposal、design、tasks |

### OpenSpec 的核心结构

每个功能变更都会在 `openspec/changes/` 下创建一个文件夹：

```
openspec/
├── changes/
│   └── add-dark-mode/           # 变更名称
│       ├── proposal.md          # 为什么做、做什么
│       ├── specs/               # 功能规格
│       │   └── dark-mode/
│       │       └── spec.md      # 需求和场景
│       ├── design.md            # 技术设计
│       └── tasks.md             # 实现任务清单
└── specs/                       # 项目级规格（可选）
```

### 快速开始

**1. 安装 OpenSpec**

```bash
npm install -g @fission-ai/openspec@latest
```

**2. 在项目中初始化**

```bash
cd your-project
openspec init
```

**3. 使用斜杠命令**

```
/opsx:propose add-dark-mode
```

### OpenSpec 工作流

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenSpec 工作流                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /opsx:propose <name>                                       │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────┐               │
│  │ 创建变更文件夹                            │               │
│  │ • proposal.md  (为什么做、做什么)         │               │
│  │ • specs/       (需求和场景)              │               │
│  │ • design.md    (技术方案)                │               │
│  │ • tasks.md     (任务清单)                │               │
│  └─────────────────────────────────────────┘               │
│       │                                                     │
│       ▼                                                     │
│  /opsx:apply                                               │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────┐               │
│  │ 按任务清单实现代码                        │               │
│  │ AI 读取规范，生成符合要求的代码           │               │
│  └─────────────────────────────────────────┘               │
│       │                                                     │
│       ▼                                                     │
│  /opsx:archive                                             │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────┐               │
│  │ 归档到 openspec/changes/archive/         │               │
│  │ 更新项目级规格                           │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 核心文件详解

#### 1. proposal.md — 变更提案

定义"为什么做"和"做什么"：

```markdown
## Why

用户反馈夜间使用应用时屏幕太亮，影响体验。
竞品都已支持深色模式，这是用户高频需求。

## What Changes

- 新增深色主题切换功能
- 所有页面支持主题切换
- 主题偏好保存到 localStorage

## Capabilities

### New Capabilities
- `dark-mode`: 深色主题切换功能

### Modified Capabilities
- `theme-provider`: 扩展支持多主题

## Impact

- 所有使用 Tailwind 的组件
- 全局样式文件
- localStorage API
```

#### 2. specs/spec.md — 功能规格

定义需求和行为场景：

```markdown
## Context

当前应用只支持亮色主题，用户无法切换。

## Goals / Non-Goals

**Goals:**
- 支持亮色/深色两种主题
- 用户选择的主题持久化
- 系统主题自动检测

**Non-Goals:**
- 不支持自定义主题色
- 不支持更多主题选项

## ADDED Requirements

### Requirement: 主题切换

用户可以在亮色和深色主题之间切换。

#### Scenario: 用户手动切换主题
- **WHEN** 用户点击主题切换按钮
- **THEN** 应用立即切换到对应主题

#### Scenario: 主题偏好持久化
- **WHEN** 用户选择某个主题
- **THEN** 下次访问时自动应用该主题

#### Scenario: 跟随系统主题
- **WHEN** 用户未手动选择主题
- **AND** 系统设置为深色模式
- **THEN** 应用自动使用深色主题
```

#### 3. design.md — 技术设计

定义技术方案：

```markdown
## Context

使用 React 18 + Tailwind CSS + Zustand。

## Goals / Non-Goals

**Goals:**
- 最小化代码改动
- 利用 Tailwind 的 dark: 前缀
- 性能优化（避免闪烁）

**Non-Goals:**
- 不引入新的 CSS-in-JS 方案

## Decisions

### 1. 主题状态管理
使用 Zustand 管理主题状态，原因：
- 轻量级
- 支持持久化中间件
- 无需 Provider 包裹

### 2. CSS 方案
使用 Tailwind 的 `dark:` 前缀，配合 `dark` class：
```html
<html class="dark">
```

### 3. 防止闪烁
在 `<head>` 中注入脚本，在 DOM 加载前读取 localStorage：
```html
<script>
  if (localStorage.theme === 'dark' ||
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
</script>
```

## Risks / Trade-offs

- **风险**: Tailwind dark mode 需要配置 `darkMode: 'class'`
- **权衡**: 不支持 IE11（可接受）
```

#### 4. tasks.md — 任务清单

定义实现步骤：

```markdown
## 1. 基础设施

- [ ] 1.1 配置 Tailwind darkMode: 'class'
- [ ] 1.2 创建 themeStore (Zustand)
- [ ] 1.3 添加防闪烁脚本到 index.html

## 2. 主题切换组件

- [ ] 2.1 创建 ThemeToggle 组件
- [ ] 2.2 添加亮色/深色图标
- [ ] 2.3 集成 themeStore

## 3. 样式适配

- [ ] 3.1 为所有组件添加 dark: 样式
- [ ] 3.2 更新全局 CSS 变量
- [ ] 3.3 测试所有页面

## 4. 测试

- [ ] 4.1 单元测试：themeStore
- [ ] 4.2 集成测试：主题切换
- [ ] 4.3 E2E 测试：持久化验证
```

### 实战示例：添加用户认证功能

**场景**：为应用添加登录/注册功能

**Step 1：创建提案**

```
/opsx:propose user-authentication
```

AI 会生成：

```
openspec/changes/user-authentication/
├── proposal.md      # 为什么需要认证，做什么
├── specs/
│   └── auth/
│       └── spec.md  # 登录、注册、登出场景
├── design.md        # JWT 方案、中间件设计
└── tasks.md         # 实现步骤清单
```

**Step 2：审查规范**

检查 AI 生成的规范是否符合预期：

```
用户：查看 proposal.md，确认需求是否完整

AI：proposal.md 内容：
- Why: 当前任何人都能访问所有功能，需要权限控制
- What: 添加登录、注册、登出功能
- Capabilities: auth (新增)
- Impact: 所有需要权限的页面
```

**Step 3：实现**

```
/opsx:apply
```

AI 会按 tasks.md 中的清单逐步实现：

```
✓ 1.1 创建 User 模型
✓ 1.2 配置 JWT 密钥
✓ 1.3 创建 auth 中间件
✓ 2.1 实现注册 API
✓ 2.2 实现登录 API
✓ 2.3 实现登出 API
...
```

**Step 4：归档**

```
/opsx:archive
```

变更会被归档，项目规格更新。

### OpenSpec 与 Rules/Skills/Subagents 的关系

| 概念 | 层级 | 作用 |
|-----|------|------|
| **Rules** | 项目约束 | 定义"必须遵守的规则" |
| **Skills** | 任务模板 | 定义"如何做某类任务" |
| **Subagents** | 执行单元 | 定义"谁来做" |
| **OpenSpec** | 开发流程 | 定义"做什么、为什么做、怎么做" |

**组合使用**：

```
OpenSpec 定义规范
    ↓
Rules 确保代码符合项目约定
    ↓
Skills 执行具体任务（如创建组件、写测试）
    ↓
Subagents 并行处理多个模块
```

### OpenSpec 支持的工具

OpenSpec 支持 25+ AI 编程工具：

| 工具 | 命令文件路径 |
|-----|-------------|
| Claude Code | `.claude/commands/opsx/<id>.md` |
| Cursor | `.cursor/rules/opsx-<id>.md` |
| Cline | `.clinerules/workflows/opsx-<id>.md` |
| Amazon Q | `.amazonq/prompts/opsx-<id>.md` |
| Continue | `.continue/prompts/opsx-<id>.prompt` |
| Codex | `~/.codex/prompts/opsx-<id>.md` |
| ... | ... |

### OpenSpec vs 其他方案

| 特性 | OpenSpec | Spec Kit (GitHub) | Kiro (AWS) |
|-----|----------|-------------------|------------|
| **重量级** | 轻量 | 重 | 中 |
| **工具支持** | 25+ 工具 | GitHub 生态 | AWS IDE |
| **模型支持** | 任意模型 | 任意模型 | 仅 Claude |
| **工作流** | 灵活迭代 | 严格阶段 | 固定流程 |
| **学习曲线** | 低 | 高 | 中 |

### OpenSpec 最佳实践

1. **从小做起**：先为一个简单功能创建变更，熟悉流程
2. **审查规范**：实现前检查 proposal 和 spec 是否完整
3. **迭代优化**：规范不是一成不变的，随时更新
4. **团队共享**：将 `openspec/` 目录纳入版本控制

### 常用命令速查

| 命令 | 作用 |
|-----|------|
| `openspec init` | 初始化项目 |
| `openspec update` | 更新 AI 指令文件 |
| `/opsx:propose <name>` | 创建新变更提案 |
| `/opsx:apply` | 按规范实现代码 |
| `/opsx:archive` | 归档已完成的变更 |
| `openspec config profile` | 切换工作流配置 |

---

## 总结：AI 编程工具全景图

```
┌─────────────────────────────────────────────────────────────┐
│                    AI 编程工具全景                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Rules     │     │   Skills    │     │ Subagents   │   │
│  │  项目宪法    │     │  技能包     │     │  分身术     │   │
│  │             │     │             │     │             │   │
│  │ 定义约束    │     │ 定义流程    │     │ 分配执行者   │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                   │                   │          │
│         └───────────────────┼───────────────────┘          │
│                             │                              │
│                             ▼                              │
│                    ┌─────────────────┐                     │
│                    │    OpenSpec     │                     │
│                    │   规范驱动框架   │                     │
│                    │                 │                     │
│                    │ 定义"做什么"    │                     │
│                    │ 定义"为什么做"  │                     │
│                    │ 定义"怎么做"    │                     │
│                    └─────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**选择指南**：

| 你的需求 | 使用工具 |
|---------|---------|
| 让 AI 记住项目规范 | Rules (CLAUDE.md) |
| 固化某个任务流程 | Skills (SKILL.md) |
| 并行执行多个任务 | Subagents |
| 规范化功能开发流程 | OpenSpec |
| 团队协作、需求追溯 | OpenSpec |

**从入门到精通的路径**：

```
第 1 天：创建 CLAUDE.md，定义 3 条核心规则
    ↓
第 3 天：创建第一个 Skill，固化常用任务
    ↓
第 7 天：尝试 Subagents 并行处理
    ↓
第 14 天：引入 OpenSpec，规范开发流程
    ↓
持续优化：积累 Skills 库，完善项目规范
```

祝大家 AI 编程愉快！🚀
