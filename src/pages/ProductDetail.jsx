import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { add } = useCart()

  useEffect(() => {
    getProduct(slug)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p style={{ margin: 40 }}>Loading...</p>
  if (!product) return null

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <button onClick={() => navigate('/products')} style={{ marginBottom: 24 }}>← Back to products</button>
      <h1>{product.name}</h1>
      <p style={{ color: '#666' }}>{product.category?.name}</p>
      <p style={{ fontSize: 24, fontWeight: 'bold' }}>${product.price}</p>
      <p style={{ fontSize: 14, color: product.stock > 0 ? 'green' : 'red' }}>
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <p style={{ lineHeight: 1.6 }}>{product.description}</p>
      <button
  onClick={() => add(product.id)}
  disabled={product.stock === 0}
  style={{ marginTop: 24, padding: '12px 32px', fontSize: 16, cursor: 'pointer' }}
>
  {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
</button>
    </div>
  )
}