import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios.js'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    if (password !== confirmPassword) return toast.error('Passwords do not match')
    setSaving(true)
    try { const res = await api.post(`/auth/reset-password/${token}`, { password }); toast.success(res.data.message); navigate('/login', { replace: true }) } catch (err) { toast.error(err.response?.data?.message || 'Unable to reset password') } finally { setSaving(false) }
  }
  return <main className="page-shell flex min-h-[65vh] items-center justify-center py-16"><div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-bold text-stone-900">Choose a new password</h1><p className="mt-2 text-sm text-stone-600">Use 8+ characters with uppercase, lowercase, a number, and a symbol.</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-stone-700">New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="8" maxLength="128" autoComplete="new-password" className="mt-1.5 w-full rounded-lg border border-stone-300 px-4 py-2.5" /></label><label className="block text-sm font-semibold text-stone-700">Confirm new password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required autoComplete="new-password" className="mt-1.5 w-full rounded-lg border border-stone-300 px-4 py-2.5" /></label><button disabled={saving} className="w-full rounded-full bg-brand-blue py-3 font-semibold text-white disabled:opacity-60">{saving ? 'Updating...' : 'Update password'}</button></form><Link to="/forgot-password" className="mt-5 inline-block text-sm font-semibold text-brand-blue hover:underline">Request a new link</Link></div></main>
}
export default ResetPassword
