# 每日复盘 Web App 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个移动端优先的每日复盘 Web 应用，支持事项记录、复盘、历史查看和 Markdown 导入导出。

**Architecture:** Vue 3 SPA + Pinia 状态管理 + localStorage 持久化。采用经典列表式布局，底部三 Tab 导航。Vite 构建，部署到 EdgeOne 静态托管。

**Tech Stack:** Vue 3, TypeScript, Pinia, Vue Router 4, Vant 4, Vite, localStorage

---

## 文件结构

```
daily-review/
├── .github/workflows/deploy.yml    # GitHub Actions 部署
├── public/favicon.ico
├── src/
│   ├── assets/styles/
│   │   ├── variables.css           # CSS 变量（颜色、间距）
│   │   └── global.css              # 全局样式重置
│   ├── components/
│   │   ├── layout/BottomNav.vue    # 底部导航
│   │   ├── today/
│   │   │   ├── DateHeader.vue      # 日期头部
│   │   │   ├── QuickInput.vue      # 快速输入
│   │   │   ├── ItemList.vue        # 事项列表
│   │   │   ├── ItemCard.vue        # 单条事项
│   │   │   └── ReviewSection.vue   # 复盘区域
│   │   └── history/
│   │       ├── MonthFilter.vue     # 月份筛选
│   │       └── RecordCard.vue      # 记录卡片
│   ├── pages/
│   │   ├── TodayPage.vue           # 今日页
│   │   ├── HistoryPage.vue         # 历史列表
│   │   ├── DetailPage.vue          # 历史详情
│   │   └── SettingsPage.vue        # 设置页
│   ├── stores/
│   │   └── record.ts               # 记录状态管理
│   ├── types/
│   │   └── index.ts                # 类型定义
│   ├── utils/
│   │   ├── storage.ts              # 本地存储
│   │   ├── date.ts                 # 日期工具
│   │   └── markdown.ts             # Markdown 导入导出
│   ├── router/index.ts             # 路由配置
│   ├── App.vue                     # 根组件
│   └── main.ts                     # 入口文件
├── edgeone.json                    # EdgeOne 配置
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Phase 1: 项目初始化与核心功能 (P0)

### Task 1: 项目脚手架初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`

- [ ] **Step 1: 初始化 Vite + Vue 3 + TypeScript 项目**

```bash
cd "c:\Users\test\Desktop\新建文件夹"
npm create vite@latest . -- --template vue-ts
```

- [ ] **Step 2: 安装依赖**

```bash
npm install
npm install vue-router@4 pinia vant@4
npm install -D @vant/auto-import-resolver unplugin-vue-components unplugin-auto-import
```

- [ ] **Step 3: 配置 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
```

- [ ] **Step 4: 验证项目可运行**

```bash
npm run dev
```

Expected: 浏览器打开 http://localhost:5173 显示 Vue 默认页面

- [ ] **Step 5: Commit**

```bash
git init
git add .
git commit -m "chore: init project with Vite + Vue 3 + TypeScript"
```

---

### Task 2: 全局样式系统

**Files:**
- Create: `src/assets/styles/variables.css`
- Create: `src/assets/styles/global.css`
- Modify: `src/main.ts`

- [ ] **Step 1: 创建 CSS 变量文件**

```css
/* src/assets/styles/variables.css */
:root {
  /* 颜色 */
  --color-bg: #faf8f5;
  --color-primary: #8b7355;
  --color-primary-light: #a68b6a;
  --color-text: #5a4a3a;
  --color-text-secondary: #999999;
  --color-border: #e0d5c5;
  --color-card: #ffffff;
  --color-success: #4caf50;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 20px;

  /* 字号 */
  --font-xs: 11px;
  --font-sm: 12px;
  --font-md: 14px;
  --font-lg: 16px;
  --font-xl: 18px;

  /* 阴影 */
  --shadow-card: 0 2px 6px rgba(0, 0, 0, 0.08);

  /* 安全区 */
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
}
```

- [ ] **Step 2: 创建全局样式文件**

```css
/* src/assets/styles/global.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: var(--font-md);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  padding-bottom: calc(50px + var(--safe-area-bottom));
}

input, textarea, button {
  font-family: inherit;
  font-size: inherit;
  border: none;
  outline: none;
  background: transparent;
}

button {
  cursor: pointer;
}

/* Vant 主题覆盖 */
:root:root {
  --van-primary-color: var(--color-primary);
  --van-background: var(--color-bg);
  --van-card-background: var(--color-card);
}
```

- [ ] **Step 3: 在 main.ts 中引入样式**

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'vant/lib/index.css'
import './assets/styles/variables.css'
import './assets/styles/global.css'

const app = createApp(App)
app.mount('#app')
```

- [ ] **Step 4: 验证样式生效**

```bash
npm run dev
```

