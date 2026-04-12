<!-- src/pages/DetailPage.vue -->
<template>
  <div class="detail-page">
    <van-nav-bar
      :title="navTitle"
      left-arrow
      @click-left="router.back()"
    />

    <DateHeader :date="date" />
    <ItemList
      :items="store.currentRecord.items"
      @toggle="handleToggle"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    <ReviewSection
      :summary="store.currentRecord.summary"
      :problems="store.currentRecord.problems"
      :tomorrow="store.currentRecord.tomorrow"
      @update="handleReviewUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecordStore } from '../stores/record'
import DateHeader from '../components/today/DateHeader.vue'
import ItemList from '../components/today/ItemList.vue'
import ReviewSection from '../components/today/ReviewSection.vue'

const route = useRoute()
const router = useRouter()
const store = useRecordStore()

const date = computed(() => route.params.date as string)

const navTitle = computed(() => {
  const [_year, month, day] = date.value.split('-')
  return `${parseInt(month)}月${parseInt(day)}日`
})

onMounted(() => {
  store.setCurrentDate(date.value)
})

function handleToggle(id: string) {
  store.toggleItem(id)
}

function handleUpdate(id: string, text: string) {
  store.updateItemText(id, text)
}

function handleDelete(id: string) {
  store.deleteItem(id)
}

function handleReviewUpdate(field: 'summary' | 'problems' | 'tomorrow', value: string) {
  store.updateReview(field, value)
}
</script>

<style scoped>
.detail-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
}

:deep(.van-nav-bar) {
  background: transparent;
  margin-bottom: var(--spacing-md);
}

:deep(.van-nav-bar__title) {
  color: var(--color-text);
}
</style>
