import { FiMenu, FiSearch, FiMoon, FiSun, FiBell, FiShoppingCart, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const DashboardNavbar = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode } = useTheme()
  const { cart } = useCart()
  const { user } = useAuth()

  const cartItemsCount = cart?.reduce((acc, item) => acc + item.qty, 0) || 0

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Center - Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <Link
              to="/dashboard/notifications"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <FiShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to="/dashboard/settings"
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardNavbar
