// src/utils/storage.ts

import type { AppData, DayRecord } from '../types'

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
