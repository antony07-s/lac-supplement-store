import { Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import { WHATSAPP_HREF } from '../components/ui/WhatsAppButton.jsx'

// Keeps the existing real newsletter endpoint while pairing it with WhatsApp support.
function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (event) => { event.preventDefault(); const value = email.trim().toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(value) || submitting) return toast.error('Enter a valid email address'); setSubmitting(true); try { const response = await api.post('/newsletter', { email: value }); toast.success(response.data.message); setEmail('') } catch (error) { toast.error(error.response?.data?.message || 'Please try again shortly.') } finally { setSubmitting(false) } }
  return <section className="page-shell py-12"><div className="grid overflow-hidden rounded-2xl shadow-sm lg:grid-cols-2"><div className="bg-[#f8e5ac] p-7 sm:p-9"><p className="eyebrow">Stay connected</p><h2 className="mt-2 font-serif text-3xl font-bold text-brand-blue-dark">Join Our Wellness Community</h2><p className="mt-2 text-sm text-stone-600">Get the latest updates on products and wellness.</p><form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" className="min-h-11 flex-1 rounded-lg border border-amber-200 bg-white px-4 text-sm outline-none focus:border-brand-gold" /><button disabled={submitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-gold px-5 text-sm font-extrabold text-white hover:bg-brand-blue disabled:opacity-60"><Mail size={16} />{submitting ? 'Subscribing...' : 'Subscribe'}</button></form></div><div className="bg-[#22a865] p-7 text-white sm:p-9"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20"><MessageCircle size={28} /></span><div><p className="text-sm font-bold uppercase tracking-wide text-white/75">Need Help?</p><h2 className="mt-1 font-serif text-3xl font-bold">Chat with us</h2><p className="mt-2 text-sm text-white/85">Chat with us on WhatsApp for product advice and order support.</p><a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center rounded-full bg-white px-5 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50">Chat on WhatsApp</a></div></div></div></div></section>
}

export default Newsletter
