import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import bp4 from '../assets/BP4.png'

const localImages = { BP4: bp4 }

function Cart() {
  const { cartItems, clearCart, removeFromCart, updateCartQuantity, subtotal, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }

    setPlacing(true)
    try {
      await api.post('/orders', {
        user: user.id,
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: item.quantity,
        })),
        totalAmount: total,
      })
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (cartItems.length === 0) {
    return <main className="page-shell py-24 text-center"><h1 className="mb-3 text-2xl font-bold text-gray-800">Your Cart is Empty</h1><p className="mb-6 text-gray-500">Looks like you haven't added anything yet.</p><Link to="/" className="font-semibold text-brand-blue hover:underline">Continue Shopping</Link></main>
  }

  return (
    <main className="page-shell section-space max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Your Cart</h1>
      <div className="mb-8 space-y-4">
        {cartItems.map((item) => {
          const stock = Number(item.stock)
          const stockLimit = item.stock !== undefined && item.stock !== null && item.stock !== '' && Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : null
          const itemPrice = Number(item.price) || 0
          const imageSrc = localImages[item.image] || item.image
          const canIncrease = stockLimit === null || item.quantity < stockLimit

          return (
            <div key={item._id} className="flex items-center gap-3 border-b border-gray-200 pb-4 sm:gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4ed] p-2">
                {imageSrc ? <img src={imageSrc} alt={item.name} onError={(event) => { event.currentTarget.style.display = 'none' }} className="h-full w-full object-contain" /> : <span className="text-xs text-stone-500">No image</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="mt-1 text-sm text-stone-500">RM {itemPrice.toFixed(2)} each</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-stone-300 bg-white shadow-sm">
                  <button type="button" onClick={() => updateCartQuantity(item._id, item.quantity - 1)} disabled={item.quantity === 1} aria-label={`Decrease ${item.name} quantity`} className="grid h-9 w-9 place-items-center rounded-l-full text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Minus size={15} /></button>
                  <span aria-live="polite" className="min-w-8 text-center text-sm font-bold text-stone-800">{item.quantity}</span>
                  <button type="button" onClick={() => updateCartQuantity(item._id, item.quantity + 1)} disabled={!canIncrease} aria-label={`Increase ${item.name} quantity`} className="grid h-9 w-9 place-items-center rounded-r-full text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={15} /></button>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-3">
                <p className="font-semibold text-brand-blue">RM {(itemPrice * item.quantity).toFixed(2)}</p>
                <button type="button" onClick={() => removeFromCart(item._id)} aria-label={`Remove ${item.name} from cart`} className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-rose-600"><Trash2 size={14} /> Remove</button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-3 border-t border-gray-300 pt-4">
        <div className="flex items-center justify-between text-stone-600"><span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span></div>
        <div className="flex items-center justify-between"><span className="text-lg font-bold text-gray-800">Total</span><span className="text-lg font-bold text-brand-blue">RM {total.toFixed(2)}</span></div>
      </div>
      <button onClick={handleCheckout} disabled={placing} className="mt-6 w-full rounded-full bg-brand-blue py-3 font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60">{placing ? 'Placing Order...' : 'Proceed to Checkout'}</button>
    </main>
  )
}

export default Cart
