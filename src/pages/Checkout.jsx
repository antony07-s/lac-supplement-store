import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { LockKeyhole } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import { trackEvent } from '../utils/telemetry.js'

const PENDING_KEY = 'ayusydah-pending-checkout'
const states = ['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah', 'Sarawak', 'Melaka', 'Negeri Sembilan', 'Kedah', 'Kelantan', 'Pahang', 'Perlis', 'Terengganu', 'Putrajaya', 'Labuan']
const blank = (name = '') => ({ fullName: name, phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postcode: '' })
const rm = (value) => `RM ${Number(value || 0).toFixed(2)}`
const readPending = () => { try { return JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') } catch { return null } }

function Checkout() {
  const { cartItems, clearCart } = useCart(); const { user } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState(() => readPending()?.form || blank(user?.name))
  const [order, setOrder] = useState(() => readPending()?.order || null)
  const [quote, setQuote] = useState(() => readPending()?.order || null)
  const [placing, setPlacing] = useState(false); const [paying, setPaying] = useState(false)
  const placingRef = useRef(false); const idempotencyKey = useRef(null)
  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const requestItems = () => cartItems.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity }))
  const items = order?.items || cartItems
  const cartSubtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  const realTotals = order || quote
  const totals = realTotals || { subtotal: cartSubtotal, totalAmount: cartSubtotal }
  useEffect(() => {
    if (order || !form.state || !/^\d{5}$/.test(form.postcode) || !cartItems.length) return
    const quoteItems = cartItems.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity }))
    const timer = setTimeout(() => api.post('/orders/quote', { items: quoteItems, shippingAddress: form }).then((r) => setQuote(r.data)).catch(() => setQuote(null)), 350)
    return () => clearTimeout(timer)
  }, [cartItems, form, order]) // Quote is informational; creation always recalculates server-side.
  if (!user) return <Navigate to="/login?returnTo=/checkout" replace />
  if (!cartItems.length && !order) return <Navigate to="/cart" replace />
  const persist = (nextOrder) => sessionStorage.setItem(PENDING_KEY, JSON.stringify({ order: nextOrder, form }))
  const submit = async (event) => {
    event.preventDefault(); if (placingRef.current) return
    placingRef.current = true; setPlacing(true)
    try {
      idempotencyKey.current ||= crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
      const response = await api.post('/orders', { items: requestItems(), shippingAddress: form }, { headers: { 'Idempotency-Key': idempotencyKey.current } })
      setOrder(response.data); setQuote(response.data); persist(response.data); clearCart(); trackEvent('begin_checkout', { value: response.data.totalAmount, currency: 'MYR', items: response.data.items?.length || 0 })
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to start checkout.'); placingRef.current = false; setPlacing(false) }
  }
  const cancel = async () => {
    if (!order) return
    try { await api.post(`/orders/${order._id}/cancel-payment`) } catch { toast.error('Could not cancel automatically; check your order status.') }
    sessionStorage.removeItem(PENDING_KEY); navigate(`/orders/${order._id}?payment=cancelled`)
  }
  const approve = async (data) => {
    if (paying) return; setPaying(true)
    try {
      const response = await api.post(`/orders/${order._id}/paypal-capture`, { paypalOrderId: data.orderID })
      if (response.data.status !== 'paid') throw new Error('Payment could not be confirmed')
      sessionStorage.removeItem(PENDING_KEY); trackEvent('purchase', { transaction_id: order._id, value: response.data.totalAmount || order.totalAmount, currency: 'MYR' }); navigate(`/orders/${order._id}?payment=success`)
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Payment failed.'); setPaying(false) }
  }
  const input = 'mt-1.5 w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15'
  return <main className="page-shell section-space max-w-6xl overflow-x-hidden"><ol className="mb-6 flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold sm:text-sm"><li className="text-brand-blue">1. Shipping</li><li className="text-stone-400">→ 2. Payment</li><li className="text-stone-400">→ 3. Confirmation</li></ol><div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-7"><h1 className="text-2xl font-bold">{order ? 'Secure payment' : 'Shipping details'}</h1>{!order ? <form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium">Full name *<input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className={input} /></label><label className="block text-sm font-medium">Phone number *<input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={input} /></label><label className="block text-sm font-medium">Address line 1 *<input required value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)} className={input} /></label><label className="block text-sm font-medium">Address line 2 <span className="font-normal text-stone-400">(optional)</span><input value={form.addressLine2} onChange={(e) => set('addressLine2', e.target.value)} className={input} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">City *<input required value={form.city} onChange={(e) => set('city', e.target.value)} className={input} /></label><label className="block text-sm font-medium">Postcode *<input required inputMode="numeric" pattern="[0-9]{5}" value={form.postcode} onChange={(e) => set('postcode', e.target.value.replace(/\D/g, '').slice(0, 5))} className={input} /></label></div><label className="block text-sm font-medium">State *<select required value={form.state} onChange={(e) => set('state', e.target.value)} className={input}><option value="">Select state</option>{states.map((state) => <option key={state}>{state}</option>)}</select></label><button disabled={placing} className="w-full rounded-full bg-brand-blue py-3.5 font-semibold text-white disabled:opacity-60">{placing ? 'Calculating secure total…' : 'Continue to PayPal'}</button><p className="flex justify-center gap-2 text-xs text-stone-500"><LockKeyhole size={14} />Final amounts are verified on our server.</p></form> : <div className="mt-6"><p className="mb-4 text-sm text-stone-600">Review your final total, then pay securely with PayPal.</p>{!import.meta.env.VITE_PAYPAL_CLIENT_ID ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">PayPal is unavailable. Please contact support.</p> : <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'MYR', intent: 'capture' }}><PayPalButtons disabled={paying} style={{ layout: 'vertical', label: 'pay' }} createOrder={async () => (await api.post(`/orders/${order._id}/paypal-order`)).data.orderId} onApprove={approve} onCancel={cancel} onError={() => { setPaying(false); toast.error('PayPal could not be reached. Check your connection and try again.') }} /></PayPalScriptProvider>}{paying && <p className="mt-3 text-sm font-medium text-brand-blue">Confirming your payment securely…</p>}<button type="button" onClick={cancel} disabled={paying} className="mt-4 text-sm font-semibold text-stone-600 underline disabled:opacity-50">Cancel payment</button></div>}</section><aside className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-28"><h2 className="text-lg font-bold">Order summary</h2><div className="mt-4 max-h-72 space-y-3 overflow-y-auto">{items.map((item) => <div key={`${item._id || item.product}-${item.variantId || item.variant || ''}`} className="flex min-w-0 gap-3"><img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-lg border object-contain" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{item.name}</p><p className="text-xs text-stone-500">Qty: {item.quantity}</p></div><span className="shrink-0 text-sm font-semibold">{rm(Number(item.price) * item.quantity)}</span></div>)}</div><div className="mt-5 space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{rm(totals?.subtotal)}</span></div>{realTotals ? <><div className="flex justify-between text-emerald-700"><span>Discount {realTotals.discount ? '(orders over RM1,000)' : ''}</span><span>−{rm(realTotals.discount)}</span></div><div className="flex justify-between"><span>Shipping <small>({realTotals.shippingRegion === 'east-malaysia' ? 'East' : 'West'} Malaysia)</small></span><span>{rm(realTotals.shipping)}</span></div></> : <p className="text-xs text-stone-500">Enter your state and postcode to see shipping cost.</p>}<div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Final total</span><span className="text-brand-blue">{rm(totals?.totalAmount)}</span></div>{realTotals && <p className="text-xs text-stone-500">Weight: {realTotals.totalWeightKg} kg</p>}</div></aside></div></main>
}
export default Checkout
