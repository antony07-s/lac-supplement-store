import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-gray-200 text-gray-800',
}

function OrderDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    api.get(`/orders/${id}`)
      .then((res) => { if (active) setOrder(res.data) })
      .catch((err) => { if (active) setError(err.response?.data?.message || 'Unable to load this order.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, user])

  if (!user) return <main className="page-shell py-24 text-center"><h1 className="mb-3 text-2xl font-bold">Please login</h1><Link className="font-semibold text-brand-blue hover:underline" to="/login">Go to Login</Link></main>
  if (loading) return <main className="page-shell py-24 text-center text-gray-500">Loading order details...</main>
  if (!order) return <main className="page-shell py-24 text-center"><p className="mb-5 text-gray-600">{error || 'Order not found.'}</p><Link className="font-semibold text-brand-blue hover:underline" to="/my-orders">Back to My Orders</Link></main>

  const address = order.shippingAddress
  const orderNumber = order._id.slice(-8).toUpperCase()
  const placedOn = new Date(order.createdAt).toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <main className="page-shell section-space max-w-3xl">
      <Link to="/my-orders" className="mb-6 inline-block text-sm font-semibold text-brand-blue hover:underline">← My Orders</Link>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-5">
          <div><p className="text-sm text-gray-500">Order #{orderNumber}</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Order details</h1><p className="mt-1 text-sm text-gray-500">Placed {placedOn}</p></div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
        </div>
        <section className="py-5"><h2 className="mb-3 font-bold text-gray-800">Items</h2><div className="space-y-3">{order.items.map((item) => <div key={item._id} className="flex justify-between gap-4 text-sm"><span className="text-gray-700">{item.name} <span className="text-gray-500">× {item.quantity}</span></span><span className="shrink-0 font-semibold text-gray-800">RM {(item.price * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold"><span>Total</span><span className="text-brand-blue">RM {Number(order.totalAmount).toFixed(2)}</span></div></section>
        <section className="border-t border-gray-100 py-5"><h2 className="mb-3 font-bold text-gray-800">Delivery address</h2><address className="not-italic text-sm leading-6 text-gray-600">{address.fullName}<br />{address.phone}<br />{address.addressLine1}{address.addressLine2 && <><br />{address.addressLine2}</>}<br />{address.postcode} {address.city}, {address.state}</address></section>
        <Link to={`/track-order?order=${order._id}`} className="inline-flex cursor-pointer rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark">Track this order</Link>
      </div>
    </main>
  )
}

export default OrderDetails
