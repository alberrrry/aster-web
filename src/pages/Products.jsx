import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../api/products'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({ search, category })
      .then(res => setProducts(res.data.data))
      .finally(() => setLoading(false))
  }, [search, category])

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      <h1>Aster</h1>
      <h2>Products</h2>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 12px', flex: 1 }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '8px 12px' }}
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {products.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #eee', borderRadius: 8, padding: 16 }}
            >
              <h3 style={{ marginTop: 0 }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: 14 }}>{product.category?.name}</p>
              <p style={{ fontWeight: 'bold' }}>${product.price}</p>
              <p style={{ fontSize: 14, color: product.stock > 0 ? 'green' : 'red' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}