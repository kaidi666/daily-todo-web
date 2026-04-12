# 每日复盘 Web App 设计文档

## 概述

一款面向手机优先场景的轻量 Web 应用，帮助用户随手记录当天做过的事，并在晚上快速完成每日复盘。

## 技术栈

| 类别 | 选择 | 说明 |
|------|------|------|
| 框架 | Vue 3 + TypeScript | 组合式 API、类型安全 |
| 状态管理 | Pinia | Vue 官方推荐、轻量 |
| UI 组件库 | Vant 4 | 移动端优先、设计简洁 |
| 构建工具 | Vite | 快速构建、HMR |
| 路由 | Vue Router 4 | SPA 路由管理 |
| 代码托管 | GitHub | 版本控制、CI/CD |
| 部署平台 | EdgeOne | 静态托管、CDN 加速 |

## 设计风格

### 视觉主题
- **风格**：温暖舒适
- **特点**：米色背景、圆角卡片、柔和阴影、类似日记本风格

### 色彩系统
```
背景色：#faf8f5 (米色)
主色调：#8b7355 (暖棕色)
深色文字：#5a4a3a (深棕)
次要文字：#999999 (灰色)
成功色：#4caf50 (绿色)
边框色：#e0d5c5 (浅棕)
卡片背景：#ffffff (白色)
```

### 字体
- 主字体：系统默认字体栈
- 字号：12px / 14px / 16px / 18px

### 圆角与阴影
- 卡片圆角：8px / 12px
- 按钮圆角：20px (胶囊形)
- 阴影：`0 2px 6px rgba(0,0,0,0.08)`

## 项目结构

```
daily-review/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css   # CSS 变量
│   │       └── global.css      # 全局样式
│   ├── components/
│   │   ├── layout/
│   │   │   └── BottomNav.vue   # 底部导航
│   │   ├── today/
│   │   │   ├── DateHeader.vue  # 日期头部
│   │   │   ├── QuickInput.vue  # 快速输入
│   │   │   ├── ItemList.vue    # 事项列表
│   │   │   └── ReviewSection.vue # 复盘区域
│   │   └── history/
│   │       ├── MonthFilter.vue # 月份筛选
│   │       └── RecordCard.vue  # 记录卡片
│   ├── pages/
│   │   ├── TodayPage.vue       # 今日页
│   │   ├── HistoryPage.vue     # 历史列表页
│   │   ├── DetailPage.vue      # 历史详情页
│   │   └── SettingsPage.vue    # 设置页
│   ├── stores/
│   │   ├── index.ts
│   │   └── record.ts           # 记录状态管理
│   ├── types/
│   │   └── index.ts            # 类型定义
│   ├── utils/
│   │   ├── storage.ts          # 本地存储
│   │   ├── date.ts             # 日期工具
│   │   └── markdown.ts         # Markdown 导入导出
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── App.vue
│   └── main.ts
├── edgeone.json                # EdgeOne 配置
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 数据模型

```typescript
// 单条事项
type RecordItem = {
  id: string;
  text: string;
  createdAt: string;  // ISO 时间戳
  completed: boolean;
};

// 单日记录
type DayRecord = {
  date: string;       // YYYY-MM-DD
  items: RecordItem[];
  summary: string;    // 今天完成了什么
  problems: string;   // 今天遇到了什么问题
  tomorrow: string;   // 明天打算做什么
  updatedAt: string;  // ISO 时间戳
};

