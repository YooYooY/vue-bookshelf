import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AllBooks from '@/views/AllBooks.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'all',
    component: AllBooks,
  },
  {
    path: '/finished',
    name: 'finished',
    component: () =>
      import(
        /* webpackChunkName: "finishedBooks" */ '../views/FinishedBooks.vue'
      ),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
