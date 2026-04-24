import { Link } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiMessageCircle } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { user } = useAuth()

  const shipping = cartItems.length > 0 ? 10 : 0
  const tax = getCartTotal() * 0.1
  const total = getCartTotal() + shipping + tax

  const handleBuyNowWhatsApp = () => {
    const phoneNumber = '+250784227283'
    
    let message = "Hello, I'd like to order:\n\n"
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}\n`
    })
    
    message += `\nSubtotal: $${getCartTotal().toFixed(2)}`
    message += `\nShipping: $${shipping.toFixed(2)}`
    message += `\nTax (10%): $${tax.toFixed(2)}`
    message += `\nTotal: $${total.toFixed(2)}`
    message += `\n\nPlease confirm availability and delivery details. Thank you!`
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center fade-in">
        <FiShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Start shopping to add items to your cart
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <h1 className="text-4xl font-bold text-primary dark:text-white mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to={`/product/${item._id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-xl font-semibold text-primary dark:text-white hover:text-secondary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                  <p className="text-2xl font-bold text-secondary mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 className="w-6 h-6" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.qty - 1)}
                      className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.qty + 1)}
                      className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span className="font-semibold">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Shipping
                </span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax (10%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-primary dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-bold text-secondary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={user ? '/checkout' : '/login'}
              className="btn-primary w-full text-center block"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Link>

            <button
              onClick={handleBuyNowWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 mt-4"
            >
              <FiMessageCircle className="w-5 h-5" />
              <span>Order via WhatsApp</span>
            </button>

            <Link
              to="/shop"
              className="btn-outline w-full text-center block mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
