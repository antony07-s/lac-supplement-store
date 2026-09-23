import { useState, useEffect } from 'react'
import { CheckCircle2, PackageCheck, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-rose-100 text-rose-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-gray-100 text-gray-700',
}

const couriers = ['J&T Express', 'Ninja Van', 'Pos Laju', 'DHL eCommerce', 'LEX', 'Other']

function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [shipModalOrder, setShipModalOrder] = useState(null)
  const [courierName, setCourierName] = useState(couriers[0])
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    let active = true
    api.get('/orders')
      .then((res) => { if (active) setOrders(res.data) })
      .catch(() => { if (active) toast.error('Failed to load orders') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleStatusChange = async (orderId, newStatus, extra = {}) => {
    if (updatingOrderId) return
    setUpdatingOrderId(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus, ...extra })
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus, ...extra } : o))
      )
      toast.success('Order status updated', { id: 'order-status-updated' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status', { id: 'order-status-updated' })
    } finally { setUpdatingOrderId(null) }
  }

  const openShipModal = (order) => {
    setShipModalOrder(order)
    setCourierName(couriers[0])
    setTrackingNumber('')
  }

  const submitShip = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number')
      return
    }
    await handleStatusChange(shipModalOrder._id, 'shipped', {
      courierName,
      trackingNumber: trackingNumber.trim(),
    })
    setShipModalOrder(null)
  }

  return (
    <AdminLayout title="Orders" subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''} total`}>
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="min-w-[780px] w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {order.items.map((item) => (
                      <p key={item._id} className="text-xs">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-5 py-3 font-semibold text-brand-blue">
                    RM {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
                    {order.trackingNumber && (
                      <p className="mt-1 text-[11px] text-gray-400">{order.courierName}: {order.trackingNumber}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {order.status === 'paid' && <button disabled={updatingOrderId === order._id} onClick={() => openShipModal(order)} className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-60"><Truck size={14} />{updatingOrderId === order._id ? 'Updating…' : 'Mark shipped'}</button>}
                    {order.status === 'shipped' && <button disabled={updatingOrderId === order._id} onClick={() => handleStatusChange(order._id, 'delivered')} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><PackageCheck size={14} />{updatingOrderId === order._id ? 'Updating…' : 'Mark delivered'}</button>}
                    {order.status === 'delivered' && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} />Complete</span>}
                    {order.status === 'pending' && <span className="text-xs text-gray-400">Awaiting payment</span>}
                    {order.status === 'cancelled' && <span className="text-xs text-rose-600">Payment cancelled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shipModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">Mark order as shipped</h3>
            <p className="mt-1 text-xs text-gray-500">Order #{shipModalOrder._id.slice(-8).toUpperCase()}</p>

            <label className="mt-4 block text-xs font-semibold text-gray-600">Courier</label>
            <select
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
            >
              {couriers.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="mt-4 block text-xs font-semibold text-gray-600">Tracking number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. MY123456789"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
            />

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShipModalOrder(null)} className="rounded-full px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100">Cancel</button>
              <button
                onClick={submitShip}
                disabled={updatingOrderId === shipModalOrder._id}
                className="rounded-full bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-60"
              >
                {updatingOrderId === shipModalOrder._id ? 'Saving…' : 'Confirm shipped'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ManageOrders