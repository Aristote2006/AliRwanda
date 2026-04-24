import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiTrendingUp, FiEye, FiShoppingBag, FiPackage, FiHeart, FiArrowRight } from 'react-icons/fi'
import { getUserAnalytics, getPersonalizedFeed } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import ProductCard from '../../components/products/ProductCard'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [personalizedProducts, setPersonalizedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPersonalized, setIsPersonalized] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [analyticsData, feedData] = await Promise.all([
        getUserAnalytics(user.token),
        getPersonalizedFeed(user.token),
      ])
      
      setAnalytics(analyticsData)
      setPersonalizedProducts(feedData.products)
      setIsPersonalized(feedData.personalized)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary dark:text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's your personalized shopping experience powered by AI
        </p>
      </div>

      {/* AI Insights */}
      {analytics?.insights && analytics.insights.length > 0 && (
        <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-4">
            <FiTrendingUp className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold text-primary dark:text-white">
              AI Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.insights.map((insight, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                <p className="text-gray-700 dark:text-gray-300">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {analytics?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Searches</p>
                <p className="text-3xl font-bold text-primary dark:text-white">
                  {analytics.stats.totalSearches}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <FiSearch className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Products Viewed</p>
                <p className="text-3xl font-bold text-primary dark:text-white">
                  {analytics.stats.totalProductViews}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <FiEye className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Categories Explored</p>
                <p className="text-3xl font-bold text-primary dark:text-white">
                  {analytics.stats.totalCategoryViews}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <FiPackage className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Purchases</p>
                <p className="text-3xl font-bold text-primary dark:text-white">
                  {analytics.stats.totalPurchases}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <FiShoppingBag className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Feed */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-1">
              {isPersonalized ? 'Recommended For You' : 'Trending Products'}
            </h2>
            {isPersonalized && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Based on your browsing history and preferences ✨
              </p>
            )}
          </div>
          <Link
            to="/shop"
            className="text-secondary hover:text-orange-600 font-semibold flex items-center space-x-2"
          >
            <span>Browse All</span>
            <FiArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalizedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Top Searched Categories */}
      {analytics?.topCategories && analytics.topCategories.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Your Favorite Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.topCategories.map((cat, index) => (
              <Link
                key={cat._id || cat.category}
                to={`/shop?category=${cat.category}`}
                className="bg-gradient-to-br from-secondary to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow"
              >
                <p className="text-2xl font-bold mb-1">#{index + 1}</p>
                <p className="text-sm font-semibold">{cat.category}</p>
                <p className="text-xs text-orange-100">{cat.count} views</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top Search Queries */}
      {analytics?.searchHistory && analytics.searchHistory.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Frequently Searched
          </h2>
          <div className="flex flex-wrap gap-3">
            {analytics.searchHistory.map((search, index) => (
              <Link
                key={index}
                to={`/shop?search=${search.query}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-secondary hover:text-white transition-colors text-sm"
              >
                {search.query}
                <span className="ml-2 text-xs opacity-75">({search.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Viewed Products */}
      {analytics?.frequentlyViewed && analytics.frequentlyViewed.length > 0 && (
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {analytics.frequentlyViewed.map((item) => (
              <Link
                key={item.product?._id}
                to={`/product/${item.product?._id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg mb-2">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                    Viewed {item.count}x
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary dark:text-white line-clamp-2">
                  {item.product?.name}
                </p>
                <p className="text-sm text-secondary font-bold">
                  ${item.product?.price?.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard
