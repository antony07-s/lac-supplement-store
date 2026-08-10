import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck, Truck, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post('/auth/register', form)
            login(res.data.user, res.data.token)
            toast.success(`Welcome, ${res.data.user.name}!`)
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
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
                        Join the Ayusydah community
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Create an account for exclusive deals, faster checkout, and a wellness journey tailored to you.
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

                    <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                    <p className="text-sm text-gray-500 mt-1 mb-8">Join Ayusydah in under a minute</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="At least 6 characters"
                                    required
                                    minLength={6}
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

                        <p className="text-xs text-gray-400">
                            By continuing, you agree to our{' '}
                            <Link to="/coming-soon" className="text-brand-blue hover:underline">Terms & Conditions</Link>
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-2.5 rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-60"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-blue font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register