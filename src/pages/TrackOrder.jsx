import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CheckCircle2, CircleDollarSign, Clock3, PackageCheck, Truck } from 'lucide-react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

const steps = [
  { key: 'pending', label: 'Order placed', icon: Clock3, detail: 'We have received your order.' },
  { key: 'paid', label: 'Payment confirmed', icon: CircleDollarSign, detail: 'Your payment has been confirmed.' },
  { key: 'shipped', label: 'Order shipped', icon: Truck, detail: 'Your parcel is on its way.' },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck, detail: 'Your order has been delivered.' },
]

function TrackOrder() {
  const { user } = useAuth(); const [params, setParams] = useSearchParams(); const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(Boolean(user))
  const selectedId = params.get('order') || ''; const selectedOrder = orders.find((order) => order._id === selectedId)
  useEffect(() => {
    if (!user) return
    let active = true
    api.get(`/orders/user/${user.id}`).then((res) => { if (!active) return; setOrders(res.data); if (!selectedId && res.data[0]) setParams({ order: res.data[0]._id }, { replace: true }) }).catch(() => { if (active) setOrders([]) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [selectedId, setParams, user])
  if (!user) return <main className="page-shell py-24 text-center"><h1 className="mb-3 text-2xl font-bold">Please login to track an order</h1><Link className="font-semibold text-brand-blue hover:underline" to="/login">Go to Login</Link></main>
  if (loading) return <main className="page-shell py-24 text-center text-gray-500">Loading your orders...</main>
  if (!orders.length) return <main className="page-shell py-24 text-center"><h1 className="mb-3 text-2xl font-bold">No orders to track</h1><Link className="font-semibold text-brand-blue hover:underline" to="/products">Start shopping</Link></main>
  const currentStep = Math.max(0, steps.findIndex((step) => step.key === selectedOrder?.status))
  return <main className="page-shell section-space max-w-3xl"><h1 className="text-2xl font-bold text-gray-900">Track my order</h1><p className="mt-1 text-sm text-gray-500">Follow each step from payment to delivery.</p><label className="mt-6 block text-sm font-semibold text-gray-700" htmlFor="order">Order</label><select id="order" value={selectedId} onChange={(event) => setParams({ order: event.target.value })} className="mt-2 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-blue focus:outline-none">{orders.map((order) => <option key={order._id} value={order._id}>Order #{order._id.slice(-8).toUpperCase()} — {new Date(order.createdAt).toLocaleDateString('en-MY')}</option>)}</select>{selectedOrder && <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5"><div><p className="font-bold text-gray-800">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-sm text-gray-500">Current status: <span className="font-semibold capitalize text-brand-blue">{selectedOrder.status}</span></p></div><Link className="text-sm font-semibold text-brand-blue hover:underline" to={`/orders/${selectedOrder._id}`}>View details</Link></div><ol className="mt-6 space-y-0">{steps.map((step, index) => { const Icon = step.icon; const complete = index <= currentStep; const current = index === currentStep; return <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0"><span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${complete ? 'bg-brand-blue text-white' : 'bg-stone-100 text-stone-400'}`}><Icon size={19} /></span>{index < steps.length - 1 && <span className={`absolute left-5 top-10 h-[calc(100%-1.5rem)] w-0.5 ${index < currentStep ? 'bg-brand-blue' : 'bg-stone-200'}`} />}<div className="pt-1"><p className={`font-semibold ${complete ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}{current && <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-brand-blue">Current</span>}</p><p className="mt-1 text-sm text-gray-500">{step.detail}</p>{index === 0 && <p className="mt-1 text-xs text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' })}</p>}</div></li> })}</ol>{selectedOrder.status === 'delivered' && <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"><CheckCircle2 size={18} />Your order has been delivered.</div>}</section>}</main>
}

export default TrackOrder
