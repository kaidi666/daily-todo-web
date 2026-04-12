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
import type { HistoryCard } from '../../types'

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
