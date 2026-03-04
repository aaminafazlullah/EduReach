import api from './api.js'

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  schoolRegister: (data) => api.post('/auth/schoolRegister', data),
  volunteerRegister: (data) => api.post('/auth/volunteerRegister', data),
}

export default authService

