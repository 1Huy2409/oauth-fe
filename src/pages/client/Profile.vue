<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()
console.log(authStore.user)
console.log(authStore.accessToken)
async function handleLogout() {
  await authStore.logout();
  router.push('/login')
}
</script>
<template>
  <div>
    <button @click="handleLogout">Logout</button>
    <h1>Profile</h1>
  </div>
</template>
