import { useState, useEffect } from 'react'
import { FiHeart, FiShoppingCart, FiTrash2, FiHeart as FiHeartOutline } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
} from '../../services/api'
import { toast } from 'react-toastify'
import DashboardSidebar from '../../components/customer/DashboardSidebar'
import DashboardNavbar from '../../components/customer/DashboardNavbar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Wishlist = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set())

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const data = await getWishlist(user.token)
      setWishlist(data)
      const productIds = new Set(data.map((item) => item.product._id))
      setWishlistProductIds(productIds)
    } catch (error) {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId, user.token)
      setWishlist(wishlist.filter((item) => item.product._id !== productId))
      setWishlistProductIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success('Added to cart')
  }

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId, user.token)
      setWishlistProductIds((prev) => new Set([...prev, productId]))
      toast.success('Added to wishlist')
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary dark:text-white">
                My Wishlist
              </h1>
              <span className="text-gray-600 dark:text-gray-300">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="card p-12 text-center">
                <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start adding products you love
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.product._id}
                    className="card overflow-hidden group"
                  >
                    <div className="relative">
                      <Link to={`/product/${item.product._id}`}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product._id)}
                        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remove from wishlist"
                      >
                        <FiTrash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="block mb-2"
                      >
                        <h3 className="text-lg font-semibold text-primary dark:text-white line-clamp-2 hover:text-secondary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {item.product.category}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-secondary">
                          RWF {item.product.price?.toLocaleString()}
                        </span>
                        {item.product.countInStock > 0 ? (
                          <span className="text-sm text-green-600 dark:text-green-400">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 dark:text-red-400">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item.product)}
                        disabled={item.product.countInStock === 0}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Wishlist
