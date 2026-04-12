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
import { getMonthDisplay } from '../../utils/date'

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
