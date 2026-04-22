import { createContext, useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const existItem = cartItems.find((item) => item._id === product._id)

    if (existItem) {
      // Update quantity if item already exists
      const updatedCart = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, qty: item.qty + quantity }
          : item
      )
      setCartItems(updatedCart)
      toast.success('Quantity updated in cart!')
    } else {
      // Add new item
      const newItem = {
        ...product,
        qty: quantity,
      }
      setCartItems([...cartItems, newItem])
      toast.success('Added to cart!')
    }
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item._id !== productId)
    setCartItems(updatedCart)
    toast.info('Item removed from cart')
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const updatedCart = cartItems.map((item) =>
      item._id === productId ? { ...item, qty: quantity } : item
    )
    setCartItems(updatedCart)
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    toast.info('Cart cleared')
  }

  // Calculate totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.qty, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
