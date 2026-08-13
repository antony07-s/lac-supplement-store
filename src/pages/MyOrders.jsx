import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

function MyOrders() {
  const { user } = useAuth()
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

  if (!user) {
    return (
      <div className="px-8 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Please Login</h1>
        <p className="text-gray-500 mb-6">You need to be logged in to view your orders.</p>
        <Link to="/login" className="text-brand-blue font-semibold hover:underline">
          Go to Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-8 py-24 text-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="px-8 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h1>
        <p className="text-gray-500 mb-6">You haven't placed any orders.</p>
        <Link to="/" className="text-brand-blue font-semibold hover:underline">
          Start Shopping
        </Link>
      </div>
    )
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="page-shell py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400">
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
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