// 应用数据
type AppData = {
  version: string;
  days: Record<string, DayRecord>;  // key: YYYY-MM-DD
};
```

## 页面设计

### 1. 今日页 (TodayPage)

**布局**：经典列表式
- 顶部：日期头部（日期 + 星期）
- 中部：快速输入区（输入框 + 添加按钮）
- 下部：事项列表（可勾选、编辑、删除）
- 底部：复盘区域（三个输入框）

**交互**：
- 输入框聚焦弹起键盘
- 回车或点击添加事项
- 点击圆圈切换完成状态
- 长按或点击编辑按钮编辑
- 滑动删除或点击删除按钮
- 复盘区域自动保存（防抖 500ms）

### 2. 历史列表页 (HistoryPage)

**布局**：紧凑列表
- 顶部：标题 + 月份选择器
- 中部：日期卡片列表（倒序）
  - 每张卡片显示：日期、星期、事项数/完成数、复盘状态
- 点击卡片进入详情页

**交互**：
- 月份切换过滤数据
- 下拉刷新
- 滚动加载更多

### 3. 历史详情页 (DetailPage)

**布局**：同今日页，但数据为历史记录
- 显示当天所有事项
- 显示复盘内容
- 支持编辑

### 4. 设置页 (SettingsPage)

**功能**：
- 导出 Markdown
- 导入 Markdown
- 清空本地数据（二次确认）
- 版本信息

## 本地存储

### 存储方案
- 使用 `localStorage`
- Key: `daily-review-data`
- 每次操作立即持久化

### 存储模块 API
```typescript
// 读取全部数据
function loadData(): AppData;

// 保存全部数据
function saveData(data: AppData): void;

// 获取某天记录
function getDayRecord(date: string): DayRecord | null;

// 更新某天记录
function updateDayRecord(date: string, record: DayRecord): void;

// 初始化空数据
function initEmptyData(): AppData;
```

## Markdown 格式

### 导出格式
```markdown
# 2026-04-12

## 事项
- [ ] 开会
- [x] 写日报
- [ ] 买菜

## 今天完成了什么
和客户把需求确认清楚

## 今天遇到了什么问题
下午被杂事打断很多次

## 明天打算做什么
先完成首页原型
```

### 导入规则
- `# 日期` 表示一天记录开始
- `## 事项` 下读取任务列表
- `- [ ]` 与 `- [x]` 对应完成状态
- 其余三个 `##` 标题分别映射三个复盘字段
- 同日期覆盖已有记录

## EdgeOne 部署配置

### edgeone.json
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      { "source": "/**", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          { "key": "Cache-Control", "value": "max-age=31536000" }
        ]
      }
    ]
  }
}
```

### GitHub Actions 自动部署
```yaml
name: Deploy to EdgeOne

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      # EdgeOne 部署步骤（根据 EdgeOne 文档配置）
```

## 开发里程碑

### 第一阶段：今天能记 (P0)
1. 项目初始化（Vue 3 + Vite + Vant）
2. 数据类型定义
3. 本地存储模块
4. 状态管理 (Pinia)
5. 底部导航
6. 今日页布局
7. 快速添加事项
8. 事项列表展示
9. 事项完成状态切换
10. 事项编辑
11. 事项删除
12. 复盘输入区
13. 复盘自动保存

### 第二阶段：过去能看 (P1)
14. 历史列表页
15. 月份筛选
16. 历史详情页

### 第三阶段：数据能带走 (P2)
17. Markdown 导出
18. Markdown 导入
19. 设置页
20. 清空数据功能

### 第四阶段：优化完善 (P3)
21. 移动端体验优化
22. 空状态处理
23. 异常处理
24. EdgeOne 部署配置

## 验收标准

### 功能验收
- [ ] 可添加、编辑、删除、完成事项
- [ ] 复盘内容自动保存
- [ ] 历史记录可查看、筛选、编辑
- [ ] Markdown 导入导出正常
- [ ] 清空数据有二次确认

### 移动端验收
- [ ] 主流手机尺寸（360px-430px）显示正常
- [ ] 输入框聚焦页面不抖动
- [ ] 按钮点击区域足够大
- [ ] 滚动流畅

### 数据验收
- [ ] 刷新页面数据不丢失
- [ ] 首次打开自动初始化
- [ ] 异常数据不导致崩溃
