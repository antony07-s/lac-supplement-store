import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

function Checkout() {
  const { cartItems, clearCart, subtotal, total } = useCart()
  const { user } = useAuth()
  const [placing, setPlacing] = useState(false)
  const placingRef = useRef(false)
  const idempotencyKeyRef = useRef(null)
  const [form, setForm] = useState({ fullName: user?.name || '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postcode: '' })

  if (!user) return <Navigate to="/login?returnTo=/checkout" replace />
  if (cartItems.length === 0) return <Navigate to="/cart" replace />

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }) }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (placingRef.current) return
    placingRef.current = true
    setPlacing(true)
    try {
      idempotencyKeyRef.current ||= window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const orderResponse = await api.post('/orders', { items: cartItems.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity })), shippingAddress: form }, { headers: { 'Idempotency-Key': idempotencyKeyRef.current } })
      const order = orderResponse.data
      const checkoutResponse = await api.post(`/orders/${order._id}/checkout-session`)
      clearCart()
      idempotencyKeyRef.current = null
      window.location.href = checkoutResponse.data.url
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
      placingRef.current = false
      setPlacing(false)
    }
  }
  const inputClass = 'mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15'

  return <main className="page-shell section-space max-w-6xl">
    <div className="mb-8 overflow-x-auto"><ol className="flex min-w-max items-center gap-3 text-sm font-semibold"><li className="flex items-center gap-2 text-brand-blue"><span className="grid h-7 w-7 place-items-center rounded-full bg-brand-blue text-xs text-white">1</span>Shipping</li><span className="text-stone-300">→</span><li className="flex items-center gap-2 text-stone-400"><span className="grid h-7 w-7 place-items-center rounded-full border border-stone-300 text-xs">2</span>Payment</li><span className="text-stone-300">→</span><li className="flex items-center gap-2 text-stone-400"><span className="grid h-7 w-7 place-items-center rounded-full border border-stone-300 text-xs">3</span>Confirmation</li></ol></div>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"><h1 className="text-2xl font-bold text-gray-900">Shipping details</h1><p className="mt-1 text-sm text-stone-500">Where should we deliver your order?</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5"><label className="block text-sm font-medium text-gray-700">Full name <span className="text-red-500">*</span><input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className={inputClass} /></label><label className="block text-sm font-medium text-gray-700">Phone number <span className="text-red-500">*</span><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="012-3456789" required className={inputClass} /></label><label className="block text-sm font-medium text-gray-700">Address line 1 <span className="text-red-500">*</span><input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Street address, house number" required className={inputClass} /></label><label className="block text-sm font-medium text-gray-700">Address line 2 <span className="font-normal text-stone-400">(optional)</span><input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Apartment, unit, floor" className={inputClass} /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-gray-700">City <span className="text-red-500">*</span><input type="text" name="city" value={form.city} onChange={handleChange} required className={inputClass} /></label><label className="block text-sm font-medium text-gray-700">Postcode <span className="text-red-500">*</span><input type="text" name="postcode" value={form.postcode} onChange={handleChange} required className={inputClass} /></label></div><label className="block text-sm font-medium text-gray-700">State <span className="text-red-500">*</span><select name="state" value={form.state} onChange={handleChange} required className={inputClass}><option value="">Select state</option>{['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah', 'Sarawak', 'Melaka', 'Negeri Sembilan', 'Kedah', 'Kelantan', 'Pahang', 'Perlis', 'Terengganu', 'Putrajaya', 'Labuan'].map((state) => <option key={state} value={state}>{state}</option>)}</select></label><button type="submit" disabled={placing} className="w-full cursor-pointer rounded-full bg-brand-blue py-3.5 font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60">{placing ? 'Redirecting to payment…' : 'Continue to payment'}</button><p className="flex items-center justify-center gap-2 text-xs text-stone-500"><LockKeyhole size={14} className="text-brand-blue" />Secure checkout powered by Stripe</p></form>
      </section>
      <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-28"><h2 className="text-lg font-bold text-gray-900">Order summary</h2><div className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-1">{cartItems.map((item) => <div key={`${item._id}-${item.variantId || 'default'}`} className="flex gap-3"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-100 bg-stone-50"><img src={item.image} alt={item.name} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>{item.packSize && <p className="mt-0.5 text-xs text-stone-500">{item.packSize}</p>}<p className="mt-1 text-xs text-stone-500">Qty: {item.quantity}</p></div><p className="shrink-0 text-sm font-semibold text-stone-800">RM {(Number(item.price) * item.quantity).toFixed(2)}</p></div>)}</div><div className="mt-5 space-y-3 border-t border-stone-200 pt-4 text-sm"><div className="flex justify-between text-stone-600"><span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span></div><div className="flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span className="text-brand-blue">RM {total.toFixed(2)}</span></div></div></aside>
    </div>
  </main>
}

export default Checkout
