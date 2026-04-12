<!-- src/components/today/DateHeader.vue -->
<template>
  <div class="date-header">
    <div class="date-text">{{ formattedDate }}</div>
    <div class="date-weekday">{{ weekday }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getWeekday } from '../../utils/date'

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
