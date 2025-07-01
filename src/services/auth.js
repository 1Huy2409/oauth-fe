import api from './api.js'

export default {
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials)
            return {
                success: true,
                data: response
            }
        }
        catch (error) {
            console.log(error.response.data.message)
            let errorMessage = error.response.data.message
            
            return {
                success: false,
                error: errorMessage
            }
        }
    },
    async register(credentials) {
        try {
            const response = await api.post('/auth/register', credentials)
            return {
                success: true,
                data: response
            }
        }
        catch (error) {
            let errorMessage = error.response.data.message
            
            return {
                success: false,
                error: errorMessage
            }
        }
    },
    async logout() {
        try {
            const response = await api.post('/auth/logout')
            return {
                success: true,
                message: response?.message || 'Đăng xuất thành công'
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.message || 'Đăng xuất thất bại'
            }
        }
    },
    async processNewToken() {
        try {
          const response = await api.post('/auth/processNewToken')
          return {
            success: true,
            data: response
          }
        } catch (error) {
          return {
            success: false,
            error: error.response?.message || 'Token refresh failed'
          }
        }
      },
    async fetchCurrentUser() {
        try {
            const response = await api.get('/users/me')
            return {
                success: true,
                data: response
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.message || 'Get user failed'
            }
        }
    }
}