import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
    const { cartItems } = useCart()

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (cartItems.length === 0) {
        return (
            <main className="page-shell py-24 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                <Link to="/" className="text-brand-blue font-semibold hover:underline">
                    Continue Shopping
                </Link>
            </main>
        )
    }

    return (
        <main className="page-shell section-space max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

            <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-brand-blue">
                            RM {(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-300 pt-4">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-brand-blue">RM {total.toFixed(2)}</span>
            </div>

            <button className="w-full mt-6 bg-brand-blue text-white font-semibold py-3 rounded-full hover:bg-brand-blue-dark transition-colors">
                Proceed to Checkout
            </button>
        </main>
    )
}

export default Cart
