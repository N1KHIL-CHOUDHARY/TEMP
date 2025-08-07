import { useState } from 'react'
import { loginShop } from '../services/api'

export default function Login() {
  const [shopId, setShopId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await loginShop({ shopId, password })
      if (res.success) {
        alert('Login success!')
        // Store login info if needed
      } else {
        setError(res.message || 'Invalid credentials')
      }
    } catch (err) {
      console.error(err)
      setError('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
 <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 text-white transition-all">        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="shopId" className="block text-sm mb-1">Shop ID</label>
            <input
              id="shopId"
              type="text"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              required
              className="w-full bg-neutral-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Powered by <span className="text-indigo-400 font-semibold">Dream Software</span>
        </p>
      </div>
    </div>
  )
}