Expected: 页面背景变为米色

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "style: add global styles and CSS variables"
```

---

### Task 3: 类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
// src/types/index.ts

/** 单条事项 */
export interface RecordItem {
  id: string
  text: string
  createdAt: string  // ISO 时间戳
  completed: boolean
}

/** 单日记录 */
export interface DayRecord {
  date: string       // YYYY-MM-DD
  items: RecordItem[]
  summary: string    // 今天完成了什么
  problems: string   // 今天遇到了什么问题
  tomorrow: string   // 明天打算做什么
  updatedAt: string  // ISO 时间戳
}

/** 应用数据 */
export interface AppData {
  version: string
  days: Record<string, DayRecord>  // key: YYYY-MM-DD
}

/** 历史记录卡片数据 */
export interface HistoryCard {
  date: string
  weekday: string
  totalItems: number
  completedItems: number
  hasReview: boolean
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add type definitions"
```

---

### Task 4: 日期工具函数

**Files:**
- Create: `src/utils/date.ts`

- [ ] **Step 1: 创建日期工具函数**

```typescript
// src/utils/date.ts

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期为显示格式：YYYY-MM-DD 周X
 */
export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr)
  const weekday = WEEKDAYS[date.getDay()]
  return `${dateStr} ${weekday}`
}

/**
 * 格式化时间为 HH:mm
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 获取今天的日期字符串 YYYY-MM-DD
 */
export function getToday(): string {
  return formatDate(new Date())
}

/**
 * 获取星期几
 */
export function getWeekday(dateStr: string): string {
  const date = new Date(dateStr)
  return WEEKDAYS[date.getDay()]
}

/**
 * 获取月份字符串 YYYY-MM
 */
export function getMonthString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * 获取月份显示格式：YYYY年M月
 */
export function getMonthDisplay(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  return `${year}年${parseInt(month)}月`
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/date.ts
git commit -m "feat: add date utility functions"
```

---

### Task 5: 本地存储模块

**Files:**
- Create: `src/utils/storage.ts`

- [ ] **Step 1: 创建本地存储模块**

```typescript
// src/utils/storage.ts
import type { AppData, DayRecord } from '@/types'
import { getToday } from './date'

const STORAGE_KEY = 'daily-review-data'
const CURRENT_VERSION = '1.0.0'

/**
 * 初始化空数据结构
 */
export function initEmptyData(): AppData {
  return {
    version: CURRENT_VERSION,
    days: {},
  }
}

/**
 * 读取全部数据
 */
export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return initEmptyData()
    }
    return JSON.parse(stored) as AppData
  } catch {
    console.error('Failed to load data from localStorage')
    return initEmptyData()
  }
}

/**
 * 保存全部数据
 */
export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data to localStorage', e)
  }
}

/**
 * 获取某天记录，不存在则返回 null
 */
export function getDayRecord(date: string): DayRecord | null {
  const data = loadData()
  return data.days[date] || null
}

/**
 * 获取或创建某天记录
 */
export function getOrCreateDayRecord(date: string): DayRecord {
  const data = loadData()
  if (!data.days[date]) {
    data.days[date] = {
      date,
      items: [],
      summary: '',
      problems: '',
      tomorrow: '',
      updatedAt: new Date().toISOString(),
    }
    saveData(data)
  }
  return data.days[date]
}

/**
 * 更新某天记录
 */
export function updateDayRecord(date: string, record: DayRecord): void {
  const data = loadData()
  record.updatedAt = new Date().toISOString()
  data.days[date] = record
  saveData(data)
}

/**
 * 获取所有日期列表（倒序）
 */
export function getAllDates(): string[] {
  const data = loadData()
  return Object.keys(data.days).sort((a, b) => b.localeCompare(a))
}

/**
 * 获取某月的日期列表
 */
export function getDatesByMonth(monthStr: string): string[] {
  const allDates = getAllDates()
  return allDates.filter(date => date.startsWith(monthStr))
}

/**
 * 清空所有数据
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/storage.ts
git commit -m "feat: add localStorage module"
```

---

### Task 6: Pinia 状态管理

**Files:**
- Create: `src/stores/record.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: 创建记录状态 Store**

```typescript
// src/stores/record.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DayRecord, RecordItem, HistoryCard } from '@/types'
import {
  loadData,
  saveData,
  getOrCreateDayRecord,
  updateDayRecord,
  getAllDates,
  getDatesByMonth,
  clearAllData,
} from '@/utils/storage'
import { getToday, generateId, getWeekday } from '@/utils/date'

