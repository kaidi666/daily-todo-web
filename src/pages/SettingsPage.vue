<!-- src/pages/SettingsPage.vue -->
<template>
  <div class="settings-page">
    <div class="settings-group">
      <van-cell-group inset>
        <van-cell title="导出数据" icon="down" is-link @click="showExportSheet = true" />
        <van-cell title="导入数据" icon="upgrade" is-link @click="showImport = true" />
        <van-cell title="清空数据" icon="delete-o" is-link @click="showClearConfirm = true" />
      </van-cell-group>
    </div>

    <div class="settings-group">
      <van-cell-group inset>
        <van-cell title="版本" :value="version" />
      </van-cell-group>
    </div>

    <!-- 导出选项弹窗 -->
    <van-action-sheet
      v-model:show="showExportSheet"
      :actions="exportActions"
      cancel-text="取消"
      close-on-click-action
      @select="onExportSelect"
    />

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
import { useRecordStore } from '../stores/record'
import { loadData, saveData, getDayRecord } from '../utils/storage'
import {
  exportToMarkdown,
  dayRecordToMarkdown,
  downloadFile,
  readFile,
  parseMarkdownFile,
} from '../utils/markdown'
import { getToday } from '../utils/date'
import { showSuccessToast, showFailToast } from 'vant'

const store = useRecordStore()
const version = '1.0.0'

const showImport = ref(false)
const showClearConfirm = ref(false)
const showExportSheet = ref(false)

interface ExportAction {
  name: string
  value: string
}

const exportActions: ExportAction[] = [
  { name: '导出今日', value: 'today' },
  { name: '导出全部', value: 'all' },
]

function onExportSelect(action: ExportAction) {
  if (action.value === 'today') {
    handleExportToday()
  } else {
    handleExportAll()
  }
}

function handleExportToday() {
  const today = getToday()
  const record = getDayRecord(today)

  if (!record || record.items.length === 0) {
    showFailToast('今天还没有记录')
    return
  }

  const markdown = dayRecordToMarkdown(record)
  const filename = `每日复盘_${today}.md`
  downloadFile(markdown, filename)
  showSuccessToast('导出成功')
}

function handleExportAll() {
  const data = loadData()
  const dates = Object.keys(data.days)

  if (dates.length === 0) {
    showFailToast('还没有任何记录')
    return
  }

  const markdown = exportToMarkdown(data)
  const filename = `每日复盘_全部_${new Date().toISOString().slice(0, 10)}.md`
  downloadFile(markdown, filename)
  showSuccessToast(`已导出 ${dates.length} 天记录`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleImport(items: any) {
  const item = Array.isArray(items) ? items[0] : items
  if (!item?.file) return

  try {
    const content = await readFile(item.file as File)
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
