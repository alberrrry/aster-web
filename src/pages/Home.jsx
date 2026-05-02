import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

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
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}