import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { getLineId, useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { cloudinaryImage } from '../utils/cloudinaryImage.js'


function CartProductImage({ image, name }) {
  const [failed, setFailed] = useState(false)
  const imageSrc = String(image || '').trim()

  if (!imageSrc || failed) {
    return <span className="px-2 text-center text-xs font-medium text-stone-500">Product image unavailable</span>
  }

  return <img src={cloudinaryImage(imageSrc, { width: 160, height: 160 })} alt={name} width="160" height="160" loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-contain" />
}

function Cart() {
  const { cartItems, removeFromCart, updateCartQuantity, subtotal, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login?returnTo=%2Fcheckout')
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return <main className="page-shell grid min-h-[55vh] place-items-center py-16 text-center"><section className="surface-card w-full max-w-xl px-6 py-12 sm:px-10"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-brand-blue"><ShoppingCart size={25} /></div><h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">Your Cart is Empty</h1><p className="mb-6 text-gray-500">Looks like you haven't added anything yet.</p><Link to="/products" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue px-6 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-blue-dark">Continue Shopping</Link></section></main>
  }

  return (
    <main className="page-shell section-space max-w-5xl">
      <Link to="/products" className="mb-6 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 hover:text-brand-blue"><ChevronLeft size={17} /> Back to Products</Link>
      <h1 className="mb-7 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Cart <span className="text-lg font-medium text-stone-500">({cartItems.length})</span></h1>
      <div className="mb-8 space-y-4">
        {cartItems.map((item) => {
          const lineId = getLineId(item)
          const stock = Number(item.stock)
          const stockLimit = item.stock !== undefined && item.stock !== null && item.stock !== '' && Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : null
          const itemPrice = Number(item.price) || 0
          const canIncrease = stockLimit === null || item.quantity < stockLimit

          return (
            <div key={lineId} className="surface-card grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-3 p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:gap-5 sm:p-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f2f6ff] p-2 sm:h-24 sm:w-24">
                <CartProductImage image={item.image} name={item.name} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">{item.name}{item.packSize ? ` — ${item.packSize}` : ''}</p>
                {item.sku && <p className="mt-1 text-xs text-stone-500">SKU: {item.sku}</p>}
                <p className="mt-1 text-sm text-stone-500">RM {itemPrice.toFixed(2)} each</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-stone-300 bg-white shadow-sm">
                  <button type="button" onClick={() => updateCartQuantity(lineId, item.quantity - 1)} disabled={item.quantity === 1} aria-label={`Decrease ${item.name} quantity`} className="grid h-9 w-9 place-items-center rounded-l-full text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Minus size={15} /></button>
                  <span aria-live="polite" className="min-w-8 text-center text-sm font-bold text-stone-800">{item.quantity}</span>
                  <button type="button" onClick={() => updateCartQuantity(lineId, item.quantity + 1)} disabled={!canIncrease} aria-label={`Increase ${item.name} quantity`} className="grid h-9 w-9 place-items-center rounded-r-full text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={15} /></button>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-3 text-right">
                <p className="font-semibold text-brand-blue">RM {(itemPrice * item.quantity).toFixed(2)}</p>
                <button type="button" onClick={() => removeFromCart(lineId)} aria-label={`Remove ${item.name} from cart`} className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-rose-600"><Trash2 size={14} /> Remove</button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="ml-auto max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Order summary</h2>
        <div className="flex items-center justify-between text-stone-600"><span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span></div>
        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3"><span className="text-lg font-bold text-gray-900">Total</span><span className="text-lg font-bold text-brand-blue">RM {total.toFixed(2)}</span></div>
        <button onClick={handleCheckout} className="mt-5 min-h-12 w-full rounded-full bg-brand-blue py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-blue-dark">Proceed to Checkout</button>
      </div>
    </main>
  )
}

export default Cart