export const useRecordStore = defineStore('record', () => {
  // 当前日期
  const currentDate = ref(getToday())

  // 当前日期的记录
  const currentRecord = ref<DayRecord>(getOrCreateDayRecord(currentDate.value))

  // 当前月份
  const currentMonth = ref(currentDate.value.slice(0, 7))

  // 计算属性：历史记录卡片列表
  const historyCards = computed<HistoryCard[]>(() => {
    const dates = getDatesByMonth(currentMonth.value)
    return dates.map(date => {
      const record = getOrCreateDayRecord(date)
      return {
        date,
        weekday: getWeekday(date),
        totalItems: record.items.length,
        completedItems: record.items.filter(item => item.completed).length,
        hasReview: !!(record.summary || record.problems || record.tomorrow),
      }
    })
  })

  /**
   * 切换当前日期
   */
  function setCurrentDate(date: string) {
    currentDate.value = date
    currentRecord.value = getOrCreateDayRecord(date)
  }

  /**
   * 切换到今天
   */
  function goToToday() {
    setCurrentDate(getToday())
  }

  /**
   * 添加事项
   */
  function addItem(text: string) {
    if (!text.trim()) return

    const item: RecordItem = {
      id: generateId(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
    }

    currentRecord.value.items.push(item)
    updateDayRecord(currentDate.value, currentRecord.value)
  }

  /**
   * 切换事项完成状态
   */
  function toggleItem(itemId: string) {
    const item = currentRecord.value.items.find(i => i.id === itemId)
    if (item) {
      item.completed = !item.completed
      updateDayRecord(currentDate.value, currentRecord.value)
    }
  }

  /**
   * 更新事项文本
   */
  function updateItemText(itemId: string, text: string) {
    const item = currentRecord.value.items.find(i => i.id === itemId)
    if (item) {
      item.text = text
      updateDayRecord(currentDate.value, currentRecord.value)
    }
  }

  /**
   * 删除事项
   */
  function deleteItem(itemId: string) {
    const index = currentRecord.value.items.findIndex(i => i.id === itemId)
    if (index > -1) {
      currentRecord.value.items.splice(index, 1)
      updateDayRecord(currentDate.value, currentRecord.value)
    }
  }

  /**
   * 更新复盘字段
   */
  function updateReview(field: 'summary' | 'problems' | 'tomorrow', value: string) {
    currentRecord.value[field] = value
    updateDayRecord(currentDate.value, currentRecord.value)
  }

  /**
   * 切换月份
   */
  function setMonth(monthStr: string) {
    currentMonth.value = monthStr
  }

  /**
   * 清空所有数据
   */
  function clearAll() {
    clearAllData()
    currentDate.value = getToday()
    currentRecord.value = getOrCreateDayRecord(currentDate.value)
    currentMonth.value = currentDate.value.slice(0, 7)
  }

  /**
   * 刷新数据（从 localStorage 重新加载）
   */
  function refresh() {
    currentRecord.value = getOrCreateDayRecord(currentDate.value)
  }

  return {
    currentDate,
    currentRecord,
    currentMonth,
    historyCards,
    setCurrentDate,
    goToToday,
    addItem,
    toggleItem,
    updateItemText,
    deleteItem,
    updateReview,
    setMonth,
    clearAll,
    refresh,
  }
})
```

- [ ] **Step 2: 在 main.ts 中注册 Pinia**

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'vant/lib/index.css'
import './assets/styles/variables.css'
import './assets/styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Pinia store for record management"
```

---

### Task 7: 路由配置

**Files:**
- Create: `src/router/index.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: 创建路由配置**

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/today',
  },
  {
    path: '/today',
    name: 'Today',
    component: () => import('@/pages/TodayPage.vue'),
    meta: { title: '今日' },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/pages/HistoryPage.vue'),
    meta: { title: '历史' },
  },
  {
    path: '/detail/:date',
    name: 'Detail',
    component: () => import('@/pages/DetailPage.vue'),
    meta: { title: '详情' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: '设置' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

- [ ] **Step 2: 在 main.ts 中注册路由**

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import 'vant/lib/index.css'
import './assets/styles/variables.css'
import './assets/styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
```

- [ ] **Step 3: 更新 App.vue**

```vue
<!-- src/App.vue -->
<template>
  <router-view />
  <BottomNav />
</template>

<script setup lang="ts">
import BottomNav from '@/components/layout/BottomNav.vue'
</script>

<style>
/* App 级别样式已在 global.css 中处理 */
</style>
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Vue Router configuration"
```

---

### Task 8: 底部导航组件

**Files:**
- Create: `src/components/layout/BottomNav.vue`

- [ ] **Step 1: 创建底部导航组件**

```vue
<!-- src/components/layout/BottomNav.vue -->
<template>
  <van-tabbar v-model="active" fixed @change="onChange">
    <van-tabbar-item name="today" icon="notes-o">今日</van-tabbar-item>
    <van-tabbar-item name="history" icon="clock-o">历史</van-tabbar-item>
    <van-tabbar-item name="settings" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const active = ref('today')

// 监听路由变化更新 active
watch(
  () => route.name,
  (name) => {
    if (name === 'Detail') {
      active.value = 'history'
    } else if (typeof name === 'string') {
      active.value = name.toLowerCase()
    }
  },
  { immediate: true }
)

function onChange(name: string) {
  router.push({ name: name.charAt(0).toUpperCase() + name.slice(1) })
}
</script>

<style scoped>
:deep(.van-tabbar) {
  background: var(--color-card);
  border-top: 1px solid var(--color-border);
}

:deep(.van-tabbar-item--active) {
  color: var(--color-primary);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/BottomNav.vue
git commit -m "feat: add bottom navigation component"
```

---

### Task 9: 日期头部组件

**Files:**
- Create: `src/components/today/DateHeader.vue`

- [ ] **Step 1: 创建日期头部组件**

```vue
<!-- src/components/today/DateHeader.vue -->
<template>
  <div class="date-header">
    <div class="date-text">{{ formattedDate }}</div>
    <div class="date-weekday">{{ weekday }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getWeekday } from '@/utils/date'

const props = defineProps<{
  date: string
}>()

const formattedDate = computed(() => {
  const [year, month, day] = props.date.split('-')
  return `${year}年${parseInt(month)}月${parseInt(day)}日`
})

const weekday = computed(() => getWeekday(props.date))
</script>

<style scoped>
.date-header {
  text-align: center;
  padding: var(--spacing-lg) var(--spacing-md);
  background: var(--color-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.date-text {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text);
}

.date-weekday {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/today/DateHeader.vue
git commit -m "feat: add date header component"
```

---

### Task 10: 快速输入组件

**Files:**
- Create: `src/components/today/QuickInput.vue`

- [ ] **Step 1: 创建快速输入组件**

```vue
<!-- src/components/today/QuickInput.vue -->
<template>
  <div class="quick-input">
    <van-field
      v-model="inputText"
      placeholder="今天做了什么？"
      clearable
      @keyup.enter="handleSubmit"
    >
      <template #button>
        <van-button size="small" type="primary" @click="handleSubmit">
          添加
        </van-button>
      </template>
    </van-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  submit: [text: string]
}>()

const inputText = ref('')

function handleSubmit() {
  if (inputText.value.trim()) {
    emit('submit', inputText.value.trim())
    inputText.value = ''
  }
}
</script>

<style scoped>
.quick-input {
  background: var(--color-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

:deep(.van-cell) {
  padding: var(--spacing-md);
}

:deep(.van-field__control) {
  font-size: var(--font-md);
}

:deep(.van-button--small) {
  padding: 0 16px;
  border-radius: var(--radius-full);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/today/QuickInput.vue
git commit -m "feat: add quick input component"
```

---

### Task 11: 单条事项组件

**Files:**
- Create: `src/components/today/ItemCard.vue`

- [ ] **Step 1: 创建单条事项组件**

```vue
<!-- src/components/today/ItemCard.vue -->
<template>
  <div class="item-card" :class="{ completed: item.completed }">
    <div class="item-checkbox" @click="emit('toggle')">
      <van-icon v-if="item.completed" name="success" />
    </div>

    <div class="item-content">
      <div v-if="!editing" class="item-text" @click="startEdit">
        {{ item.text }}
      </div>
      <van-field
        v-else
        v-model="editText"
        autofocus
        @blur="finishEdit"
        @keyup.enter="finishEdit"
        @keyup.escape="cancelEdit"
      />
      <div class="item-time">{{ formattedTime }}</div>
    </div>

    <div class="item-actions">
      <van-icon name="edit" class="action-btn" @click="startEdit" />
      <van-icon name="delete-o" class="action-btn delete" @click="emit('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RecordItem } from '@/types'
import { formatTime } from '@/utils/date'

const props = defineProps<{
  item: RecordItem
}>()

const emit = defineEmits<{
  toggle: []
  update: [text: string]
  delete: []
}>()

const editing = ref(false)
const editText = ref('')

const formattedTime = computed(() => formatTime(props.item.createdAt))

function startEdit() {
  editText.value = props.item.text
  editing.value = true
}

function finishEdit() {
  if (editText.value.trim() && editText.value !== props.item.text) {
    emit('update', editText.value.trim())
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<style scoped>
.item-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background: var(--color-card);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.item-card.completed {
  opacity: 0.6;
}

.item-card.completed .item-text {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.item-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.item-checkbox .van-icon {
  color: var(--color-primary);
  font-size: 12px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-text {
  font-size: var(--font-md);
  color: var(--color-text);
  word-break: break-all;
  cursor: pointer;
}

.item-time {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

:deep(.van-cell) {
  padding: 0;
}

:deep(.van-field__control) {
  font-size: var(--font-md);
}

.item-actions {
  display: flex;
  gap: var(--spacing-sm);
  opacity: 0;
  transition: opacity 0.2s;
}

.item-card:hover .item-actions,
.item-card:focus-within .item-actions {
  opacity: 1;
}

.action-btn {
  font-size: 18px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.action-btn.delete {
  color: #ee0a24;
}

@media (max-width: 480px) {
  .item-actions {
    opacity: 1;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/today/ItemCard.vue
git commit -m "feat: add item card component with edit/delete"
```

---

### Task 12: 事项列表组件

**Files:**
- Create: `src/components/today/ItemList.vue`

- [ ] **Step 1: 创建事项列表组件**

```vue
<!-- src/components/today/ItemList.vue -->
<template>
  <div class="item-list">
    <div class="list-header">
      <span class="list-title">今日事项</span>
      <span class="list-count">{{ items.length }} 项</span>
    </div>

    <div v-if="items.length === 0" class="empty-state">
      <van-icon name="notes-o" size="48" color="#ccc" />
      <p>还没有记录，添加第一条吧</p>
    </div>

    <ItemCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @toggle="emit('toggle', item.id)"
      @update="(text) => emit('update', item.id, text)"
      @delete="emit('delete', item.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { RecordItem } from '@/types'
import ItemCard from './ItemCard.vue'

defineProps<{
  items: RecordItem[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [id: string, text: string]
  delete: [id: string]
}>()
</script>

<style scoped>
.item-list {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.list-title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--color-primary);
}

.list-count {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin-top: var(--spacing-md);
  font-size: var(--font-sm);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/today/ItemList.vue
git commit -m "feat: add item list component"
```

---

### Task 13: 复盘区域组件

**Files:**
- Create: `src/components/today/ReviewSection.vue`

- [ ] **Step 1: 创建复盘区域组件**

```vue
<!-- src/components/today/ReviewSection.vue -->
<template>
  <div class="review-section">
    <div class="section-title">今晚复盘</div>

    <div class="review-field">
      <label class="field-label">今天完成了什么</label>
      <van-field
        v-model="localSummary"
        type="textarea"
        rows="2"
        autosize
        placeholder="写下今天的主要成果..."
        @blur="handleUpdate('summary', localSummary)"
      />
    </div>

    <div class="review-field">
      <label class="field-label">今天遇到了什么问题</label>
      <van-field
        v-model="localProblems"
        type="textarea"
        rows="2"
        autosize
        placeholder="遇到的困难或阻碍..."
        @blur="handleUpdate('problems', localProblems)"
      />
    </div>

    <div class="review-field">
      <label class="field-label">明天打算做什么</label>
      <van-field
        v-model="localTomorrow"
        type="textarea"
        rows="2"
        autosize
        placeholder="明天的计划..."
        @blur="handleUpdate('tomorrow', localTomorrow)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  summary: string
  problems: string
  tomorrow: string
}>()

const emit = defineEmits<{
  update: [field: 'summary' | 'problems' | 'tomorrow', value: string]
}>()

const localSummary = ref(props.summary)
const localProblems = ref(props.problems)
const localTomorrow = ref(props.tomorrow)

// 同步外部数据
watch(() => props.summary, (val) => { localSummary.value = val })
watch(() => props.problems, (val) => { localProblems.value = val })
watch(() => props.tomorrow, (val) => { localTomorrow.value = val })

function handleUpdate(field: 'summary' | 'problems' | 'tomorrow', value: string) {
  emit('update', field, value)
}
</script>

<style scoped>
.review-section {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.section-title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.review-field {
  margin-bottom: var(--spacing-md);
}

.review-field:last-child {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

:deep(.van-cell) {
  padding: var(--spacing-sm);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}

:deep(.van-field__control) {
  font-size: var(--font-md);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/today/ReviewSection.vue
git commit -m "feat: add review section component"
```

---

### Task 14: 今日页面

**Files:**
- Create: `src/pages/TodayPage.vue`

- [ ] **Step 1: 创建今日页面**

```vue
<!-- src/pages/TodayPage.vue -->
<template>
  <div class="today-page">
    <DateHeader :date="store.currentDate" />
    <QuickInput @submit="handleAddItem" />
    <ItemList
      :items="store.currentRecord.items"
      @toggle="handleToggle"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    <ReviewSection
      :summary="store.currentRecord.summary"
      :problems="store.currentRecord.problems"
      :tomorrow="store.currentRecord.tomorrow"
      @update="handleReviewUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecordStore } from '@/stores/record'
import DateHeader from '@/components/today/DateHeader.vue'
import QuickInput from '@/components/today/QuickInput.vue'
import ItemList from '@/components/today/ItemList.vue'
import ReviewSection from '@/components/today/ReviewSection.vue'

const store = useRecordStore()

onMounted(() => {
  store.goToToday()
})

function handleAddItem(text: string) {
  store.addItem(text)
}

function handleToggle(id: string) {
  store.toggleItem(id)
}

function handleUpdate(id: string, text: string) {
  store.updateItemText(id, text)
}

function handleDelete(id: string) {
  store.deleteItem(id)
}

function handleReviewUpdate(field: 'summary' | 'problems' | 'tomorrow', value: string) {
  store.updateReview(field, value)
}
</script>

<style scoped>
.today-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
}
</style>
```

- [ ] **Step 2: 验证今日页功能**

```bash
npm run dev
```

Expected:
- 显示今天日期
- 可添加事项
- 可切换完成状态
- 可编辑/删除事项
- 复盘区域可输入并保存

- [ ] **Step 3: Commit**

```bash
git add src/pages/TodayPage.vue
git commit -m "feat: add today page with full functionality"
```

---

## Phase 2: 历史功能 (P1)

### Task 15: 月份筛选组件

**Files:**
- Create: `src/components/history/MonthFilter.vue`

- [ ] **Step 1: 创建月份筛选组件**

```vue
<!-- src/components/history/MonthFilter.vue -->
<template>
  <div class="month-filter">
    <van-icon name="arrow-left" @click="prevMonth" />
    <span class="month-text" @click="showPicker = true">{{ monthDisplay }}</span>
    <van-icon name="arrow-right" @click="nextMonth" />
  </div>

  <van-popup v-model:show="showPicker" position="bottom" round>
    <van-date-picker
      v-model="pickerValue"
      title="选择月份"
      :columns-type="['year', 'month']"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getMonthDisplay } from '@/utils/date'

const props = defineProps<{
  month: string  // YYYY-MM
}>()

const emit = defineEmits<{
  change: [month: string]
}>()

const showPicker = ref(false)
const pickerValue = computed(() => {
  const [year, month] = props.month.split('-')
  return [year, month]
})

const monthDisplay = computed(() => getMonthDisplay(props.month))

function prevMonth() {
  const [year, month] = props.month.split('-').map(Number)
  const date = new Date(year, month - 2)  // month - 1 是当前月，- 2 是上月
  const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  emit('change', newMonth)
}

function nextMonth() {
  const [year, month] = props.month.split('-').map(Number)
  const date = new Date(year, month)  // month 是下个月
  const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  emit('change', newMonth)
}

function onConfirm({ selectedValues }: { selectedValues: string[] }) {
  const [year, month] = selectedValues
  emit('change', `${year}-${month}`)
  showPicker.value = false
}
</script>

<style scoped>
.month-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--color-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.month-text {
  font-size: var(--font-lg);
  font-weight: 500;
  cursor: pointer;
}

:deep(.van-icon) {
  font-size: 20px;
  color: var(--color-primary);
  cursor: pointer;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/history/MonthFilter.vue
git commit -m "feat: add month filter component"
```

---

### Task 16: 记录卡片组件

**Files:**
- Create: `src/components/history/RecordCard.vue`

- [ ] **Step 1: 创建记录卡片组件**

```vue
<!-- src/components/history/RecordCard.vue -->
<template>
  <div class="record-card" @click="emit('click')">
    <div class="card-main">
      <div class="card-date">
        <span class="date-day">{{ day }}</span>
        <span class="date-weekday">{{ card.weekday }}</span>
      </div>
      <div class="card-info">
        <div class="info-stats">
          {{ card.totalItems }} 项 · 完成 {{ card.completedItems }} 项
        </div>
        <div v-if="card.hasReview" class="info-review">
          <van-icon name="passed" /> 已复盘
        </div>
      </div>
    </div>
    <van-icon name="arrow" class="card-arrow" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HistoryCard } from '@/types'

const props = defineProps<{
  card: HistoryCard
}>()

const emit = defineEmits<{
  click: []
}>()

const day = computed(() => {
  const parts = props.card.date.split('-')
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
})
</script>

<style scoped>
.record-card {
  display: flex;
  align-items: center;
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
  transition: transform 0.1s;
}

.record-card:active {
  transform: scale(0.98);
}

.card-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.card-date {
  text-align: center;
  min-width: 50px;
}

.date-day {
  display: block;
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text);
}

.date-weekday {
  display: block;
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}

.card-info {
  flex: 1;
}

.info-stats {
  font-size: var(--font-sm);
  color: var(--color-text);
}

.info-review {
  font-size: var(--font-xs);
  color: var(--color-success);
  margin-top: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.card-arrow {
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/history/RecordCard.vue
git commit -m "feat: add record card component"
```

---

### Task 17: 历史列表页面

**Files:**
- Create: `src/pages/HistoryPage.vue`

- [ ] **Step 1: 创建历史列表页面**

```vue
<!-- src/pages/HistoryPage.vue -->
<template>
  <div class="history-page">
    <MonthFilter :month="store.currentMonth" @change="handleMonthChange" />

    <div v-if="store.historyCards.length === 0" class="empty-state">
      <van-icon name="clock-o" size="48" color="#ccc" />
      <p>这个月还没有记录</p>
    </div>

    <RecordCard
      v-for="card in store.historyCards"
      :key="card.date"
      :card="card"
      @click="goToDetail(card.date)"
    />
  </div>
</template>

<script setup lang="ts">
import { useRecordStore } from '@/stores/record'
import { useRouter } from 'vue-router'
import MonthFilter from '@/components/history/MonthFilter.vue'
import RecordCard from '@/components/history/RecordCard.vue'

const store = useRecordStore()
const router = useRouter()

function handleMonthChange(month: string) {
  store.setMonth(month)
}

function goToDetail(date: string) {
  router.push({ name: 'Detail', params: { date } })
}
</script>

<style scoped>
.history-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin-top: var(--spacing-md);
  font-size: var(--font-sm);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/HistoryPage.vue
git commit -m "feat: add history list page"
```

---

### Task 18: 历史详情页面

**Files:**
- Create: `src/pages/DetailPage.vue`

- [ ] **Step 1: 创建历史详情页面**

```vue
<!-- src/pages/DetailPage.vue -->
<template>
  <div class="detail-page">
    <van-nav-bar
      :title="navTitle"
      left-arrow
      @click-left="router.back()"
    />

    <DateHeader :date="date" />
    <ItemList
      :items="store.currentRecord.items"
      @toggle="handleToggle"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    <ReviewSection
      :summary="store.currentRecord.summary"
      :problems="store.currentRecord.problems"
      :tomorrow="store.currentRecord.tomorrow"
      @update="handleReviewUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecordStore } from '@/stores/record'
import DateHeader from '@/components/today/DateHeader.vue'
import ItemList from '@/components/today/ItemList.vue'
import ReviewSection from '@/components/today/ReviewSection.vue'

const route = useRoute()
const router = useRouter()
const store = useRecordStore()

const date = computed(() => route.params.date as string)

const navTitle = computed(() => {
  const [year, month, day] = date.value.split('-')
  return `${parseInt(month)}月${parseInt(day)}日`
})

onMounted(() => {
  store.setCurrentDate(date.value)
})

function handleToggle(id: string) {
  store.toggleItem(id)
}

function handleUpdate(id: string, text: string) {
  store.updateItemText(id, text)
}

function handleDelete(id: string) {
  store.deleteItem(id)
}

function handleReviewUpdate(field: 'summary' | 'problems' | 'tomorrow', value: string) {
  store.updateReview(field, value)
}
</script>

<style scoped>
.detail-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
}

:deep(.van-nav-bar) {
  background: transparent;
  margin-bottom: var(--spacing-md);
}

:deep(.van-nav-bar__title) {
  color: var(--color-text);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/DetailPage.vue
git commit -m "feat: add history detail page"
```

---

## Phase 3: 导入导出与设置 (P2)

### Task 19: Markdown 工具函数

**Files:**
- Create: `src/utils/markdown.ts`

- [ ] **Step 1: 创建 Markdown 工具函数**

```typescript
// src/utils/markdown.ts
import type { AppData, DayRecord, RecordItem } from '@/types'

/**
 * 将单日记录导出为 Markdown
 */
export function dayRecordToMarkdown(record: DayRecord): string {
  const lines: string[] = []

  // 日期标题
  lines.push(`# ${record.date}`)
  lines.push('')

  // 事项列表
  lines.push('## 事项')
  if (record.items.length === 0) {
    lines.push('无')
  } else {
    record.items.forEach(item => {
      const checkbox = item.completed ? '[x]' : '[ ]'
      lines.push(`- ${checkbox} ${item.text}`)
    })
  }
  lines.push('')

  // 复盘内容
  lines.push('## 今天完成了什么')
  lines.push(record.summary || '无')
  lines.push('')

  lines.push('## 今天遇到了什么问题')
  lines.push(record.problems || '无')
  lines.push('')

  lines.push('## 明天打算做什么')
  lines.push(record.tomorrow || '无')
  lines.push('')

  return lines.join('\n')
}

