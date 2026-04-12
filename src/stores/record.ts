// src/stores/record.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DayRecord, RecordItem, HistoryCard } from '../types'
import {
  loadData,
  saveData,
  getOrCreateDayRecord,
  updateDayRecord,
  getAllDates,
  getDatesByMonth,
  clearAllData,
} from '../utils/storage'
import { getToday, generateId, getWeekday } from '../utils/date'

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
