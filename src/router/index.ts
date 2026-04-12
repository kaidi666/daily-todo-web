// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/today',
  },
  {
    path: '/today',
    name: 'Today',
    component: () => import('../pages/TodayPage.vue'),
    meta: { title: '今日' },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../pages/HistoryPage.vue'),
    meta: { title: '历史' },
  },
  {
    path: '/detail/:date',
    name: 'Detail',
    component: () => import('../pages/DetailPage.vue'),
    meta: { title: '详情' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../pages/SettingsPage.vue'),
    meta: { title: '设置' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
