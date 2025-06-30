import api from './api.js'

export default {
    async login(credentials) {
        console.log('🔐 Login attempt with:', credentials)
        try {
            const response = await api.post('/auth/login', credentials)
            return {
                success: true,
                data: response
            }
        }
        catch (error) {
            let errorMessage = 'Đăng nhập thất bại'
            
            if (error.response?.message) {
                errorMessage = error.response.message
            } else if (error.response?.status === 401) {
                errorMessage = 'Sai tên đăng nhập hoặc mật khẩu'
            } else if (error.response?.status === 404) {
                errorMessage = 'Tài khoản không tồn tại'
            }
            
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
    // async register(credentials) {
    //     const response = await api.post('/auth/register', credentials)
    //     return response.data
    // },
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