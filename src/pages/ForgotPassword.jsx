import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios.js'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (sending) return
    setSending(true)
    try { const res = await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() }); toast.success(res.data.message) } catch (err) { toast.error(err.response?.data?.message || 'Unable to request a reset link') } finally { setSending(false) }
  }
  return <main className="page-shell flex min-h-[65vh] items-center justify-center py-16"><div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-bold text-stone-900">Reset your password</h1><p className="mt-2 text-sm leading-6 text-stone-600">Enter your account email and we’ll send a password-reset link.</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-stone-700">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength="254" autoComplete="email" className="mt-1.5 w-full rounded-lg border border-stone-300 px-4 py-2.5" /></label><button disabled={sending} className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white disabled:opacity-60">{sending ? 'Sending...' : 'Send reset link'}</button></form><Link to="/login" className="mt-5 inline-block text-sm font-semibold text-brand-blue hover:underline">Back to sign in</Link></div></main>
}
export default ForgotPassword
