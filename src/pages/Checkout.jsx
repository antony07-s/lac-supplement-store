import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

function Checkout() {
  const { cartItems, clearCart, subtotal, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
  })

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPlacing(true)
    try {
      const idempotencyKey = crypto.randomUUID()
      const response = await api.post('/orders', {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: item.quantity,
        })),
        shippingAddress: form,
      }, { headers: { 'Idempotency-Key': idempotencyKey } })
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${response.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <main className="page-shell section-space max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Shipping Details</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="012-3456789" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1 <span className="text-red-500">*</span></label>
          <input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Street address, house number" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2</label>
          <input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Apartment, unit, floor (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
            <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode <span className="text-red-500">*</span></label>
            <input type="text" name="postcode" value={form.postcode} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">State <span className="text-red-500">*</span></label>
          <select name="state" value={form.state} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue">
            <option value="">Select state</option>
            {['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah', 'Sarawak', 'Melaka', 'Negeri Sembilan', 'Kedah', 'Kelantan', 'Pahang', 'Perlis', 'Terengganu', 'Putrajaya', 'Labuan'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-stone-600">
            <span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-brand-blue">RM {total.toFixed(2)}</span>
          </div>
        </div>

        <button type="submit" disabled={placing} className="w-full cursor-pointer rounded-full bg-brand-blue py-3 font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60">
          {placing ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </main>
  )
}

export default Checkout
