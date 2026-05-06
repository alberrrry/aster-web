import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories, getFeatured, getProducts } from '../api/products'
import { useCart } from '../context/CartContext'

export default function Home() {
  const navigate = useNavigate()
  const { add } = useCart()
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.filter(c => !c.parent_id)))
    getFeatured().then(res => setFeatured(res.data))
  }, [])

  // Debounced search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await getProducts({ search })
        setSearchResults(res.data.data)
        setShowResults(true)
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`)
      setShowResults(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div style={{
        padding: '88px 64px 80px',
        borderBottom: '0.5px solid var(--border)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: 24,
        }}>
          New collection — 2025
        </p>
        <h1 style={{
          fontSize: 60,
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-.02em',
          marginBottom: 28,
          maxWidth: 600,
        }}>
          Dressed for the{' '}
          <span style={{ fontWeight: 500, fontStyle: 'italic' }}>everyday</span>
          {' '}and beyond.
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          maxWidth: 420,
          marginBottom: 40,
        }}>
          Thoughtfully made pieces for modern living. Quality that lasts, style that endures.
        </p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/products">
            <button className="btn-primary" style={{ padding: '13px 32px', fontSize: 13 }}>
              Shop now
            </button>
          </Link>
          <Link
            to="/products"
            style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            View all products →
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{
        borderBottom: '0.5px solid var(--border)',
        padding: '20px 64px',
        position: 'relative',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => searchResults.length && setShowResults(true)}
              placeholder="Search for products..."
              style={{ width: '100%', background: 'var(--surface)', border: '0.5px solid var(--border)', padding: '11px 16px', borderRadius: 'var(--radius-md)', fontSize: 13 }}
            />

            {/* Dropdown results */}
            {showResults && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: '#fff',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                zIndex: 200,
                overflow: 'hidden',
              }}>
                {searching ? (
                  <p style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)' }}>Searching...</p>
                ) : searchResults.length === 0 ? (
                  <p style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)' }}>No results found</p>
                ) : (
                  searchResults.slice(0, 5).map(product => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={() => { setShowResults(false); setSearch('') }}
                      style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 20px', borderBottom: '0.5px solid var(--border)', textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{ width: 36, height: 48, borderRadius: 4, overflow: 'hidden', background: 'var(--surface)', flexShrink: 0 }}>
                        {product.images?.[0] && (
                          <img src={`http://localhost:8000/storage/${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{product.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{product.category?.name}</p>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>${product.price}</p>
                    </Link>
                  ))
                )}
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    style={{ width: '100%', padding: '12px 20px', background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    View all results for "{search}" →
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 64px 48px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>
          Shop by category
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 20px',
                  border: '0.5px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{cat.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  {cat.products_count} {cat.products_count === 1 ? 'item' : 'items'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--accent)' }}>Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Featured products
          </p>
          <Link to="/products" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            View all →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px 20px' }}>
          {featured.map(product => (
            <div key={product.id}>
              <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', marginBottom: 14, overflow: 'hidden' }}>
                  {product.images?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${product.images[0]}`}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />
                  )}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {product.category?.name}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{product.name}</p>
                <p style={{ fontSize: 14, color: 'var(--accent)', marginBottom: 12 }}>${product.price}</p>
              </Link>
              <button
                onClick={() => add(product.id)}
                className="btn-secondary"
                style={{ width: '100%', padding: '9px', fontSize: 12 }}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ borderTop: '0.5px solid var(--border)', padding: '32px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '.08em', color: 'var(--accent)' }}>ASTER</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2025 Aster. All rights reserved.</span>
      </div>
    </div>
  )
}