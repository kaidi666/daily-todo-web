<!-- src/components/today/ItemCard.vue -->
<template>
  <div class="item-card" :class="{ completed: item.completed }">
    <div class="item-checkbox" @click="emit('toggle')">
      <van-icon v-if="item.completed" name="success" />
    </div>

    <div class="item-content">
      <div v-if="!editing" class="item-text" @click="startEdit">
        {{ item.text }}
      </div>
      <van-field
        v-else
        v-model="editText"
        autofocus
        @blur="finishEdit"
        @keyup.enter="finishEdit"
        @keyup.escape="cancelEdit"
      />
      <div class="item-time">{{ formattedTime }}</div>
    </div>

    <div class="item-actions">
      <van-icon name="edit" class="action-btn" @click="startEdit" />
      <van-icon name="delete-o" class="action-btn delete" @click="emit('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RecordItem } from '../../types'
import { formatTime } from '../../utils/date'

const props = defineProps<{
  item: RecordItem
}>()

const emit = defineEmits<{
  toggle: []
  update: [text: string]
  delete: []
}>()

const editing = ref(false)
const editText = ref('')

const formattedTime = computed(() => formatTime(props.item.createdAt))

function startEdit() {
  editText.value = props.item.text
  editing.value = true
}

function finishEdit() {
  if (editText.value.trim() && editText.value !== props.item.text) {
    emit('update', editText.value.trim())
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<style scoped>
.item-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background: var(--color-card);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.item-card.completed {
  opacity: 0.6;
}

.item-card.completed .item-text {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.item-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.item-checkbox .van-icon {
  color: var(--color-primary);
  font-size: 12px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-text {
  font-size: var(--font-md);
  color: var(--color-text);
  word-break: break-all;
  cursor: pointer;
}

.item-time {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

:deep(.van-cell) {
  padding: 0;
}

:deep(.van-field__control) {
  font-size: var(--font-md);
}

.item-actions {
  display: flex;
  gap: var(--spacing-sm);
  opacity: 0;
  transition: opacity 0.2s;
}

.item-card:hover .item-actions,
.item-card:focus-within .item-actions {
  opacity: 1;
}

.action-btn {
  font-size: 18px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.action-btn.delete {
  color: #ee0a24;
}

@media (max-width: 480px) {
  .item-actions {
    opacity: 1;
  }
}
</style>
