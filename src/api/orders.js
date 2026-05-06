import api from './axios'

export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)
export const createPaymentIntent = (data) => api.post('/orders/payment-intent', data)
export const confirmOrder = (payment_intent_id) => api.post('/orders/confirm', { payment_intent_id })