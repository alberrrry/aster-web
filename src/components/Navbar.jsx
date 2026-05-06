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
    <nav style={{
      borderBottom: '0.5px solid var(--border)',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Top bar */}
      <div style={{
        padding: '0 40px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '.1em',
          color: 'var(--accent)',
        }}>
          ASTER
        </Link>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {user && (
            <Link to="/orders" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
              Orders
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} style={{
              fontSize: 13,
              color: 'var(--text-primary)',
              background: 'none',
              border: 'none',
            }}>
              Logout
            </button>
          ) : (
            <Link to="/login" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
              Login
            </Link>
          )}
          {user && (
            <button onClick={() => setIsOpen(true)} style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '7px 18px',
              fontSize: 13,
              fontWeight: 500,
            }}>
              Cart {itemCount > 0 && `(${itemCount})`}
            </button>
          )}
        </div>
      </div>

      {/* Category bar */}
      <div style={{
        borderTop: '0.5px solid var(--border)',
        padding: '0 40px',
        display: 'flex',
        gap: 32,
      }}>
        {topLevel.map(cat => {
          const children = getChildren(cat.id)
          return (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveMenu(cat.id)}
              onMouseLeave={() => setActiveMenu(null)}
              style={{ position: 'relative' }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: activeMenu === cat.id ? 'var(--accent)' : 'var(--text-primary)',
                  padding: '12px 0',
                  borderBottom: activeMenu === cat.id ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                  transition: 'color 0.2s',
                }}
              >
                {cat.name}
              </Link>

              {/* Dropdown */}
              {children.length > 0 && activeMenu === cat.id && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: '#fff',
                  border: '0.5px solid var(--border)',
                  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                  padding: '20px 24px',
                  minWidth: 180,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  zIndex: 200,
                }}>
                  {children.map(child => (
                    <Link
                      key={child.id}
                      to={`/products?category=${child.slug}`}
                      style={{
                        display: 'block',
                        fontSize: 13,
                        color: 'var(--text-primary)',
                        padding: '7px 0',
                        borderBottom: '0.5px solid var(--border)',
                      }}
                    >
                      {child.name}
                    </Link>
                  ))}
                  <Link
                    to={`/products?category=${cat.slug}`}
                    style={{
                      display: 'block',
                      fontSize: 12,
                      color: 'var(--accent)',
                      paddingTop: 10,
                      marginTop: 4,
                    }}
                  >
                    View all {cat.name} →
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}