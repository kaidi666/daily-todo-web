<!-- src/components/today/ItemList.vue -->
<template>
  <div class="item-list">
    <div class="list-header">
      <span class="list-title">今日事项</span>
      <span class="list-count">{{ items.length }} 项</span>
    </div>

    <div v-if="items.length === 0" class="empty-state">
      <van-icon name="notes-o" size="48" color="#ccc" />
      <p>还没有记录，添加第一条吧</p>
    </div>

    <ItemCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @toggle="emit('toggle', item.id)"
      @update="(text) => emit('update', item.id, text)"
      @delete="emit('delete', item.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { RecordItem } from '../../types'
import ItemCard from './ItemCard.vue'

defineProps<{
  items: RecordItem[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [id: string, text: string]
  delete: [id: string]
}>()
</script>

<style scoped>
.item-list {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.list-title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--color-primary);
}

.list-count {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin-top: var(--spacing-md);
  font-size: var(--font-sm);
}
</style>
