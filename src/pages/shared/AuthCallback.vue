<template>
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div v-if="isLoading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p>Đang xử lý đăng nhập...</p>
        </div>
        
        <div v-else-if="error" class="space-y-4">
          <div class="text-red-600">
            <svg class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-semibold">Đăng nhập thất bại</p>
            <p class="text-sm text-gray-600">{{ error }}</p>
          </div>
          <Button @click="redirectToLogin" class="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { Button } from '@/components/ui/button'
  
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  
  const isLoading = ref(true)
  const error = ref('')
  
  const redirectToLogin = () => {
    router.push('/login')
  }
  
  onMounted(async () => {
    try {
      const { token, user } = route.query
      
      if (!token || !user) {
        throw new Error('Thiếu thông tin xác thực')
      }
  
      // Parse user data
      const userData = JSON.parse(decodeURIComponent(user))
      
      // Set auth data
      authStore.persistAuthState(token, {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        username: userData.username,
        role: userData.role
      })
      
      // Redirect to profile
      setTimeout(() => {
        router.push('/users')
      }, 1000)
      
    } catch (err) {
      error.value = err.message || 'Có lỗi xảy ra trong quá trình đăng nhập'
      console.error('OAuth callback error:', err)
    } finally {
      isLoading.value = false
    }
  })
  </script>