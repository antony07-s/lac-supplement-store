import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { ChevronLeft, LockKeyhole } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api, { setRequestTimeout } from '../api/axios.js'
import { trackEvent } from '../utils/telemetry.js'
import { cloudinaryImage, cloudinarySrcSet } from '../utils/cloudinaryImage.js'

const PENDING_KEY = 'ayusydah-pending-checkout'
const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'
const malaysiaStates = ['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah', 'Sarawak', 'Melaka', 'Negeri Sembilan', 'Kedah', 'Kelantan', 'Pahang', 'Perlis', 'Terengganu', 'Putrajaya', 'Labuan']
const indiaStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry']
const blank = (name = '') => ({ fullName: name, phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postcode: '', country: 'Malaysia' })
const formatRm = (value) => `RM ${Number(value || 0).toFixed(2)}`
const readPending = () => { try { return JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') } catch { return null } }

let razorpayLoader
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (razorpayLoader) return razorpayLoader
  razorpayLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.async = true
    script.onload = () => window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay checkout did not load'))
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout'))
    document.head.appendChild(script)
  })
  return razorpayLoader
}

function Checkout() {
  const { cartItems, clearCart } = useCart()
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const [pending] = useState(readPending)
  const [form, setForm] = useState(() => pending?.form || blank(user?.name))
  const [order, setOrder] = useState(() => pending?.order || null)
  const [quote, setQuote] = useState(() => pending?.order || null)
  const [checkingSavedOrder, setCheckingSavedOrder] = useState(Boolean(pending?.order?._id))
  const [savedOrderError, setSavedOrderError] = useState('')
  const [placing, setPlacing] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paymentOptions, setPaymentOptions] = useState({ loading: Boolean(pending?.order), razorpay: false })
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [razorpayMessage, setRazorpayMessage] = useState('')
  const [restartingCheckout, setRestartingCheckout] = useState(false)
  const placingRef = useRef(false)
  const idempotencyKey = useRef(null)
  const razorpayCompleted = useRef(false)

  useEffect(() => {
    const savedOrderId = pending?.order?._id
    if (!savedOrderId || !authReady || !user) return

    let active = true
    api.get(`/orders/${savedOrderId}`)
      .then((response) => {
        if (!active) return
        const currentOrder = response.data
        if (currentOrder.status === 'pending') {
          setOrder(currentOrder)
          setQuote(currentOrder)
          return
        }

        sessionStorage.removeItem(PENDING_KEY)
        setOrder(null)
        setQuote(null)
        if (['paid', 'shipped', 'delivered', 'refunded'].includes(currentOrder.status)) {
          navigate(`/orders/${savedOrderId}`, { replace: true })
          return
        }
        toast.error('Your previous checkout was cancelled. Review your bag and enter shipping details to start again.')
      })
      .catch((error) => {
        if (!active) return
        if ([401, 403, 404].includes(error.response?.status)) {
          sessionStorage.removeItem(PENDING_KEY)
          setOrder(null)
          setQuote(null)
          toast.error('We could not restore that checkout. Please review your bag and start again.')
          return
        }
        setSavedOrderError('We could not verify your saved order. Reload this page before continuing to payment.')
      })
      .finally(() => { if (active) setCheckingSavedOrder(false) })

    return () => { active = false }
  }, [pending, authReady, user, navigate])

  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const requestItems = () => cartItems.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity }))
  const persist = (nextOrder) => sessionStorage.setItem(PENDING_KEY, JSON.stringify({ order: nextOrder, form }))
  const items = order?.items || cartItems
  const cartSubtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  const realTotals = order || quote
  const totals = realTotals || { subtotal: cartSubtotal, totalAmount: cartSubtotal }
  const checkoutStep = !order ? 1 : ['paid', 'shipped', 'delivered', 'refunded'].includes(order.status) ? 3 : 2

  useEffect(() => {
    const validPostcode = form.country === 'India' ? /^\d{6}$/.test(form.postcode) : /^\d{5}$/.test(form.postcode)
    if (order || !form.state || !validPostcode || !cartItems.length) return
    const quoteItems = cartItems.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity }))
    const timer = setTimeout(() => api.post('/orders/quote', { items: quoteItems, shippingAddress: form }).then((r) => setQuote(r.data)).catch(() => setQuote(null)), 350)
    return () => clearTimeout(timer)
  }, [cartItems, form, order])

  useEffect(() => {
    if (!order || order.status !== 'pending') return
    let active = true
    api.get('/orders/payment-options')
      .then((response) => {
        if (!active) return
        const razorpay = response.data?.razorpay === true
        setPaymentOptions({ loading: false, razorpay })
        if (razorpay) setPaymentMethod('razorpay')
      })
      .catch(() => { if (active) setPaymentOptions({ loading: false, razorpay: false }) })
    return () => { active = false }
  }, [order])

  if (!authReady) return <main className="page-shell section-space text-center text-stone-500">Checking your account…</main>
  if (!user) return <Navigate to="/login?returnTo=/checkout" replace />
  if (!cartItems.length && !order) return <Navigate to="/cart" replace />

  const submit = async (event) => {
    event.preventDefault()
    if (placingRef.current) return
    placingRef.current = true
    setPlacing(true)
    try {
      idempotencyKey.current ||= crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
      const response = await api.post('/orders', { items: requestItems(), shippingAddress: form }, { headers: { 'Idempotency-Key': idempotencyKey.current } })
      setOrder(response.data)
      setQuote(response.data)
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
      setPaymentOptions({ loading: true, razorpay: false })
      persist(response.data)
      clearCart()
      trackEvent('begin_checkout', { value: response.data.totalAmount, currency: 'MYR', items: response.data.items?.length || 0 })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to start checkout.')
      placingRef.current = false
      setPlacing(false)
    }
  }

  const cancelPayPal = async () => {
    if (!order) return
    let cancelled = false
    try { const response = await api.post(`/orders/${order._id}/cancel-payment`); cancelled = response.data?.status === 'cancelled' } catch { toast.error('Payment may still be processing. Check your order status before retrying.') }
    if (cancelled) sessionStorage.removeItem(PENDING_KEY)
    navigate(cancelled ? `/orders/${order._id}?payment=cancelled` : `/orders/${order._id}`)
  }

  const leaveRazorpay = async () => {
    if (!order || paying) return
    let cancelled = false
    try { const response = await api.post(`/orders/${order._id}/cancel-payment`); cancelled = response.data?.status === 'cancelled' } catch { toast.error('Payment may still be processing. Check your order status before retrying.') }
    if (cancelled) sessionStorage.removeItem(PENDING_KEY)
    navigate(cancelled ? `/orders/${order._id}?payment=cancelled` : `/orders/${order._id}`)
  }

  const approvePayPal = async (data) => {
    if (paying) return
    setPaying(true)
    try {
      const response = await api.post(`/orders/${order._id}/paypal-capture`, { paypalOrderId: data.orderID }, setRequestTimeout())
      if (response.data.status !== 'paid') throw new Error('Payment could not be confirmed')
      setOrder((current) => ({ ...current, ...response.data }))
      sessionStorage.removeItem(PENDING_KEY)
      trackEvent('purchase', { transaction_id: order._id, value: response.data.totalAmount || order.totalAmount, currency: 'MYR' })
      navigate(`/orders/${order._id}?payment=success`)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Payment failed.')
      setPaying(false)
    }
  }

  const verifyRazorpay = async (response) => {
    if (razorpayCompleted.current) return
    razorpayCompleted.current = true
    setPaying(true)
    setRazorpayMessage('Confirming your payment securely…')
    try {
      const verified = await api.post(`/orders/${order._id}/razorpay-verify`, response, setRequestTimeout())
      if (verified.data.status !== 'paid') throw new Error('Payment could not be confirmed')
      setOrder((current) => ({ ...current, ...verified.data }))
      sessionStorage.removeItem(PENDING_KEY)
      trackEvent('purchase', { transaction_id: order._id, value: order.totalAmount, currency: 'MYR' })
      navigate(`/orders/${order._id}?payment=success`)
    } catch (error) {
      razorpayCompleted.current = false
      setPaying(false)
      setRazorpayMessage('We could not confirm the payment yet. If money was deducted, do not pay again; the order will update automatically after secure verification.')
      toast.error(error.response?.data?.message || 'Payment confirmation needs attention.')
    }
  }

  const startRazorpay = async () => {
    if (paying || !order) return
    razorpayCompleted.current = false
    setPaying(true)
    setRazorpayMessage('Opening secure Razorpay checkout…')
    try {
      const [Razorpay, response] = await Promise.all([loadRazorpay(), api.post(`/orders/${order._id}/razorpay-order`)])
      const config = response.data
      if (!config?.keyId || !config?.orderId || !Number.isInteger(config?.amount) || config.amount < 1 || config.currency !== 'MYR') throw new Error('Invalid payment configuration')
      const checkout = new Razorpay({
        key: config.keyId,
        amount: config.amount,
        currency: config.currency,
        order_id: config.orderId,
        name: 'Ayusydah',
        description: `Order #${order._id.slice(-8).toUpperCase()}`,
        prefill: { name: form.fullName, contact: form.phone, email: user.email },
        notes: { internal_order_id: order._id },
        theme: { color: '#0f5f86' },
        handler: verifyRazorpay,
        modal: {
          ondismiss: () => {
            if (!razorpayCompleted.current) {
              setPaying(false)
              setRazorpayMessage('Payment was cancelled. Your order is still pending, so you can safely retry.')
            }
          },
        },
      })
      checkout.on('payment.failed', (event) => {
        if (!razorpayCompleted.current) {
          setPaying(false)
          setRazorpayMessage(event.error?.description || 'The payment was not completed. Please try again.')
        }
      })
      checkout.open()
    } catch (error) {
      setPaying(false)
      const message = error.response?.data?.message || error.message || 'Unable to start Razorpay payment. Please try again.'
      if (error.response?.status === 409 && /already cancelled/i.test(message)) {
        setOrder((current) => current ? { ...current, status: 'cancelled' } : current)
        sessionStorage.removeItem(PENDING_KEY)
      }
      setRazorpayMessage(message)
    }
  }

  const restartCancelledCheckout = async () => {
    if (!order || restartingCheckout) return
    setRestartingCheckout(true)
    try {
      const key = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
      const response = await api.post('/orders', {
        items: order.items.map((item) => ({
          product: item.product?._id || item.product,
          variantId: item.variant?._id || item.variant,
          quantity: item.quantity,
        })),
        shippingAddress: order.shippingAddress,
      }, { headers: { 'Idempotency-Key': key } })
      idempotencyKey.current = key
      setOrder(response.data)
      setQuote(response.data)
      setRazorpayMessage('')
      setPaymentOptions({ loading: true, razorpay: false })
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({ order: response.data, form }))
    } catch (error) {
      setRazorpayMessage(error.response?.data?.message || 'Unable to restart checkout. Please review your cart and try again.')
    } finally {
      setRestartingCheckout(false)
    }
  }

  const input = 'mt-1.5 w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15'
  return <main className="page-shell section-space max-w-6xl overflow-x-hidden">
    <Link to={order ? `/orders/${order._id}` : '/cart'} className="mb-5 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 hover:text-brand-blue"><ChevronLeft size={17} />{order ? 'Back to order details' : 'Back to Cart'}</Link>
    <ol aria-label="Checkout progress" className="mb-7 flex flex-wrap gap-2 text-xs font-semibold sm:text-sm"><li aria-current={checkoutStep === 1 ? 'step' : undefined} className={`rounded-full px-3 py-2 ${checkoutStep > 1 ? 'bg-emerald-50 text-emerald-800' : checkoutStep === 1 ? 'bg-blue-50 text-brand-blue' : 'bg-stone-100 text-stone-500'}`}>{checkoutStep > 1 ? '✓ ' : ''}1. Shipping</li><li aria-current={checkoutStep === 2 ? 'step' : undefined} className={`rounded-full px-3 py-2 ${checkoutStep > 2 ? 'bg-emerald-50 text-emerald-800' : checkoutStep === 2 ? 'bg-blue-50 text-brand-blue' : 'bg-stone-100 text-stone-500'}`}>{checkoutStep > 2 ? '✓ ' : ''}2. Payment</li><li aria-current={checkoutStep === 3 ? 'step' : undefined} className={`rounded-full px-3 py-2 ${checkoutStep === 3 ? 'bg-blue-50 text-brand-blue' : 'bg-stone-100 text-stone-500'}`}>3. Confirmation</li></ol>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="surface-card min-w-0 p-4 sm:p-7">
        <p className="eyebrow mb-2">Secure checkout</p><h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{order ? 'Secure payment' : 'Shipping details'}</h1>
        {!order ? <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Full name *<input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className={input} /></label>
          <label className="block text-sm font-medium">Phone number *<input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={input} /></label>
          <label className="block text-sm font-medium">Address line 1 *<input required value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)} className={input} /></label>
          <label className="block text-sm font-medium">Address line 2 <span className="font-normal text-stone-400">(optional)</span><input value={form.addressLine2} onChange={(e) => set('addressLine2', e.target.value)} className={input} /></label>
          <label className="block text-sm font-medium">Country *<select required value={form.country} onChange={(e) => { set('country', e.target.value); set('state', ''); set('postcode', '') }} className={input}><option>Malaysia</option><option>India</option></select></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">City *<input required value={form.city} onChange={(e) => set('city', e.target.value)} className={input} /></label><label className="block text-sm font-medium">Postcode *<input required inputMode="numeric" pattern={form.country === 'India' ? '[0-9]{6}' : '[0-9]{5}'} maxLength={form.country === 'India' ? 6 : 5} value={form.postcode} onChange={(e) => set('postcode', e.target.value.replace(/\D/g, '').slice(0, form.country === 'India' ? 6 : 5))} className={input} /></label></div>
          <label className="block text-sm font-medium">State *<select required value={form.state} onChange={(e) => set('state', e.target.value)} className={input}><option value="">Select state</option>{(form.country === 'India' ? indiaStates : malaysiaStates).map((state) => <option key={state}>{state}</option>)}</select></label>
          <button disabled={placing} className="w-full rounded-full bg-brand-blue py-3.5 font-semibold text-white disabled:opacity-60">{placing ? 'Calculating secure total…' : 'Continue to payment'}</button>
          <p className="flex justify-center gap-2 text-xs text-stone-500"><LockKeyhole size={14} />Final amounts are verified on our server.</p>
        </form> : <div className="mt-6">
          {checkingSavedOrder ? <p className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600" role="status">Checking your saved order…</p>
            : savedOrderError ? <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="alert">{savedOrderError}</p>
            : order.status === 'cancelled' ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
            <p className="font-semibold">This order was cancelled and can’t be paid.</p>
            <p className="mt-1">Create a new order to retry payment. Stock and the total will be checked again.</p>
            <button type="button" onClick={restartCancelledCheckout} disabled={restartingCheckout} className="mt-3 inline-flex font-semibold underline underline-offset-2 disabled:opacity-60">{restartingCheckout ? 'Checking stock…' : 'Retry checkout'}</button>
          </div> : <>
          <p className="mb-4 text-sm text-stone-600">Review your final total, then choose a secure payment method.</p>
          {paymentOptions.loading ? <p className="text-sm text-stone-500">Loading payment methods…</p> : <>
            {paymentOptions.razorpay && <div className="mb-4 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
              <button type="button" onClick={() => setPaymentMethod('razorpay')} disabled={paying} className={`rounded-lg border p-3 text-left text-sm font-semibold ${paymentMethod === 'razorpay' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-stone-200'}`}>Razorpay</button>
              <button type="button" onClick={() => setPaymentMethod('paypal')} disabled={paying} className={`rounded-lg border p-3 text-left text-sm font-semibold ${paymentMethod === 'paypal' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-stone-200'}`}>PayPal</button>
            </div>}
            {paymentMethod === 'razorpay' && paymentOptions.razorpay ? <div>
              <button type="button" onClick={startRazorpay} disabled={paying} className="w-full rounded-full bg-brand-blue py-3.5 font-semibold text-white disabled:opacity-60">{paying ? 'Processing payment…' : 'Pay securely with Razorpay'}</button>
              {razorpayMessage && <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-600" role="status">{razorpayMessage}</p>}
              <button type="button" onClick={leaveRazorpay} disabled={paying} className="mt-4 text-sm font-semibold text-stone-600 underline disabled:opacity-50">Leave payment</button>
            </div> : <>
              {!import.meta.env.VITE_PAYPAL_CLIENT_ID ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">PayPal is unavailable. Please contact support.</p> : <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'MYR', intent: 'capture' }}><PayPalButtons disabled={paying} style={{ layout: 'vertical', label: 'pay' }} createOrder={async () => (await api.post(`/orders/${order._id}/paypal-order`)).data.orderId} onApprove={approvePayPal} onCancel={cancelPayPal} onError={() => { setPaying(false); toast.error('PayPal could not be reached. Check your connection and try again.') }} /></PayPalScriptProvider>}
              {paying && <p className="mt-3 text-sm font-medium text-brand-blue">Confirming your payment securely…</p>}
              <button type="button" onClick={cancelPayPal} disabled={paying} className="mt-4 text-sm font-semibold text-stone-600 underline disabled:opacity-50">Cancel payment</button>
            </>}
          </>}
          </>}
        </div>}
      </section>
      <aside className="surface-card min-w-0 p-4 sm:p-5 lg:sticky lg:top-28"><h2 className="text-lg font-bold text-gray-900">Order summary</h2><div className="mt-4 max-h-72 space-y-3 overflow-y-auto">{items.map((item) => <div key={`${item._id || item.product}-${item.variantId || item.variant || ''}`} className="flex min-w-0 gap-3"><img src={cloudinaryImage(item.image, { width: 160, height: 160 })} srcSet={cloudinarySrcSet(item.image, [80, 120, 160], { height: 160 })} sizes="56px" width="56" height="56" loading="lazy" decoding="async" alt="" className="h-14 w-14 shrink-0 rounded-lg border object-contain" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{item.name}</p><p className="text-xs text-stone-500">Qty: {item.quantity}</p></div><span className="shrink-0 text-sm font-semibold">{formatRm(Number(item.price) * item.quantity)}</span></div>)}</div><div className="mt-5 space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatRm(totals?.subtotal)}</span></div>{realTotals ? <><div className="flex justify-between text-emerald-700"><span>Discount {realTotals.discount ? '(orders over RM 1,000)' : ''}</span><span>−{formatRm(realTotals.discount)}</span></div><div className="flex justify-between"><span>Shipping <small>({realTotals.shippingRegion === 'india' ? 'India' : `${realTotals.shippingRegion === 'east-malaysia' ? 'East' : 'West'} Malaysia`})</small></span><span>{formatRm(realTotals.shipping)}</span></div></> : <p className="text-xs text-stone-500">Enter your state and postcode to see shipping cost.</p>}<div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Final total</span><span className="text-brand-blue">{formatRm(totals?.totalAmount)}</span></div>{realTotals && <p className="text-xs text-stone-500">Weight: {realTotals.totalWeightKg} kg</p>}</div></aside>
    </div>
  </main>
}

export default Checkout
