import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "../services/auth.js";

export const useAuthStore = defineStore("auth", () => {
  // State - Khởi tạo từ localStorage
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  // Helper function để persist state
  const persistAuthState = (token, userData) => {
    accessToken.value = token
    user.value = userData
    localStorage.setItem('accessToken', token || '')
    localStorage.setItem('user', JSON.stringify(userData || null))
  }

  const clearAuthState = () => {
    accessToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  // Actions
  async function login(credentials) {
    isLoading.value = true;
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        const loginData = result.data.metadata
        persistAuthState(loginData.accessToken, loginData.user)
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

  async function register(userData) {
    isLoading.value = true;
    try {
      const result = await authService.register(userData);
      
      if (result.success && result.data) {
        const registerData = result.data.metadata
        persistAuthState(registerData.accessToken, registerData.user)
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: "Registration failed" };
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState()
      isLoading.value = false;
    }
  }

  async function refreshAccessToken() {
    try {
      const result = await authService.processNewToken();
      if (result.success) {
        persistAuthState(result.data.metadata.accessToken, user.value)
        return result.data.metadata.accessToken;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      clearAuthState()
      throw error;
    }
  }

  async function fetchCurrentUser() {
    try {
      const result = await authService.fetchCurrentUser()
      
      if (result.success) {
        persistAuthState(accessToken.value, result.data.metadata)
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  // Kiểm tra có refresh token không (thông qua cookie)
  const hasRefreshToken = () => {
    return document.cookie.includes('refreshToken=')
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
    register,
    logout,
    refreshAccessToken,
    fetchCurrentUser,
    hasRefreshToken,
    clearAuthState
  }
});
