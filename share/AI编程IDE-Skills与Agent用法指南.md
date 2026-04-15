# AI 编程编辑器：Rules、Skills 与 Subagent 用法指南

> 面向开发者的 AI 编程助手进阶使用指南

---

## 一、概念介绍

### 1.1 Rules（规则）

**Rules** 是项目级的 AI 行为约束文件，定义 AI 在当前项目中应该如何理解和生成代码。

**核心作用：**
- 让 AI 理解项目技术栈和架构
- 约束编码风格和最佳实践
- 团队共享，确保一致性

**本质：** "告诉 AI 这个项目的规矩"

### 1.2 Skills（技能）

**Skills** 是可复用的提示词模板，封装特定领域的工作流程和知识。

**核心作用：**
- 封装复杂任务的执行步骤
- 注入领域知识（如 API 规范、测试策略）
- 可跨项目复用

**本质：** "教 AI 一项专业技能"

### 1.3 Subagent（子智能体）

**Subagent** 是独立的 AI 工作单元，拥有独立的上下文和工具权限，专注于特定类型任务。

**核心作用：**
- 隔离上下文，避免污染主会话
- 限制工具权限，提高安全性
- 可选择不同模型，优化成本

**本质：** "派一个专业助手去干活"

---

## 二、三者区别与关系

### 2.1 对比一览

| 特性 | Rules | Skills | Subagent |
|------|-------|--------|----------|
| **作用域** | 项目级 | 可跨项目 | 任务级 |
| **配置位置** | 项目根目录 | skills 目录 | agents 目录 |
| **主要用途** | 约束 AI 行为 | 注入工作流 | 隔离执行任务 |
| **是否独立上下文** | ❌ | ❌ | ✅ |
| **是否可限制工具** | ❌ | ❌ | ✅ |
| **是否可选择模型** | ❌ | ❌ | ✅ |
| **团队共享** | ✅ Git 管理 | ✅ Git 管理 | ✅ Git 管理 |

### 2.2 协作关系

```
┌─────────────────────────────────────────────────────┐
│                    主会话                           │
│  ┌─────────────┐    ┌─────────────┐                │
│  │   Rules     │    │   Skills    │                │
│  │ (项目规矩)   │    │ (专业技能)   │                │
│  └─────────────┘    └─────────────┘                │
│         ↓                 ↓                         │
│    约束所有 AI 行为    可被主会话或 Subagent 调用      │
└─────────────────────────────────────────────────────┘
                          ↓ 委派任务
         ┌────────────────┴────────────────┐
         │                                 │
    ┌────▼────┐                      ┌─────▼────┐
    │Subagent │                      │Subagent  │
    │(代码审查)│                      │(测试生成) │
    │         │                      │          │
    │ 独立上下文                      │ 独立上下文 │
    │ 独立工具权限                     │ 独立工具权限│
    │ 可选模型: Haiku                  │ 可选模型: Sonnet│
    └─────────┘                      └──────────┘
```

**执行流程示例：**

1. **Rules** 告诉 AI："这是 TypeScript 项目，禁止使用 any"
2. **Skills** 告诉 AI："代码审查时检查安全、性能、可读性"
3. **Subagent** 被派去执行："审查 auth 模块"，在自己的上下文中完成，返回结果

---

## 三、Rules 用法详解

### 3.1 配置文件

**位置：** 项目根目录

**文件名：** `.cursorrules` 或 `RULES.md`（根据编辑器配置）

### 3.2 内容结构

```markdown
# 项目规则

## 技术栈
- 前端：React 18 + TypeScript + Tailwind CSS
- 状态管理：Zustand
- 构建工具：Vite

## 架构约定
- 组件放在 src/components/
- 页面放在 src/pages/
- API 调用放在 src/services/
- 类型定义放在 src/types/

## 编码规范
- 使用函数式组件 + Hooks
- 组件命名：PascalCase
- 变量命名：camelCase
- 常量命名：UPPER_SNAKE_CASE
- 文件命名：kebab-case

## 禁止事项
- 禁止使用 any 类型
- 禁止在组件中直接调用 fetch
- 禁止 console.log 提交到代码库
- 禁止忽略 TypeScript 错误

## 测试要求
- 所有组件必须有对应测试文件
- 测试文件放在同目录 __tests__/ 下
- 使用 Vitest + Testing Library

## 提交前检查
npm run lint && npm test && npm run build
```

