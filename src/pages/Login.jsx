import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck, Truck, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (loading) return
        const email = form.email.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !form.password) {
            toast.error('Enter your email address and password.')
            return
        }
        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email, password: form.password })
            login(res.data.user, res.data.token)
            toast.success(`Welcome back, ${res.data.user.name}!`)
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed', { id: 'login-error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Brand panel */}
            <div className="hidden lg:flex flex-col justify-between bg-brand-blue text-white p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="text-2xl font-bold">
                        AYUSYDAH<span className="text-brand-gold">.</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        Small rituals. Stronger you.
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Sign in to track your orders, save your favourites, and enjoy faster checkout on every visit.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-white/80">
                        <ShieldCheck size={18} className="text-brand-gold shrink-0" />
                        Secure account, encrypted checkout
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/80">
                        <Truck size={18} className="text-brand-gold shrink-0" />
                        Track every order from your dashboard
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/80">
                        <Leaf size={18} className="text-brand-gold shrink-0" />
                        100% natural, trusted wellness essentials
                    </div>
                </div>

                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
                <div className="absolute top-1/3 -left-16 w-56 h-56 rounded-full bg-white/5" />
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center px-6 py-16 bg-white">
                <div className="w-full max-w-sm">
                    <Link to="/" className="lg:hidden block text-center text-2xl font-bold text-brand-blue mb-8">
                        AYUSYDAH<span className="text-brand-gold">.</span>
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-500 mt-1 mb-8">Login to your Ayusydah account</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                maxLength={254}
                                autoComplete="email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                                <Link to="/coming-soon" className="text-xs text-brand-blue hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-2.5 rounded-lg hover:bg-brand-blue-dark transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-blue font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
