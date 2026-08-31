import { useCallback, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck, Truck, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleSignInButton from '../components/auth/GoogleSignInButton.jsx'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState('details')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate(); const [searchParams] = useSearchParams(); const { login } = useAuth()
  const redirect = useCallback(() => navigate(searchParams.get('returnTo')?.startsWith('/') ? searchParams.get('returnTo') : '/'), [navigate, searchParams])
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const requestCode = async (event) => {
    event.preventDefault(); if (loading) return
    const name = form.name.trim(); const email = form.email.trim().toLowerCase(); const password = form.password
    if (!/^(?=.{2,100}$)[\p{L}][\p{L}\p{M}' -]*$/u.test(name)) return toast.error('Enter a valid name using letters, spaces, hyphens, or apostrophes.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Enter a valid email address.')
    if (!(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password))) return toast.error('Use 8+ characters with uppercase, lowercase, a number, and a symbol.')
    setLoading(true)
    try { const res = await api.post('/auth/register/request-otp', { name, email, password }); setForm((current) => ({ ...current, name, email })); setStep('verify'); toast.success(res.data.message) } catch (err) { toast.error(err.response?.data?.message || 'Unable to send a verification code.') } finally { setLoading(false) }
  }
  const verifyCode = async (event) => {
    event.preventDefault(); if (loading) return
    if (!/^\d{6}$/.test(code)) return toast.error('Enter the six-digit code from your email.')
    setLoading(true)
    try { const res = await api.post('/auth/register/verify-otp', { email: form.email, code }); login(res.data.user, res.data.token); toast.success(`Welcome, ${res.data.user.name}!`); redirect() } catch (err) { toast.error(err.response?.data?.message || 'Unable to verify your email.') } finally { setLoading(false) }
  }
  const handleGoogleCredential = useCallback(async ({ credential }) => {
    if (!credential || loading) return; setLoading(true)
    try { const res = await api.post('/auth/google', { credential }); login(res.data.user, res.data.token); toast.success(`Welcome, ${res.data.user.name}!`); redirect() } catch (err) { toast.error(err.response?.data?.message || 'Google sign-in failed. Please try again.') } finally { setLoading(false) }
  }, [loading, login, redirect])

  return <div className="min-h-screen grid lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden bg-brand-blue p-12 text-white lg:flex lg:flex-col lg:justify-between"><Link to="/" className="relative z-10 text-2xl font-bold">AYUSYDAH<span className="text-brand-gold">.</span></Link><div className="relative z-10 max-w-md"><h2 className="mb-4 text-3xl font-bold leading-tight">Join the Ayusydah community</h2><p className="text-sm leading-relaxed text-white/80">Create an account for exclusive deals, faster checkout, and a wellness journey tailored to you.</p></div><div className="relative z-10 space-y-4 text-sm text-white/80"><p className="flex items-center gap-3"><ShieldCheck size={18} className="text-brand-gold" />Secure account, encrypted checkout</p><p className="flex items-center gap-3"><Truck size={18} className="text-brand-gold" />Track every order from your dashboard</p><p className="flex items-center gap-3"><Leaf size={18} className="text-brand-gold" />100% natural, trusted wellness essentials</p></div><div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5" /></aside>
    <main className="flex items-center justify-center bg-white px-6 py-16"><div className="w-full max-w-sm"><Link to="/" className="mb-8 block text-center text-2xl font-bold text-brand-blue lg:hidden">AYUSYDAH<span className="text-brand-gold">.</span></Link>
      {step === 'details' ? <><h1 className="text-2xl font-bold text-gray-900">Create your account</h1><p className="mb-8 mt-1 text-sm text-gray-500">We’ll verify your email before creating your account.</p><form onSubmit={requestCode} className="space-y-5"><label className="block text-sm font-medium text-gray-700">Full name <span className="text-red-500">*</span><input name="name" value={form.name} onChange={change} required minLength="2" maxLength="100" autoComplete="name" className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" /></label><label className="block text-sm font-medium text-gray-700">Email address <span className="text-red-500">*</span><input name="email" type="email" value={form.email} onChange={change} required maxLength="254" autoComplete="email" className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" /></label><label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span><span className="relative mt-1.5 block"><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={change} required minLength="8" maxLength="128" autoComplete="new-password" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label><p className="text-xs text-gray-400">Use 8+ characters with uppercase, lowercase, a number, and a symbol.</p><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-2.5 font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{loading ? 'Sending code…' : 'Continue'}</button></form><div className="my-6 flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200" />or<span className="h-px flex-1 bg-gray-200" /></div><GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} /></> : <><h1 className="text-2xl font-bold text-gray-900">Verify your email</h1><p className="mb-8 mt-1 text-sm text-gray-500">Enter the six-digit code sent to <strong>{form.email}</strong>.</p><form onSubmit={verifyCode} className="space-y-5"><label className="block text-sm font-medium text-gray-700">Verification code<input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" autoFocus required className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.45em] focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" /></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-2.5 font-semibold text-white disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{loading ? 'Verifying…' : 'Verify and create account'}</button><button type="button" disabled={loading} onClick={() => { setStep('details'); setCode('') }} className="w-full text-sm font-semibold text-brand-blue hover:underline">Use a different email</button></form></>}
      <p className="mt-8 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-semibold text-brand-blue hover:underline">Sign in</Link></p>
    </div></main>
  </div>
}

export default Register
