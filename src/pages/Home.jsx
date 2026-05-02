import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 800, margin: '100px auto', padding: '0 20px' }}>
      <h1>Aster</h1>
      <p>Welcome, {user?.name}! 👋</p>
      <Link to="/products">
        <button style={{ marginRight: 12 }}>Browse Products</button>
      </Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}