/**
 * 将全部记录导出为 Markdown
 */
export function exportToMarkdown(data: AppData): string {
  const dates = Object.keys(data.days).sort((a, b) => a.localeCompare(b))
  const contents = dates.map(date => dayRecordToMarkdown(data.days[date]))
  return contents.join('\n---\n\n')
}

/**
 * 解析 Markdown 为单日记录
 */
export function parseMarkdownToDayRecord(markdown: string): DayRecord | null {
  const lines = markdown.split('\n')
  let date = ''
  const items: RecordItem[] = []
  let summary = ''
  let problems = ''
  let tomorrow = ''
  let currentSection = ''

  for (const line of lines) {
    // 日期标题
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      const match = line.match(/^# (\d{4}-\d{2}-\d{2})/)
      if (match) {
        date = match[1]
      }
      continue
    }

    // 章节标题
    if (line.startsWith('## ')) {
      currentSection = line.slice(3).trim()
      continue
    }

    // 解析内容
    if (currentSection === '事项') {
      const match = line.match(/^- \[([ xX])\] (.+)$/)
      if (match) {
        items.push({
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
          text: match[2].trim(),
          createdAt: new Date().toISOString(),
          completed: match[1].toLowerCase() === 'x',
        })
      }
    } else if (currentSection === '今天完成了什么') {
      if (line.trim() && line.trim() !== '无') {
        summary += (summary ? '\n' : '') + line
      }
    } else if (currentSection === '今天遇到了什么问题') {
      if (line.trim() && line.trim() !== '无') {
        problems += (problems ? '\n' : '') + line
      }
    } else if (currentSection === '明天打算做什么') {
      if (line.trim() && line.trim() !== '无') {
        tomorrow += (tomorrow ? '\n' : '') + line
      }
    }
  }

  if (!date) return null

  return {
    date,
    items,
    summary: summary.trim(),
    problems: problems.trim(),
    tomorrow: tomorrow.trim(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * 解析完整 Markdown 文件
 */
export function parseMarkdownFile(content: string): DayRecord[] {
  // 按 --- 分割多个日期
  const sections = content.split(/\n---\n/)
  const records: DayRecord[] = []

  for (const section of sections) {
    const record = parseMarkdownToDayRecord(section.trim())
    if (record) {
      records.push(record)
    }
  }

  return records
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 读取文件内容
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/markdown.ts
git commit -m "feat: add markdown import/export utilities"
```

---

### Task 20: 设置页面

**Files:**
- Create: `src/pages/SettingsPage.vue`

- [ ] **Step 1: 创建设置页面**

```vue
<!-- src/pages/SettingsPage.vue -->
<template>
  <div class="settings-page">
    <div class="settings-group">
      <van-cell-group inset>
        <van-cell title="导出数据" icon="down" is-link @click="handleExport" />
        <van-cell title="导入数据" icon="upgrade" is-link @click="showImport = true" />
        <van-cell title="清空数据" icon="delete-o" is-link @click="showClearConfirm = true" />
      </van-cell-group>
    </div>

    <div class="settings-group">
      <van-cell-group inset>
        <van-cell title="版本" :value="version" />
      </van-cell-group>
    </div>

    <!-- 导入对话框 -->
    <van-popup v-model:show="showImport" position="bottom" round>
      <div class="import-panel">
        <div class="import-title">导入 Markdown 文件</div>
        <van-uploader
          :after-read="handleImport"
          accept=".md"
          max-count="1"
        >
          <van-button type="primary" block>选择文件</van-button>
        </van-uploader>
        <p class="import-hint">导入将覆盖相同日期的记录</p>
      </div>
    </van-popup>

    <!-- 清空确认 -->
    <van-dialog
      v-model:show="showClearConfirm"
      title="确认清空"
      message="清空后所有数据将无法恢复，确定要清空吗？"
      show-cancel-button
      @confirm="handleClear"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRecordStore } from '@/stores/record'
import { loadData, saveData } from '@/utils/storage'
import {
  exportToMarkdown,
  downloadFile,
  readFile,
  parseMarkdownFile,
} from '@/utils/markdown'
import { showSuccessToast, showFailToast } from 'vant'

const store = useRecordStore()
const version = '1.0.0'

const showImport = ref(false)
const showClearConfirm = ref(false)

function handleExport() {
  const data = loadData()
  const markdown = exportToMarkdown(data)
  const filename = `每日复盘_${new Date().toISOString().slice(0, 10)}.md`
  downloadFile(markdown, filename)
  showSuccessToast('导出成功')
}

async function handleImport(file: { file: File }) {
  try {
    const content = await readFile(file.file)
    const records = parseMarkdownFile(content)

    if (records.length === 0) {
      showFailToast('未找到有效数据')
      return
    }

    const data = loadData()
    records.forEach(record => {
      data.days[record.date] = record
    })
    saveData(data)
    store.refresh()

    showImport.value = false
    showSuccessToast(`成功导入 ${records.length} 条记录`)
  } catch (e) {
    showFailToast('导入失败')
    console.error(e)
  }
}

function handleClear() {
  store.clearAll()
  showSuccessToast('已清空')
}
</script>

<style scoped>
.settings-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
}

.settings-group {
  margin-bottom: var(--spacing-lg);
}

:deep(.van-cell-group--inset) {
  margin: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}

:deep(.van-cell__title) {
  color: var(--color-text);
}

:deep(.van-cell__value) {
  color: var(--color-text-secondary);
}

.import-panel {
  padding: var(--spacing-lg);
}

.import-title {
  font-size: var(--font-lg);
  font-weight: 500;
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.import-hint {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  text-align: center;
  margin-top: var(--spacing-md);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/SettingsPage.vue
git commit -m "feat: add settings page with import/export/clear"
```

---

## Phase 4: 部署配置 (P3)

### Task 21: EdgeOne 部署配置

**Files:**
- Create: `edgeone.json`
- Create: `.github/workflows/deploy.yml`
- Create: `public/favicon.ico`

- [ ] **Step 1: 创建 EdgeOne 配置文件**

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
          { "key": "Cache-Control", "value": "max-age=31536000, immutable" }
        ]
      },
      {
        "source": "/**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: 创建 GitHub Actions 部署配置**

```yaml
# .github/workflows/deploy.yml
name: Deploy to EdgeOne

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

  # EdgeOne 部署步骤需要根据 EdgeOne 官方文档配置
  # 参考: https://cloud.tencent.com/document/product/1552
```

- [ ] **Step 3: 更新 package.json 添加构建脚本**

确保 `package.json` 中有以下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 4: 创建 .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
.superpowers/
```

- [ ] **Step 5: 验证构建**

```bash
npm run build
```

Expected: 生成 `dist` 目录，包含 `index.html` 和静态资源

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: add EdgeOne deployment configuration"
```

---

### Task 22: 最终验证与提交

- [ ] **Step 1: 运行开发服务器验证所有功能**

```bash
npm run dev
```

验证清单：
- [ ] 今日页：添加、编辑、删除、完成事项
- [ ] 复盘区域：输入自动保存
- [ ] 历史页：月份筛选、记录列表
- [ ] 详情页：查看和编辑历史记录
- [ ] 设置页：导出、导入、清空数据
- [ ] 刷新页面数据不丢失

- [ ] **Step 2: 构建生产版本**

```bash
npm run build
npm run preview
```

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "feat: complete daily review app v1.0.0"
```

---

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
