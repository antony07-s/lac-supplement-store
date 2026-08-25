import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

const statuses = ['pending', 'approved', 'rejected']

function ManageReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.get('/reviews').then((res) => setReviews(res.data)).catch(() => toast.error('Failed to load reviews')).finally(() => setLoading(false)) }, [])
  const setStatus = async (id, status) => {
    try { await api.put(`/reviews/${id}/status`, { status }); setReviews((current) => current.map((review) => review._id === id ? { ...review, status } : review)); toast.success('Review status updated') } catch (err) { toast.error(err.response?.data?.message || 'Unable to update review') }
  }
  return <AdminLayout title="Reviews" subtitle={`${reviews.filter((review) => review.status === 'pending').length} awaiting moderation`}>
    {loading ? <p className="text-gray-500">Loading reviews...</p> : reviews.length === 0 ? <p className="text-gray-500">No customer reviews yet.</p> : <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white"><table className="min-w-[800px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Rating</th><th className="px-5 py-4">Review</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{reviews.map((review) => <tr key={review._id}><td className="px-5 py-4 font-semibold text-gray-800">{review.product?.name || 'Deleted product'}</td><td className="px-5 py-4"><p>{review.user?.name || 'Unknown'}</p><p className="text-xs text-gray-400">{review.user?.email}</p></td><td className="px-5 py-4 text-brand-gold">{'★'.repeat(review.rating)}</td><td className="max-w-sm px-5 py-4"><p className="font-medium text-gray-800">{review.title}</p><p className="mt-1 text-gray-600">{review.comment}</p></td><td className="px-5 py-4"><select value={review.status} onChange={(e) => setStatus(review._id, e.target.value)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold"><option value="pending">Pending</option>{statuses.slice(1).map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></td></tr>)}</tbody></table></div>}
  </AdminLayout>
}
export default ManageReviews
