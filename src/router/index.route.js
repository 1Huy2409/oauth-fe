import { createWebHistory, createRouter } from 'vue-router'

import Login from '../pages/shared/Login.vue'
import Register from '../pages/shared/Register.vue'
import Dashboard from '../pages/client/Dashboard.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, requiresAuth: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router