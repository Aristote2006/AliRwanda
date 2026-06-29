import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingBag, FiHeart, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getFeaturedProducts, getTrendingProducts } from '../../services/api'
import DashboardSidebar from '../../components/customer/DashboardSidebar'
import DashboardNavbar from '../../components/customer/DashboardNavbar'
import ProductCard from '../../components/products/ProductCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const { cart } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [featured, trending] = await Promise.all([
        getFeaturedProducts(),
        getTrendingProducts(),
      ])
      setFeaturedProducts(featured)
      setTrendingProducts(trending)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const cartItemsCount = cart?.reduce((acc, item) => acc + item.qty, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary dark:text-white mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                What would you like to shop today?
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Cart Items</p>
                    <p className="text-3xl font-bold">{cartItemsCount}</p>
                  </div>
                  <FiShoppingBag className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <FiShoppingBag className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100 mb-1">Wishlist</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <FiHeart className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100 mb-1">Saved Addresses</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <FiMapPin className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary dark:text-white">
                  Featured Products
                </h2>
                <Link
                  to="/shop"
                  className="text-secondary hover:text-orange-600 font-semibold flex items-center space-x-2"
                >
                  <span>View All</span>
                  <FiArrowRight />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>

            {/* Trending Products */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary dark:text-white">
                  Trending Products
                </h2>
                <Link
                  to="/shop"
                  className="text-secondary hover:text-orange-600 font-semibold flex items-center space-x-2"
                >
                  <span>View All</span>
                  <FiArrowRight />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {trendingProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CustomerDashboard
