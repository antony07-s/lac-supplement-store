import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success('Login submitted — demo only, no backend connected yet')
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="text-center mb-8">
                    <span className="text-2xl font-bold text-brand-blue">AYUSYDAH<span className="text-brand-gold">.</span></span>
                    <h1 className="text-xl font-semibold text-gray-800 mt-4">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Login to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                        />
                    </div>

                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/coming-soon" className="text-xs text-brand-blue hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-blue text-white font-semibold py-3 rounded-full hover:bg-brand-blue-dark transition-colors"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand-blue font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
