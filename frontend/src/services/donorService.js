import api from './api.js'

export const donorService = {
  createOrder: (payload) => api.post('/donor/create-order', payload),
  verifyPayment: (payload) => api.post('/donor/verify-payment', payload),
  history: () => api.get('/donor/history'),
  bookDonation: (payload) => api.post('/donor/book-donation', payload),
}

export default donorService

