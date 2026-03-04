import api from './api.js'

export const schoolService = {
  createOrUpdateProfile: (payload) => api.post('/school', payload),
  updateProfile: (payload) => api.put('/school', payload),
  addRequirement: (payload) => api.post('/school/requirements', payload),
}

export default schoolService

