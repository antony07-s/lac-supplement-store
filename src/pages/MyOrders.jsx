import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

function MyOrders() {
  const { user, authReady } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      return
    }
    api.get(`/orders/user/${user.id}`)
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user])

  if (!authReady) return <main className="page-shell section-space text-center text-stone-500">Checking your account…</main>
  if (!user) {
    return (
      <div className="page-shell grid min-h-[55vh] place-items-center py-16 text-center">
        <section className="surface-card w-full max-w-lg p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Please Login</h1>
          <p className="text-gray-500 mb-6">You need to be logged in to view your orders.</p>
          <Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue px-6 font-semibold text-white hover:bg-brand-blue-dark">Go to Login</Link>
        </section>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-shell grid min-h-[55vh] place-items-center py-16 text-center" role="status" aria-label="Loading your orders">
        <div className="surface-card w-full max-w-lg p-10"><span aria-hidden="true" className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" /><p className="mt-4 text-sm text-gray-500">Loading your orders...</p></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="page-shell grid min-h-[55vh] place-items-center py-16 text-center">
        <section className="surface-card w-full max-w-lg p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h1>
          <p className="text-gray-500 mb-6">You haven't placed any orders.</p>
          <Link to="/products" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue px-6 font-semibold text-white hover:bg-brand-blue-dark">Start Shopping</Link>
        </section>
      </div>
    )
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-rose-50 text-rose-700',
    refunded: 'bg-violet-50 text-violet-700',
  }

  return (
    <div className="page-shell section-space max-w-4xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow mb-2">Your account</p><h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Orders</h1></div><Link to="/track-order" className="inline-flex min-h-10 items-center rounded-full border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm hover:border-brand-blue hover:text-brand-blue">Track an order</Link></div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="surface-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400">
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
              <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${statusColors[order.status] || 'bg-stone-100 text-stone-700'}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item) => (
                <p key={item._id} className="text-sm text-gray-600">
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-3"><span className="font-bold text-brand-blue">RM {Number(order.totalAmount).toFixed(2)}</span><Link to={`/orders/${order._id}`} className="cursor-pointer text-sm font-semibold text-brand-blue hover:underline">View details</Link></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