### 3.3 最佳实践

**✅ 推荐做法：**
- 简洁明确，避免冗长
- 结构化，使用标题和列表
- 包含具体命令和示例
- 与团队讨论后纳入

**❌ 避免：**
- 过于笼统："写高质量代码"
- 与实际不符的规则
- 敏感信息（密钥、密码）

### 3.4 实战示例

**场景：** 新成员加入团队，希望 AI 生成的代码符合项目规范

**配置 `.cursorrules`：**

```markdown
# 项目规则

## 背景
这是一个电商后台管理系统，前后端分离。

## 技术栈
- 前端：React + TypeScript + Ant Design
- 后端：Node.js + Express + Prisma
- 数据库：PostgreSQL

## API 约定
- 响应格式：{ code: number, data: any, message: string }
- 成功：code = 200
- 失败：code = 错误码（参考 docs/error-codes.md）

## 数据库约定
- 表名：snake_case 复数形式
- 字段名：snake_case
- 主键：id (UUID)
- 时间字段：created_at, updated_at

## 前端约定
- 列表页面统一使用 TablePage 组件
- 表单页面统一使用 FormPage 组件
- 路由配置在 src/router/config.ts
```

**效果：** AI 生成的代码自动符合团队约定，无需每次重复说明。

---

## 四、Skills 用法详解

### 4.1 配置文件

**位置：** `.claude/skills/` 或 `skills/` 目录

**格式：** Markdown 文件，包含 YAML frontmatter

### 4.2 文件结构

```markdown
---
name: skill-name
description: 技能描述，用于 AI 判断何时调用
---

# 技能名称

## 目标
描述这个技能要解决什么问题

## 工作流程
1. 第一步
2. 第二步
3. ...

## 注意事项
- 注意点 1
- 注意点 2
```

### 4.3 实战示例一：API 开发技能

**文件：** `skills/api-development.md`

```markdown
---
name: api-development
description: 开发 RESTful API 接口的技能。当需要创建、修改或重构 API 时使用。
---

# API 开发技能

## 标准流程

### 1. 需求分析
- 确认接口用途和调用方
- 确认请求参数和响应格式
- 确认权限要求

### 2. 路由设计
- RESTful 风格
- 路径：/api/v1/resource
- HTTP 方法语义正确

### 3. 实现步骤
1. 在 src/routes/ 创建路由文件
2. 在 src/controllers/ 创建控制器
3. 在 src/services/ 实现业务逻辑
4. 在 src/types/ 添加类型定义
5. 编写单元测试

### 4. 响应格式
```typescript
// 成功
{ code: 200, data: T, message: "success" }

// 失败
{ code: ErrorCode, data: null, message: "错误描述" }
```

### 5. 错误处理
- 参数校验失败：code = 400
- 未授权：code = 401
- 禁止访问：code = 403
- 资源不存在：code = 404
- 服务器错误：code = 500

## 检查清单
- [ ] 参数校验完整
- [ ] 权限检查到位
- [ ] 错误处理覆盖
- [ ] 日志记录适当
- [ ] 单元测试通过
```

### 4.4 实战示例二：代码审查技能

**文件：** `skills/code-review.md`

```markdown
---
name: code-review
description: 代码审查技能。审查代码质量、安全性、性能和最佳实践。
---

# 代码审查技能

## 审查维度

### 1. 代码质量
- 命名是否清晰
- 逻辑是否简洁
- 是否有重复代码
- 函数是否过长（>50行需拆分）

### 2. 安全性
- 是否有 SQL 注入风险
- 是否有 XSS 风险
- 敏感数据是否加密
- 权限检查是否到位

### 3. 性能
- 是否有 N+1 查询
- 是否有不必要的循环
- 大数据量是否分页
- 是否有内存泄漏风险

### 4. 可维护性
- 是否有足够的注释
- 是否有对应的测试
- 是否符合项目规范
- 依赖是否合理

## 输出格式

### 问题级别
- 🔴 严重：必须修复（安全漏洞、Bug）
- 🟡 警告：建议修复（性能、可读性）
- 🔵 建议：可以考虑（优化建议）

### 输出示例
| 级别 | 文件 | 行号 | 问题 | 建议 |
|------|------|------|------|------|
| 🔴 | auth.ts | 45 | 密码明文存储 | 使用 bcrypt 加密 |
| 🟡 | user.ts | 102 | 循环中查询数据库 | 批量查询优化 |
```

