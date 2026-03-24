import api from './api.js'

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  schoolRegister: (data) => api.post('/auth/school/register', data),
  volunteerRegister: (data) => api.post('/auth/volunteer/register', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerificationEmail: (email) => api.post('/auth/resend-verification-email', { email }),
}

export default authService

