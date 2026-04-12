<!-- src/pages/TodayPage.vue -->
<template>
  <div class="today-page">
    <DateHeader :date="store.currentDate" />
    <QuickInput @submit="handleAddItem" />
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
import { onMounted } from 'vue'
import { useRecordStore } from '../stores/record'
import DateHeader from '../components/today/DateHeader.vue'
import QuickInput from '../components/today/QuickInput.vue'
import ItemList from '../components/today/ItemList.vue'
import ReviewSection from '../components/today/ReviewSection.vue'

const store = useRecordStore()

onMounted(() => {
  store.goToToday()
})

function handleAddItem(text: string) {
  store.addItem(text)
}

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
.today-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
}
</style>