### 4.5 实战示例三：测试生成技能

**文件：** `skills/test-generation.md`

```markdown
---
name: test-generation
description: 生成单元测试的技能。支持 Vitest + Testing Library。
---

# 测试生成技能

## 测试原则
- 测试行为，而非实现
- 覆盖正常路径和异常路径
- 边界条件必须测试
- 快速执行，无外部依赖

## 组件测试模板
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Component } from './Component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    // 断言
  })

  it('should handle click', () => {
    const onClick = vi.fn()
    render(<Component onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

## API 测试模板
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from './app'

describe('GET /api/users', () => {
  it('should return user list', async () => {
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(res.body.code).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
```

## 覆盖率要求
- 工具函数：100%
- 组件：80%
- API：70%
```

---

## 五、Subagent 用法详解

### 5.1 配置文件

**位置：** `.claude/agents/` 或 `agents/` 目录

**格式：** Markdown 文件，包含 YAML frontmatter

### 5.2 核心配置项

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 唯一标识，小写字母和连字符 |
| `description` | ✅ | 描述何时使用此 Agent |
| `tools` | ❌ | 允许使用的工具列表 |
| `disallowedTools` | ❌ | 禁止使用的工具列表 |
| `model` | ❌ | 使用的模型：haiku/sonnet/opus/inherit |
| `permissionMode` | ❌ | 权限模式：default/acceptEdits/plan |
| `maxTurns` | ❌ | 最大执行轮数 |

### 5.3 内置 Subagent

| 名称 | 用途 | 模型 | 工具权限 |
|------|------|------|----------|
| **Explore** | 代码搜索和分析 | Haiku（快速） | 只读 |
| **Plan** | 复杂任务规划 | 继承主会话 | 只读 |
| **General-purpose** | 通用多步骤任务 | 继承主会话 | 全部 |

### 5.4 实战示例一：代码审查 Agent

**文件：** `agents/code-reviewer.md`

```markdown
---
name: code-reviewer
description: 代码审查专家。审查代码质量、安全性和最佳实践。在代码修改后主动调用。
tools: Read, Glob, Grep, Bash
model: sonnet
---

# 代码审查 Agent

## 职责
审查代码修改，发现问题并提供改进建议。

## 工作流程
1. 运行 `git diff` 获取变更
2. 分析变更的文件
3. 逐文件审查
4. 汇总问题并输出报告

## 审查重点
- 代码质量：命名、结构、重复
- 安全性：注入、XSS、权限
- 性能：N+1、循环、内存
- 可维护性：注释、测试、规范

## 输出格式
按严重程度分类：
- 🔴 严重问题（必须修复）
- 🟡 警告（建议修复）
- 🔵 建议（可以考虑）

每个问题包含：文件、行号、描述、建议修改
```

**使用方式：**

```
> 使用 code-reviewer 审查最近的代码变更
```

### 5.5 实战示例二：测试生成 Agent

**文件：** `agents/test-generator.md`

```markdown
---
name: test-generator
description: 测试生成专家。为代码生成单元测试，确保覆盖率达标。
tools: Read, Write, Edit, Bash
model: sonnet
---

# 测试生成 Agent

## 职责
为指定代码生成对应的单元测试。

## 工作流程
1. 分析目标代码结构
2. 识别函数/组件的输入输出
3. 设计测试用例（正常、异常、边界）
4. 生成测试代码
5. 运行测试验证

## 测试原则
- 测试行为，不测实现
- 覆盖所有分支
- 边界条件必测
- 快速执行

## 命名约定
- 测试文件：*.test.ts / *.spec.ts
- 放置位置：同目录 __tests__/ 或同级目录

## 覆盖率目标
- 工具函数：100%
- 组件：80%
```

**使用方式：**

```
> 让 test-generator 为 src/utils/format.ts 生成测试
```

### 5.6 实战示例三：只读探索 Agent

**文件：** `agents/explorer.md`

```markdown
---
name: explorer
description: 代码库探索专家。快速搜索和分析代码，不修改任何文件。
tools: Read, Glob, Grep
model: haiku
---

# 探索 Agent

## 职责
在代码库中搜索和分析代码，帮助理解项目结构。

## 特点
- 只读，不修改文件
- 使用 Haiku 模型，快速响应
- 独立上下文，不污染主会话

