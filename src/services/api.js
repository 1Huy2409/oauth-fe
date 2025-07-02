import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'
import router from '../router/index.route.js'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
})

api.interceptors.request.use(function (config) {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
});

api.interceptors.response.use(function (response) {
    return response.data;
  }, 
  async function (error) {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            await authStore.refreshAccessToken()
            const newToken = authStore.accessToken
            console.log('New token:', newToken)
            if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
            }
        } catch (refreshError) {
            authStore.logout()
            router.push('/login')
            return Promise.reject(refreshError)
        }
    }
    return Promise.reject(error);
  }
);

export default api;