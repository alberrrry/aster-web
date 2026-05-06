import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../api/products'

export default function Products() {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts(categorySlug ? { category: categorySlug } : {})
      .then(res => setProducts(res.data.data))
      .finally(() => setLoading(false))
  }, [categorySlug])

  const currentCategory = categories.find(c => c.slug === categorySlug)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 40, borderBottom: '0.5px solid var(--border)', paddingBottom: 24 }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          {currentCategory?.parent_id ? categories.find(c => c.id === currentCategory.parent_id)?.name + ' · ' : ''}
          {currentCategory ? currentCategory.name : 'All products'}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 500 }}>
          {currentCategory ? currentCategory.name : 'Shop'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No products found in this category.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px 24px',
        }}>
          {products.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Image */}
              <div style={{
                width: '100%',
                aspectRatio: '3/4',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 14,
                overflow: 'hidden',
              }}>
                {product.images?.[0] ? (
                  <img
                    src={`http://localhost:8000/storage/${product.images[0]}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No image</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                {product.category?.name}
              </p>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{product.name}</p>
              <p style={{ fontSize: 14, color: 'var(--accent)' }}>${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}