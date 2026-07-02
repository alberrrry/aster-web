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
    <div className="flex items-center justify-center py-32 text-sm text-gray-400">
      Loading...
    </div>
  )

  if (!product) return null

  const images = product.images || []

  return (
    <div className="max-w-screen-xl mx-auto px-10 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-10">
        <span className="cursor-pointer hover:text-[#8b5e6d]" onClick={() => navigate('/products')}>Shop</span>
        <span>·</span>
        <span className="cursor-pointer hover:text-[#8b5e6d]" onClick={() => navigate(`/products?category=${product.category?.slug}`)}>
          {product.category?.name}
        </span>
        <span>·</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-16">

        {/* Left — Images */}
        <div>
          <div className="w-full aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden mb-3">
            {images[selectedImage] ? (
              <img
                src={`http://localhost:8000/storage/${images[selectedImage]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-300">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImage === i
                      ? 'ring-[1.5px] ring-[#8b5e6d] opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={`http://localhost:8000/storage/${img}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div className="flex flex-col gap-7">

          {/* Header */}
          <div>
            <p className="text-[11px] text-gray-400 tracking-[.08em] uppercase mb-3">
              {product.category?.name}
            </p>
            <h1 className="text-2xl font-medium mb-3">{product.name}</h1>
            <p className="text-xl text-[#8b5e6d] font-medium">${product.price}</p>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>
          )}

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-[11px] tracking-[.08em] uppercase mb-3 text-gray-400">
                Color — <span className="text-gray-800">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md text-sm border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                    }`}
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
              <p className="text-[11px] tracking-[.08em] uppercase mb-3 text-gray-400">
                Size — <span className="text-gray-800">{selectedSize}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-md text-sm border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-[11px] tracking-[.08em] uppercase mb-3 text-gray-400">Quantity</p>
            <div className="flex items-center border border-gray-200 rounded-md w-fit">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-lg text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-11 h-11 flex items-center justify-center text-lg text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-400">
              {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
            </span>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-[#8b5e6d]">{error}</p>}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`w-full py-4 rounded-md text-sm font-medium text-white transition-all cursor-pointer border-none ${
              added
                ? 'bg-green-500'
                : product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#8b5e6d] hover:opacity-90'
            }`}
          >
            {adding ? 'Adding...' : added ? 'Added to cart ✓' : product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>

          {product.sku && (
            <p className="text-[11px] text-gray-300">SKU: {product.sku}</p>
          )}
        </div>
      </div>
    </div>
  )
}