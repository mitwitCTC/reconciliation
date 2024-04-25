import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/reconciliation',
          component: () => import('@/views/ReconciliationView.vue')
        },
        {
          path: '/monthlyRental',
          component: () => import('@/views/MonthlyrentalView.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/UserView.vue')
        },
      ]
    },
  ]
})

export default router
