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
