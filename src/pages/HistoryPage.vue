<!-- src/pages/HistoryPage.vue -->
<template>
  <div class="history-page">
    <MonthFilter :month="store.currentMonth" @change="handleMonthChange" />

    <div v-if="store.historyCards.length === 0" class="empty-state">
      <van-icon name="clock-o" size="48" color="#ccc" />
      <p>这个月还没有记录</p>
    </div>

    <RecordCard
      v-for="card in store.historyCards"
      :key="card.date"
      :card="card"
      @click="goToDetail(card.date)"
    />
  </div>
</template>

<script setup lang="ts">
import { useRecordStore } from '../stores/record'
import { useRouter } from 'vue-router'
import MonthFilter from '../components/history/MonthFilter.vue'
import RecordCard from '../components/history/RecordCard.vue'

const store = useRecordStore()
const router = useRouter()

function handleMonthChange(month: string) {
  store.setMonth(month)
}

function goToDetail(date: string) {
  router.push({ name: 'Detail', params: { date } })
}
</script>

<style scoped>
.history-page {
  padding: var(--spacing-md);
  padding-bottom: calc(60px + var(--safe-area-bottom) + var(--spacing-md));
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
