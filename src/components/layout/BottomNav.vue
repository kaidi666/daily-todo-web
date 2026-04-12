<!-- src/components/layout/BottomNav.vue -->
<template>
  <van-tabbar v-model="active" fixed @change="onChange">
    <van-tabbar-item name="today" icon="notes-o">今日</van-tabbar-item>
    <van-tabbar-item name="history" icon="clock-o">历史</van-tabbar-item>
    <van-tabbar-item name="settings" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const active = ref('today')

// 监听路由变化更新 active
watch(
  () => route.name,
  (name) => {
    if (name === 'Detail') {
      active.value = 'history'
    } else if (typeof name === 'string') {
      active.value = name.toLowerCase()
    }
  },
  { immediate: true }
)

function onChange(name: string) {
  router.push({ name: name.charAt(0).toUpperCase() + name.slice(1) })
}
</script>

<style scoped>
:deep(.van-tabbar) {
  background: var(--color-card);
  border-top: 1px solid var(--color-border);
}

:deep(.van-tabbar-item--active) {
  color: var(--color-primary);
}
</style>
