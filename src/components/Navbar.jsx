import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount, setIsOpen } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={{
      borderBottom: '0.5px solid var(--border)',
      padding: '0 40px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: '#fff',
      zIndex: 50,
    }}>
      <Link to="/" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '.08em', color: 'var(--accent)' }}>
        ASTER
      </Link>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <Link to="/products" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
          Shop
        </Link>
        {user && (
          <Link to="/orders" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
            Orders
          </Link>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            style={{ fontSize: 13, color: 'var(--text-primary)', background: 'none', border: 'none' }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
            Login
          </Link>
        )}
        {user && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '7px 18px',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </button>
        )}
      </div>
    </nav>
  )
}