## 常用操作
- 查找文件：按名称、内容搜索
- 分析结构：目录、依赖关系
- 追踪调用：函数调用链
- 理解逻辑：代码流程分析

## 输出
返回简洁的分析结果，不包含完整代码。
```

**使用方式：**

```
> 用 explorer 找出项目中所有 API 路由的定义位置
```

### 5.7 实战示例四：重构 Agent

**文件：** `agents/refactor.md`

```markdown
---
name: refactor
description: 代码重构专家。执行安全的代码重构，保留原有行为。
tools: Read, Edit, Write, Bash
model: sonnet
permissionMode: acceptEdits
---

# 重构 Agent

## 职责
执行代码重构，改善代码结构而不改变行为。

## 重构原则
- 小步前进，每次只做一件事
- 每步后运行测试
- 保持向后兼容
- 提交前完整测试

## 常见重构
- 提取函数/组件
- 重命名（变量、函数、文件）
- 移动文件
- 简化条件逻辑
- 消除重复代码

## 工作流程
1. 分析目标代码
2. 制定重构计划
3. 小步执行
4. 每步运行测试
5. 最终验证

## 安全检查
- 测试必须通过
- 类型检查无错误
- Lint 无错误
```

**使用方式：**

```
> 让 refactor 将 src/utils 中的重复代码提取为公共函数
```

---

## 六、组合使用场景

### 场景一：新功能开发

```
Rules 约束 → Skills 指导 → 主会话执行
```

1. **Rules** 定义项目结构和编码规范
2. 调用 **api-development skill** 获取开发流程指导
3. 主会话按流程实现功能
4. 完成后调用 **code-reviewer agent** 审查代码

### 场景二：Bug 修复

```
Rules 约束 → Explorer 探索 → 主会话修复 → Tester 验证
```

1. **Rules** 确保修复符合规范
2. 调用 **explorer agent** 定位问题代码
3. 主会话分析并修复
4. 调用 **test-generator agent** 补充测试

### 场景三：代码重构

```
Plan 规划 → Refactor 执行 → Reviewer 审查
```

1. 启动 **Plan 模式** 制定重构计划
2. 调用 **refactor agent** 执行重构
3. 调用 **code-reviewer agent** 审查结果
4. 人工确认后提交

---

## 七、最佳实践

### 7.1 Rules 编写

```markdown
# ✅ 好的 Rules

## 技术栈
- React 18 + TypeScript

## 禁止
- 禁止 any 类型

## 命令
- 测试：npm test

---

# ❌ 差的 Rules

写高质量代码，遵循最佳实践。
（过于笼统，AI 无法理解）
```

### 7.2 Skills 编写

```markdown
# ✅ 好的 Skill

---
description: 创建 API 接口时使用
---

## 流程
1. 创建路由
2. 创建控制器
3. 编写测试

---

# ❌ 差的 Skill

---
description: 帮助开发
---

（描述不明确，AI 不知道何时调用）
```

### 7.3 Subagent 配置

```markdown
# ✅ 好的 Subagent

---
name: code-reviewer
tools: Read, Grep  # 只读，安全
model: haiku      # 快速，低成本
---

---

# ❌ 差的 Subagent

