import api from './api.js'

export const eventService = {
  createEvent: (payload) => api.post('/events', payload),
  myEvents: () => api.get('/events/my'),
  completeEvent: (payload) => api.patch('/events/complete', payload),
}

export default eventService

