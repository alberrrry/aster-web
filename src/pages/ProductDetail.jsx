import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getProduct(slug)
      .then(res => {
        setProduct(res.data)
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0])
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0])
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize) {
      setError('Please select a size')
      return
    }
    setAdding(true)
    setError(null)
    try {
      await add(product.id, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      setError('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading...
    </div>
  )

  if (!product) return null

  const images = product.images || []

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 40, fontSize: 12, color: 'var(--text-muted)' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/products')}>Shop</span>
        <span>·</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/products?category=${product.category?.slug}`)}>
          {product.category?.name}
        </span>
        <span>·</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>

        {/* Left — Images */}
        <div>
          {/* Main image */}
          <div style={{
            width: '100%',
            aspectRatio: '3/4',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            {images[selectedImage] ? (
              <img
                src={`http://localhost:8000/storage/${images[selectedImage]}`}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No image</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 72,
                    height: 96,
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === i ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'all 0.2s',
                  }}
                >
                  <img
                    src={`http://localhost:8000/storage/${img}`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Header */}
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              {product.category?.name}
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 500, marginBottom: 12 }}>{product.name}</h1>
            <p style={{ fontSize: 22, color: 'var(--accent)', fontWeight: 500 }}>${product.price}</p>
          </div>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {product.description}
            </p>
          )}

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div>
              <p style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--text-muted)' }}>
                Color — <span style={{ color: 'var(--text-primary)' }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedColor === color ? '1.5px solid var(--text-primary)' : '0.5px solid var(--border)',
                      background: selectedColor === color ? 'var(--text-primary)' : '#fff',
                      color: selectedColor === color ? '#fff' : 'var(--text-primary)',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes?.length > 0 && (
            <div>
              <p style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--text-muted)' }}>
                Size — <span style={{ color: 'var(--text-primary)' }}>{selectedSize}</span>
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      border: selectedSize === size ? '1.5px solid var(--text-primary)' : '0.5px solid var(--border)',
                      background: selectedSize === size ? 'var(--text-primary)' : '#fff',
                      color: selectedSize === size ? '#fff' : 'var(--text-primary)',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--text-muted)' }}>
              Quantity
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                −
              </button>
              <span style={{ width: 40, textAlign: 'center', fontSize: 14 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: product.stock > 0 ? '#8aab8a' : '#ccc'
            }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
            </span>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: 13, color: '#c97a7a' }}>{error}</p>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: 14,
              background: added ? '#8aab8a' : undefined,
              transition: 'background 0.3s',
            }}
          >
            {adding ? 'Adding...' : added ? 'Added to cart ✓' : product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>

          {/* SKU */}
          {product.sku && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>SKU: {product.sku}</p>
          )}
        </div>
      </div>
    </div>
  )
}