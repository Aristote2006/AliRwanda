import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/layout/Navbar'
import ContactBar from './components/layout/ContactBar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ui/ScrollToTop'
import { SkeletonCard } from './components/ui/Skeleton'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute from './components/common/AdminRoute'

// Lazy load admin and customer pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'))
const ProductForm = lazy(() => import('./pages/admin/ProductForm'))
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'))
const AdminOrderDetails = lazy(() => import('./pages/admin/AdminOrderDetails'))
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'))
const ProfileSettings = lazy(() => import('./pages/customer/ProfileSettings'))
const SavedAddresses = lazy(() => import('./pages/customer/SavedAddresses'))
const Wishlist = lazy(() => import('./pages/customer/Wishlist'))
const Notifications = lazy(() => import('./pages/customer/Notifications'))
const OrderHistory = lazy(() => import('./pages/customer/OrderHistory'))
const OrderDetails = lazy(() => import('./pages/customer/OrderDetails'))

const LoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
)

function App() {
  const { user } = useAuth()
  const location = useLocation()
  
  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')
  // Check if user is logged in
  const isLoggedIn = !!user
  
  // Hide main navbar when logged in user is on dashboard routes
  const showMainNavbar = !isLoggedIn || !isDashboardRoute

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <ContactBar />
      {showMainNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          
          {/* Customer Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomerDashboard />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ProfileSettings />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/addresses"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <SavedAddresses />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/wishlist"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Wishlist />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Notifications />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <OrderHistory />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/orders/:id"
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <OrderDetails />
                </Suspense>
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ProductManagement />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product/new"
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ProductForm />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product/:id/edit"
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ProductForm />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <OrderManagement />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <AdminOrderDetails />
                </Suspense>
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
