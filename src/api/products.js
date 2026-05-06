import api from './axios'

export const getProducts = (params) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  )
  return api.get('/products', { params: cleanParams })
}

export const getProduct = (slug) => api.get(`/products/${slug}`)
export const getCategories = () => api.get('/products/categories')
export const getFeatured = () => api.get('/products/featured')