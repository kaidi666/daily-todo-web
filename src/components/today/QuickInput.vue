<!-- src/components/today/QuickInput.vue -->
<template>
  <div class="quick-input">
    <van-field
      v-model="inputText"
      placeholder="今天做了什么？"
      clearable
      @keyup.enter="handleSubmit"
    >
      <template #button>
        <van-button size="small" type="primary" @click="handleSubmit">
          添加
        </van-button>
      </template>
    </van-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  submit: [text: string]
}>()

const inputText = ref('')

function handleSubmit() {
  if (inputText.value.trim()) {
    emit('submit', inputText.value.trim())
    inputText.value = ''
  }
}
</script>

<style scoped>
.quick-input {
  background: var(--color-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

:deep(.van-cell) {
  padding: var(--spacing-md);
}

:deep(.van-field__control) {
  font-size: var(--font-md);
}

:deep(.van-button--small) {
  padding: 0 16px;
  border-radius: var(--radius-full);
}
</style>
