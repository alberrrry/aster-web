import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getCategories } from '../api/products'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount, setIsOpen } = useCart()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const topLevel = categories.filter(c => !c.parent_id)
  const getChildren = (parentId) => categories.filter(c => c.parent_id === parentId)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">

      {/* Top bar */}
      <div className="max-w-screen-xl mx-auto px-10 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-medium tracking-widest text-[#8b5e6d]">
          ASTER
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <Link to="/orders" className="text-sm text-gray-800 hover:text-[#8b5e6d] transition-colors">
              Orders
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-800 hover:text-[#8b5e6d] transition-colors bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-sm text-gray-800 hover:text-[#8b5e6d] transition-colors">
              Login
            </Link>
          )}
          {user && (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#8b5e6d] text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity border-none cursor-pointer"
            >
              Cart {itemCount > 0 && `(${itemCount})`}
            </button>
          )}
        </div>
      </div>

      {/* Category bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-10 flex gap-8">
          {topLevel.map(cat => {
            const children = getChildren(cat.id)
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveMenu(cat.id)}
                onMouseLeave={() => setActiveMenu(null)}
                className="relative"
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className={`block text-sm py-3 border-b-[1.5px] transition-colors ${
                    activeMenu === cat.id
                      ? 'text-[#8b5e6d] border-[#8b5e6d]'
                      : 'text-gray-800 border-transparent hover:text-[#8b5e6d]'
                  }`}
                >
                  {cat.name}
                </Link>

                {/* Dropdown */}
                {children.length > 0 && activeMenu === cat.id && (
                  <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-b-xl py-5 px-6 min-w-44 shadow-sm z-50">
                    {children.map(child => (
                      <Link
                        key={child.id}
                        to={`/products?category=${child.slug}`}
                        className="block text-sm text-gray-700 py-2 border-b border-gray-50 hover:text-[#8b5e6d] transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="block text-xs text-[#8b5e6d] pt-3 mt-1"
                    >
                      View all {cat.name} →
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}