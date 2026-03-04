import api from './api.js'

export const adminService = {
  pending: () => api.get('/admin/pending'),
  approveSchool: (payload) => api.post('/admin/approve-school', payload),
  approveVolunteer: (payload) => api.post('/admin/approve-volunteer', payload),
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
}

export default adminService

