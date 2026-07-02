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
      <div className="max-w-screen-xl mx-auto px-16 py-20 border-b border-gray-100">
        <p className="text-[11px] tracking-[.14em] uppercase text-[#8b5e6d] mb-6">
          New collection — 2025
        </p>
        <h1 className="text-6xl font-light leading-[1.1] tracking-tight mb-7 max-w-2xl">
          Dressed for the{' '}
          <span className="font-medium italic">everyday</span>
          {' '}and beyond.
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed max-w-md mb-10">
          Thoughtfully made pieces for modern living. Quality that lasts, style that endures.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/products">
            <button className="bg-[#8b5e6d] text-white text-sm font-medium px-8 py-3 rounded-md hover:opacity-90 transition-opacity border-none cursor-pointer">
              Shop now
            </button>
          </Link>
          <Link
            to="/products"
            className="text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
          >
            View all products →
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-16 py-5">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => searchResults.length && setShowResults(true)}
              placeholder="Search for products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 pr-24 text-sm outline-none focus:border-[#8b5e6d] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8b5e6d] text-white text-xs font-medium px-4 py-2 rounded-md border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              Search
            </button>

            {/* Dropdown */}
            {showResults && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-md z-50 overflow-hidden">
                {searching ? (
                  <p className="px-5 py-4 text-sm text-gray-400">Searching...</p>
                ) : searchResults.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-gray-400">No results found</p>
                ) : (
                  <>
                    {searchResults.slice(0, 5).map(product => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        onClick={() => { setShowResults(false); setSearch('') }}
                        className="flex gap-4 items-center px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors no-underline text-inherit"
                      >
                        <div className="w-9 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                          {product.images?.[0] && (
                            <img
                              src={`http://localhost:8000/storage/${product.images[0]}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-0.5">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category?.name}</p>
                        </div>
                        <p className="text-sm text-[#8b5e6d] font-medium">${product.price}</p>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full px-5 py-3 text-xs text-[#8b5e6d] text-left bg-transparent border-none cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      View all results for "{search}" →
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-screen-xl mx-auto px-16 py-14">
        <p className="text-[11px] tracking-[.1em] uppercase text-gray-400 mb-6">
          Shop by category
        </p>
        <div className="grid grid-cols-4 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="no-underline text-inherit"
            >
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-[#8b5e6d] transition-colors cursor-pointer">
                <p className="text-sm font-medium mb-1">{cat.name}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {cat.products_count} {cat.products_count === 1 ? 'item' : 'items'}
                </p>
                <p className="text-xs text-[#8b5e6d]">Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-screen-xl mx-auto px-16 pb-20">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[11px] tracking-[.1em] uppercase text-gray-400">
            Featured products
          </p>
          <Link
            to="/products"
            className="text-xs text-[#8b5e6d] underline underline-offset-4 hover:opacity-75 transition-opacity"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-x-5 gap-y-8">
          {featured.map(product => (
            <div key={product.id}>
              <Link to={`/products/${product.slug}`} className="no-underline text-inherit">
                <div className="w-full aspect-[3/4] bg-gray-50 rounded-xl mb-4 overflow-hidden group">
                  {product.images?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 tracking-[.06em] uppercase mb-1">
                  {product.category?.name}
                </p>
                <p className="text-sm font-medium mb-1">{product.name}</p>
                <p className="text-sm text-[#8b5e6d] mb-3">${product.price}</p>
              </Link>
              <button
                onClick={() => add(product.id)}
                className="w-full py-2.5 text-xs border border-gray-200 rounded-md hover:border-[#8b5e6d] hover:text-[#8b5e6d] transition-colors bg-white cursor-pointer"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-gray-100 px-16 py-8 flex justify-between items-center max-w-screen-xl mx-auto">
        <span className="text-sm font-medium tracking-widest text-[#8b5e6d]">ASTER</span>
        <span className="text-xs text-gray-400">© 2025 Aster. All rights reserved.</span>
      </div>
    </div>
  )
}