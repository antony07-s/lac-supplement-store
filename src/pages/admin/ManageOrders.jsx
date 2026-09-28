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
  refunded: 'bg-purple-100 text-purple-700',
}

const couriers = ['J&T Express', 'Ninja Van', 'Pos Laju', 'DHL eCommerce', 'LEX', 'Other']

function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [shipModalOrder, setShipModalOrder] = useState(null)
  const [courierName, setCourierName] = useState(couriers[0])
  const [trackingNumber, setTrackingNumber] = useState('')
  const [fulfilmentNote, setFulfilmentNote] = useState('')

  useEffect(() => {
    let active = true
    api.get('/orders', { params: { page, limit: 50 } })
      .then((res) => { if (active) { setOrders(res.data); setTotalOrders(Number(res.headers['x-total-count']) || res.data.length) } })
      .catch(() => { if (active) toast.error('Failed to load orders') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(totalOrders / 50))

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
    setFulfilmentNote('')
  }

  const submitShip = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number')
      return
    }
    await handleStatusChange(shipModalOrder._id, 'shipped', {
      courierName,
      trackingNumber: trackingNumber.trim(),
      fulfilmentNote: fulfilmentNote.trim(),
    })
    setShipModalOrder(null)
  }

  const retryShipmentEmail = async (orderId) => {
    setUpdatingOrderId(orderId)
    try {
      const response = await api.post(`/orders/${orderId}/shipment-email/retry`)
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, ...response.data } : order))
      toast.success('Shipment email sent')
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.message || 'Shipment email could not be sent')
    } finally { setUpdatingOrderId(null) }
  }

  const requestStatusNote = async (order, status) => {
    const label = status === 'refunded' ? 'refund' : 'cancellation'
    const statusNote = window.prompt(`Add an admin note for this ${label}:`)
    if (!statusNote?.trim()) return
    await handleStatusChange(order._id, status, { statusNote: statusNote.trim() })
  }

  return (
    <AdminLayout title="Orders" subtitle={`${totalOrders} order${totalOrders !== 1 ? 's' : ''} total`}>
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="hidden bg-gray-50 text-xs uppercase tracking-wide text-gray-500 md:table-header-group">
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
              <tr key={order._id} className="mb-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm last:mb-0 md:mb-0 md:table-row md:rounded-none md:border-0 md:p-0 md:shadow-none md:transition-colors md:hover:bg-gray-50">
                  <td className="block p-0 font-mono text-xs text-gray-500 md:table-cell md:px-5 md:py-4">
                    <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Order</span>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="block p-0 text-right md:table-cell md:px-5 md:py-4 md:text-left">
                    <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Date</span>
                    <p className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </td>
                  <td className="col-span-2 block border-t border-gray-100 pt-3 md:table-cell md:border-0 md:px-5 md:py-4 md:pt-4">
                    <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Customer</span>
                    <p className="font-semibold text-gray-800">{order.user?.name || 'Unknown'}</p>
                    {order.user?.email && <details className="mt-1 text-xs text-gray-500">
                      <summary className="w-fit cursor-pointer rounded text-brand-blue hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue">Customer contact</summary>
                      <a className="mt-1 inline-block break-all hover:underline" href={`mailto:${order.user.email}`}>{order.user.email}</a>
                    </details>}
                  </td>
                  <td className="col-span-2 block p-0 text-gray-600 md:table-cell md:px-5 md:py-4">
                    <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Items</span>
                    {order.items.map((item) => (
                      <p key={item._id} className="text-xs leading-5">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="block p-0 font-bold text-brand-blue md:table-cell md:px-5 md:py-4">
                    <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Total</span>
                    RM {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="block p-0 md:table-cell md:px-5 md:py-4">
                    <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Status</span>
                    <span className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
                    {order.trackingNumber && (
                      <p className="mt-1 text-[11px] text-gray-400">{order.courierName}: {order.trackingNumber}</p>
                    )}
                    {order.shipmentEmailStatus === 'failed' && <p className="mt-1 text-[11px] font-semibold text-rose-600">Shipment email failed</p>}
                  </td>
                  <td className="col-span-2 block border-t border-gray-100 pt-3 md:table-cell md:border-0 md:px-5 md:py-4 md:text-right md:pt-4">
                    <span className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">Actions</span>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    {order.status === 'paid' && <button disabled={updatingOrderId === order._id} onClick={() => openShipModal(order)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-60"><Truck size={14} />{updatingOrderId === order._id ? 'Updating…' : 'Mark shipped'}</button>}
                    {order.status === 'shipped' && <button disabled={updatingOrderId === order._id} onClick={() => handleStatusChange(order._id, 'delivered')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-60"><PackageCheck size={14} />{updatingOrderId === order._id ? 'Updating…' : 'Mark delivered'}</button>}
                    {order.status === 'delivered' && <span className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} />Complete</span>}
                    {order.status === 'pending' && <span className="text-xs text-gray-400">Awaiting payment</span>}
                    {order.status === 'cancelled' && <span className="text-xs text-rose-600">Payment cancelled</span>}
                    {order.statusNote && <p className="mt-1 max-w-48 text-left text-[11px] text-gray-500">{order.statusNote}</p>}
                    {['pending', 'paid'].includes(order.status) && <button type="button" disabled={updatingOrderId === order._id} onClick={() => requestStatusNote(order, 'cancelled')} className="min-h-10 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-50">Cancel order</button>}
                    {['paid', 'shipped', 'delivered'].includes(order.status) && <button type="button" disabled={updatingOrderId === order._id} onClick={() => requestStatusNote(order, 'refunded')} className="min-h-10 rounded-lg border border-purple-200 bg-white px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50">Mark refunded</button>}
                    {order.shipmentEmailStatus === 'failed' && <button type="button" disabled={updatingOrderId === order._id} onClick={() => retryShipmentEmail(order._id)} className="min-h-10 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50">Retry email</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalOrders > 50 && <nav aria-label="Admin order pages" className="mt-5 flex items-center justify-end gap-3"><button type="button" onClick={() => { setLoading(true); setPage((current) => Math.max(1, current - 1)) }} disabled={page === 1 || loading} className="min-h-10 rounded-full border px-4 text-sm font-semibold disabled:opacity-40">Previous</button><span className="text-sm text-gray-500">Page {page} of {totalPages}</span><button type="button" onClick={() => { setLoading(true); setPage((current) => Math.min(totalPages, current + 1)) }} disabled={page >= totalPages || loading} className="min-h-10 rounded-full border px-4 text-sm font-semibold disabled:opacity-40">Next</button></nav>}

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

            <label className="mt-4 block text-xs font-semibold text-gray-600">Internal fulfilment note <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea value={fulfilmentNote} onChange={(e) => setFulfilmentNote(e.target.value)} maxLength="1000" rows="3" placeholder="Packing or delivery instructions for staff" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />

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
