<script setup>
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="space-y-6">
    <!-- User Info Card -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <span class="text-2xl font-bold">
            {{ authStore.user?.fullname?.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h1 class="text-2xl font-bold">{{ authStore.user?.fullname }}</h1>
          <p class="opacity-90">@{{ authStore.user?.username }}</p>
        </div>
      </div>
    </div>

    <!-- User Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Họ và tên</h3>
        <p class="text-lg font-semibold text-gray-900">{{ authStore.user?.fullname }}</p>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
        <p class="text-lg font-semibold text-gray-900">{{ authStore.user?.email }}</p>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Tên đăng nhập</h3>
        <p class="text-lg font-semibold text-gray-900">{{ authStore.user?.username }}</p>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Vai trò</h3>
        <p class="text-lg font-semibold text-gray-900">{{ authStore.user?.role || 'User' }}</p>
      </div>
    </div>
  </div>
</template>
