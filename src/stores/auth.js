import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "../services/auth.js";

export const useAuthStore = defineStore("auth", () => {
  // State
  const accessToken = ref(null)
  const user = ref(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  // Actions
  async function login(credentials) {
    isLoading.value = true;
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        const loginData = result.data.metadata
        accessToken.value = loginData.accessToken;
        console.log(accessToken.value)
        user.value = loginData.user;
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    } finally {
      isLoading.value = false;
    }
  }
  async function logout() {
    isLoading.value = true;
    try {
      const result = await authService.logout();
      if (result.success) {
        accessToken.value = null;
        user.value = null;
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      accessToken.value = null;
      user.value = null;
      isLoading.value = false;
    }
  }

  async function refreshAccessToken() {
    try {
      const result = await authService.processNewToken();
      if (result.success) {
        accessToken.value = result.data.metadata.accessToken;
        return result.data.metadata.accessToken;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  }

  async function fetchCurrentUser() {
    try {
      const result = await authService.fetchCurrentUser()
      
      if (result.success) {
        user.value = result.data.metadata
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  return {
    // State
    accessToken,
    user,
    isLoading,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    refreshAccessToken,
    fetchCurrentUser
  }
});
