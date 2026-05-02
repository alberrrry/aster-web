import api from './axios'

export const getCart = () => api.get('/cart')
export const addToCart = (product_id, quantity = 1) => api.post('/cart', { product_id, quantity })
export const updateCartItem = (id, quantity) => api.patch(`/cart/${id}`, { quantity })
export const removeCartItem = (id) => api.delete(`/cart/${id}`)
export const clearCart = () => api.delete('/cart')