---
name: reviewer
# 没有限制工具，可能误删文件
# 没有指定模型，可能用昂贵的 Opus 做简单任务
---
```

### 7.4 使用原则

| 原则 | 说明 |
|------|------|
| **最小权限** | Subagent 只给必要的工具权限 |
| **合适模型** | 简单任务用 Haiku，复杂任务用 Sonnet |
| **审查输出** | AI 可能出错，重要修改人工审核 |
| **版本控制** | 配置文件纳入 Git，团队共享 |
| **渐进采用** | 从简单场景开始，逐步扩展 |

---

## 八、总结

| 概念 | 一句话理解 | 配置位置 |
|------|------------|----------|
| **Rules** | 项目的规矩 | 项目根目录 |
| **Skills** | AI 的技能包 | skills/ 目录 |
| **Subagent** | 派出去的助手 | agents/ 目录 |

**核心要点：**

1. **Rules** 约束 AI 行为，确保符合项目规范
2. **Skills** 注入工作流，封装复杂任务步骤
3. **Subagent** 隔离执行，保护主会话上下文

**选择指南：**

- 想让 AI 理解项目 → 写 **Rules**
- 想让 AI 学会一项技能 → 写 **Skills**
- 想派 AI 去独立干活 → 配 **Subagent**

---

## 九、OpenSpec Skill 详解

### 9.1 什么是 OpenSpec？

**OpenSpec** 是一个 **AI 原生的规格驱动开发系统**（AI-native system for spec-driven development）。它提供了一套 CLI 工具和工作流，帮助你在编写代码之前先定义清晰的规格说明。

**核心价值：**
- 让 AI Agent 更好地理解你的需求
- 通过结构化的规格文档指导开发
- 支持从提案 → 规格 → 设计 → 任务的完整工作流

**安装方式：**
```bash
npm install -g @fission-ai/openspec@latest
# 或者使用 npx（推荐，更安全）
npx @fission-ai/openspec
```

**要求：** Node.js >= 20.19.0

### 9.2 核心概念与目录结构

OpenSpec 采用 **渐进式披露** 的方式管理工作流：

```
openspec/
├── config.yaml           # 项目配置
├── changes/              # 变更提案目录
│   └── <change-name>/    # 具体变更
│       ├── proposal.md   # 提案文档
│       ├── spec.md       # 规格说明
│       ├── design.md     # 设计文档
│       └── tasks.md      # 任务列表
```

**四种核心产物：**

| 产物 | 用途 | 何时创建 |
|------|------|----------|
| `proposal.md` | 描述要做什么、为什么做 | 开始新功能时 |
| `spec.md` | 详细的功能规格 | 提案确认后 |
| `design.md` | 技术设计方案 | 规格确认后 |
| `tasks.md` | 具体实现任务 | 设计确认后 |

### 9.3 工作流程示例

#### 场景：开发一个用户认证功能

**Step 1: 创建提案**

```bash
openspec new user-auth
```

这会在 `openspec/changes/user-auth/` 目录下创建提案文件。

**Step 2: 编写提案**

```markdown
# 用户认证功能提案

## 背景
当前系统缺少用户认证机制，任何人都可以访问所有 API。

## 目标
实现基于 JWT 的用户认证系统。

## 范围
- 用户注册
- 用户登录
- Token 验证中间件
- 密码加密存储

## 非目标
- OAuth 第三方登录
- 多因素认证
```

**Step 3: 生成规格**

```bash
openspec spec user-auth
```

AI 会根据提案生成详细的规格文档：

```markdown
# 用户认证规格说明

## API 端点

### POST /auth/register
请求体：
{
  "email": "string",
  "password": "string",
  "name": "string"
}

响应：
- 201: 注册成功
- 400: 参数错误
- 409: 邮箱已存在

### POST /auth/login
请求体：
{
  "email": "string",
  "password": "string"
}

响应：
{
  "token": "jwt_token",
  "user": { ... }
}
```

**Step 4: 设计方案**

```bash
openspec design user-auth
```

生成技术设计：

```markdown
# 用户认证技术设计

## 架构
- 使用 bcrypt 进行密码哈希
- JWT 有效期 7 天
- Token 存储在 HTTP-only Cookie

## 数据库 Schema
users 表：
- id: UUID
- email: VARCHAR(255) UNIQUE
- password_hash: VARCHAR(255)
- created_at: TIMESTAMP

## 中间件
authMiddleware:
1. 从 Cookie 提取 Token
2. 验证 JWT 签名
3. 将 userId 注入 request 对象
```

**Step 5: 任务分解**

```bash
openspec tasks user-auth
```

生成任务列表：

```markdown
# 实现任务

- [ ] 创建 users 表迁移文件
- [ ] 实现 User 模型
- [ ] 实现 register 服务
- [ ] 实现 login 服务
- [ ] 创建 JWT 工具函数
- [ ] 实现 authMiddleware
- [ ] 编写单元测试
- [ ] 编写 API 文档
```

**Step 6: 验证与归档**

```bash
# 验证规格完整性
openspec validate user-auth

# 完成后归档
openspec archive user-auth
```

### 9.4 与 AI Agent 的协作

OpenSpec 的真正威力在于与 AI Agent 配合：

```
你: "帮我实现用户认证功能"

Agent (读取 openspec/changes/user-auth/):
1. 首先读取 proposal.md 理解目标
2. 根据 spec.md 知道 API 格式
3. 按照 design.md 的技术方案实现
4. 逐个完成 tasks.md 中的任务
```

**关键优势：**
- AI 不会"猜"你的需求，规格文档就是上下文
- 规格文档可以被团队评审
- 任务进度可追踪

### 9.5 实际使用示例

#### 示例 1：快速启动新功能

```bash
# 1. 初始化 OpenSpec（如果还没初始化）
openspec init

