import { createWebHistory, createRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Login from '../pages/shared/Login.vue'
import Register from '../pages/shared/Register.vue'
import Profile from '../pages/client/Profile.vue'
import AuthCallback from '../pages/shared/AuthCallback.vue'

const routes = [
  { 
    path: '/login', 
    name: 'Login',
    component: Login, 
    meta: { requiresGuest: true }  
  },
  { 
    path: '/register', 
    name: 'Register',
    component: Register, 
    meta: { requiresGuest: true } 
  },
  { 
    path: '/profile', 
    name: 'Profile',
    component: Profile, 
    meta: { requiresAuth: true }   
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      try {
        await authStore.refreshAccessToken()
        await authStore.fetchCurrentUser()
        if (!authStore.isAuthenticated) {
          return next({ name: 'Login', query: { redirect: to.fullPath } })
        }
      } catch (error) {
        return next({ name: 'Login' })
      }
    }
  }
  // Route chỉ dành cho guest (chưa login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'Profile' })
  }
  next()
})
export default router