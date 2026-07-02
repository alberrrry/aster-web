import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[.12em] text-[#8b5e6d] uppercase mb-3">ASTER</p>
          <h1 className="text-2xl font-medium mb-2">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#8b5e6d]/8 border border-[#8b5e6d]/25 rounded-md px-4 py-3 text-sm text-[#8b5e6d] text-center mb-5">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] text-gray-400 tracking-[.04em] uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-[#8b5e6d] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 tracking-[.04em] uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-[#8b5e6d] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b5e6d] text-white rounded-md py-3 text-sm font-medium mt-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#8b5e6d] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}