# 2. 创建新变更
openspec new payment-integration

# 3. 编辑提案（可以用 AI 辅助）
# 编辑 openspec/changes/payment-integration/proposal.md

# 4. 让 AI 生成规格
# 在你的 Agent 中说："根据 proposal.md 生成 spec.md"

# 5. 继续后续步骤...
```

#### 示例 2：与 Claude Code / OpenClaw 配合

在你的项目中安装 OpenSpec skill 后，AI Agent 会自动：

1. **识别 OpenSpec 工作流** - 当你说"我要开发 X 功能"时，它会建议先创建提案
2. **生成规格文档** - 根据你的描述自动生成结构化规格
3. **按任务执行** - 按照 tasks.md 逐个实现

### 9.6 OpenSpec Skill 配置示例

**文件：** `skills/openspec.md`

```markdown
---
name: openspec
description: 规格驱动开发工作流。当开始新功能开发或重大重构时使用，先写规格再写代码。
---

# OpenSpec 工作流

## 何时使用
- 开发新功能
- 重大重构
- API 设计
- 架构决策

## 工作流程

### 1. 创建提案
```bash
openspec new <feature-name>
```
编辑 `openspec/changes/<feature-name>/proposal.md`

### 2. 生成规格
让 AI 根据 proposal 生成 spec.md

### 3. 技术设计
让 AI 根据 spec 生成 design.md

### 4. 任务分解
让 AI 根据 design 生成 tasks.md

### 5. 逐个实现
按照 tasks.md 逐个完成任务

### 6. 验证归档
```bash
openspec validate <feature-name>
openspec archive <feature-name>
```

## 最佳实践
- 提案要简洁，说明"做什么"和"为什么"
- 规格要具体，定义输入输出和边界条件
- 设计要落地，包含具体的技术方案
- 任务要可执行，每个任务 1-4 小时可完成
```

### 9.7 最佳实践总结

| 实践 | 说明 |
|------|------|
| **先提案，后编码** | 永远不要跳过 proposal 阶段 |
| **保持规格简洁** | spec.md 描述"做什么"，不是"怎么做" |
| **设计文档要具体** | design.md 包含技术细节、数据结构、API 签名 |
| **任务粒度适中** | 每个任务应该在 1-4 小时内可完成 |
| **定期归档** | 完成的变更及时归档，保持工作区整洁 |

### 9.8 安全注意事项

1. **验证 npm 包来源** - 安装前检查 `@fission-ai/openspec` 的发布者
2. **推荐使用 npx** - 避免全局安装，使用 `npx @fission-ai/openspec` 更安全
3. **审查生成文件** - 检查 `.claude/skills/` 下自动生成的文件
4. **不要提交敏感信息** - 规格文档中避免包含 API keys、密码等

### 9.9 OpenSpec 与其他概念的关系

```
┌─────────────────────────────────────────────────────┐
│              OpenSpec 工作流                         │
│                                                     │
│  proposal → spec → design → tasks                  │
│     ↓         ↓        ↓        ↓                  │
│   Rules     Skills   Skills   Subagent              │
│  (约束)    (API技能) (设计技能) (执行任务)            │
└─────────────────────────────────────────────────────┘
```

- **Rules** 定义项目规范，约束所有规格文档的风格
- **Skills** 封装生成规格、设计、任务的具体方法
- **Subagent** 隔离执行具体任务，保持主会话清洁

---

## 附录：快速模板

### Rules 模板

```markdown
# 项目规则

## 技术栈
- [填写技术栈]

## 目录结构
- [填写目录约定]

## 编码规范
- [填写规范]

## 禁止事项
- [填写禁止]

## 常用命令
- [填写命令]
```

### Skill 模板

```markdown
---
name: [技能名]
description: [何时使用]
---

# [技能名]

## 目标
[解决什么问题]

## 流程
1. [步骤1]
2. [步骤2]

## 注意事项
- [注意点]
```

### Subagent 模板

```markdown
---
name: [名称]
description: [何时使用]
tools: [工具列表]
model: [模型]
---

# [名称] Agent

## 职责
[负责什么]

## 工作流程
1. [步骤1]
2. [步骤2]

## 输出
[输出格式]
```
