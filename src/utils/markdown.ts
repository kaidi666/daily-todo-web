// src/utils/markdown.ts
import type { AppData, DayRecord, RecordItem } from '../types'

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
