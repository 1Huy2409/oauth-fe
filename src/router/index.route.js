import { createWebHistory, createRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Login from '../pages/shared/Login.vue'
import Register from '../pages/shared/Register.vue'
import Profile from '../pages/client/Profile.vue'
import AuthCallback from '../pages/shared/AuthCallback.vue'
import ListUser from '../pages/shared/ListUser.vue'

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
    path: '/users',
    name: 'ListUser', 
    component: ListUser,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/users'
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
      if (authStore.hasRefreshToken()) {
        try {
          await authStore.refreshAccessToken()
          await authStore.fetchCurrentUser()
          if (!authStore.isAuthenticated) {
            return next({ name: 'Login', query: { redirect: to.fullPath } })
          }
        } catch (error) {
          authStore.clearAuthState()
          return next({ name: 'Login' })
        }
      } else {
        return next({ name: 'Login', query: { redirect: to.fullPath } })
      }
    }
  }

  if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      return next({ name: 'ListUser' })
    }
    
    if (authStore.hasRefreshToken()) {
      try {
        await authStore.refreshAccessToken()
        await authStore.fetchCurrentUser()
        if (authStore.isAuthenticated) {
          return next({ name: 'ListUser' })
        }
      } catch (error) {
        authStore.clearAuthState()
      }
    }
  }
  
  next()
})

export default router