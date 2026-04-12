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
