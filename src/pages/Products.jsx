import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../api/products'

export default function Products() {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({
      ...(categorySlug ? { category: categorySlug } : {}),
      ...(search ? { search } : {}),
    })
      .then(res => setProducts(res.data.data))
      .finally(() => setLoading(false))
  }, [categorySlug, search])

  const currentCategory = categories.find(c => c.slug === categorySlug)
  const parentCategory = currentCategory?.parent_id
    ? categories.find(c => c.id === currentCategory.parent_id)
    : null

  return (
    <div className="max-w-screen-xl mx-auto px-10 py-12">

      {/* Page header */}
      <div className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-[11px] text-gray-400 tracking-[.08em] uppercase mb-2">
          {parentCategory ? `${parentCategory.name} · ` : ''}
          {currentCategory ? currentCategory.name : 'All products'}
        </p>
        <h1 className="text-3xl font-medium mb-2">
          {currentCategory ? currentCategory.name : 'Shop'}
        </h1>
        <p className="text-sm text-gray-400">
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-sm">No products found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-x-5 gap-y-10">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group no-underline text-inherit"
            >
              {/* Image */}
              <div className="w-full aspect-[3/4] bg-gray-50 rounded-xl mb-4 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={`http://localhost:8000/storage/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-300">No image</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <p className="text-[11px] text-gray-400 tracking-[.06em] uppercase mb-1">
                {product.category?.name}
              </p>
              <p className="text-sm font-medium mb-1">{product.name}</p>
              <p className="text-sm text-[#8b5e6d]">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}