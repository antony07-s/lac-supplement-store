import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

const steps = ['pending', 'paid', 'shipped', 'delivered']

function TrackOrder() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(Boolean(user))
  const selectedId = params.get('order') || ''
  const selectedOrder = orders.find((order) => order._id === selectedId)

  useEffect(() => {
    if (!user) return
    let active = true
    api.get(`/orders/user/${user.id}`).then((res) => {
      if (!active) return
      setOrders(res.data)
      if (!selectedId && res.data[0]) setParams({ order: res.data[0]._id }, { replace: true })
    }).catch(() => { if (active) setOrders([]) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [selectedId, setParams, user])

  if (!user) return <main className="page-shell py-24 text-center"><h1 className="mb-3 text-2xl font-bold">Please login to track an order</h1><Link className="font-semibold text-brand-blue hover:underline" to="/login">Go to Login</Link></main>
  if (loading) return <main className="page-shell py-24 text-center text-gray-500">Loading your orders...</main>
  if (!orders.length) return <main className="page-shell py-24 text-center"><h1 className="mb-3 text-2xl font-bold">No orders to track</h1><Link className="font-semibold text-brand-blue hover:underline" to="/products">Start shopping</Link></main>

  const currentStep = Math.max(0, steps.indexOf(selectedOrder?.status))
  return <main className="page-shell section-space max-w-3xl"><h1 className="text-2xl font-bold text-gray-900">Track My Order</h1><p className="mt-1 text-sm text-gray-500">Choose an order to see its delivery progress.</p><label className="mt-6 block text-sm font-semibold text-gray-700" htmlFor="order">Order</label><select id="order" value={selectedId} onChange={(event) => setParams({ order: event.target.value })} className="mt-2 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-blue focus:outline-none">{orders.map((order) => <option key={order._id} value={order._id}>Order #{order._id.slice(-8).toUpperCase()} — {new Date(order.createdAt).toLocaleDateString('en-MY')}</option>)}</select>{selectedOrder && <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div className="flex items-center justify-between"><p className="font-bold text-gray-800">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p><Link className="text-sm font-semibold text-brand-blue hover:underline" to={`/orders/${selectedOrder._id}`}>View details</Link></div><ol className="mt-7 grid grid-cols-4 gap-1">{steps.map((step, index) => <li key={step} className="relative text-center text-xs font-semibold capitalize"><span className={`mx-auto mb-2 block h-4 w-4 rounded-full ${index <= currentStep ? 'bg-brand-blue' : 'bg-gray-200'}`} />{index < steps.length - 1 && <span className={`absolute left-1/2 top-2 h-0.5 w-full ${index < currentStep ? 'bg-brand-blue' : 'bg-gray-200'}`} />}{step}</li>)}</ol><p className="mt-7 text-sm text-gray-600">Current status: <strong className="capitalize text-gray-800">{selectedOrder.status}</strong></p></section>}</main>
}

export default TrackOrder
