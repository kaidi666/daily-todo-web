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
