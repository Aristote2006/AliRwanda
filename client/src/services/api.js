import axios from 'axios'

// Use environment variable for API URL, fallback to relative path for development
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging (only in development)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('⚠️ Backend server is not running. Please check the server status.')
    } else if (error.response) {
      if (import.meta.env.DEV) {
        console.error(`API Error ${error.response.status}:`, error.response.data)
      }
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Products API
export const getProducts = async (params = {}) => {
  const { data } = await apiClient.get('/products', { params })
  return data
}

export const getProduct = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

export const getFeaturedProducts = async () => {
  const { data } = await apiClient.get('/products/featured')
  return data
}

export const getTrendingProducts = async () => {
  const { data } = await apiClient.get('/products/trending')
  return data
}

export const getTopProducts = async () => {
  const { data } = await apiClient.get('/products/top')
  return data
}

export const getRelatedProducts = async (id) => {
  const { data } = await apiClient.get(`/products/related/${id}`)
  return data
}

// Users API
export const login = async (email, password) => {
  const { data } = await apiClient.post('/users/login', {
    email,
    password,
  })
  return data
}

export const register = async (name, email, password) => {
  const { data } = await apiClient.post('/users/register', {
    name,
    email,
    password,
  })
  return data
}

export const getUserProfile = async (token) => {
  const { data } = await apiClient.get('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// Google OAuth API
export const googleAuth = async (token) => {
  const { data } = await apiClient.post('/users/google', { token })
  return data
}

// Orders API
export const createOrder = async (orderData, token) => {
  const { data } = await apiClient.post('/orders', orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getOrder = async (id, token) => {
  const { data } = await apiClient.get(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getMyOrders = async (token) => {
  const { data } = await apiClient.get('/orders/myorders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getOrders = async (token) => {
  const { data } = await apiClient.get('/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getOrderById = async (id, token) => {
  const { data } = await apiClient.get(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const updateOrderStatus = async (id, statusData, token) => {
  const { data } = await apiClient.put(`/orders/${id}/status`, statusData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// Addresses API
export const getAddresses = async (token) => {
  const { data } = await apiClient.get('/addresses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getAddressById = async (id, token) => {
  const { data } = await apiClient.get(`/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const createAddress = async (addressData, token) => {
  const { data } = await apiClient.post('/addresses', addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const updateAddress = async (id, addressData, token) => {
  const { data } = await apiClient.put(`/addresses/${id}`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const deleteAddress = async (id, token) => {
  const { data } = await apiClient.delete(`/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const setDefaultAddress = async (id, token) => {
  const { data } = await apiClient.put(`/addresses/${id}/default`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// Wishlist API
export const getWishlist = async (token) => {
  const { data } = await apiClient.get('/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const addToWishlist = async (productId, token) => {
  const { data } = await apiClient.post('/wishlist', { productId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const removeFromWishlist = async (productId, token) => {
  const { data } = await apiClient.delete(`/wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const checkInWishlist = async (productId, token) => {
  const { data } = await apiClient.get(`/wishlist/check/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const clearWishlist = async (token) => {
  const { data } = await apiClient.delete('/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// Notifications API
export const getNotifications = async (token) => {
  const { data } = await apiClient.get('/notifications', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getUnreadCount = async (token) => {
  const { data } = await apiClient.get('/notifications/unread-count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const markAsRead = async (id, token) => {
  const { data } = await apiClient.put(`/notifications/${id}/read`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const markAllAsRead = async (token) => {
  const { data } = await apiClient.put('/notifications/mark-all-read', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const deleteNotification = async (id, token) => {
  const { data } = await apiClient.delete(`/notifications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// User Profile API
export const updateUserProfile = async (userData, token) => {
  const { data } = await apiClient.put('/users/profile', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const changePassword = async (passwordData, token) => {
  const { data } = await apiClient.put('/users/change-password', passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// Password Reset API
export const forgotPassword = async (email) => {
  const { data } = await apiClient.post('/users/forgot-password', { email })
  return data
}

export const resetPassword = async (token, passwordData) => {
  const { data } = await apiClient.post(`/users/reset-password/${token}`, passwordData)
  return data
}

// Admin Products API
export const createProduct = async (productData, token) => {
  const { data } = await apiClient.post('/products', productData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const createProductWithFiles = async (formData, token) => {
  const { data } = await apiClient.post('/products', formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export const updateProduct = async (id, productData, token) => {
  const { data } = await apiClient.put(`/products/${id}`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const updateProductWithFiles = async (id, formData, token) => {
  const { data } = await apiClient.put(`/products/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export const deleteProduct = async (id, token) => {
  const { data } = await apiClient.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const getProductStats = async (token) => {
  const { data } = await apiClient.get('/products/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const getCategories = async () => {
  const { data } = await apiClient.get('/products/categories')
  return data
}

export const getCategoriesWithCounts = async () => {
  const { data } = await apiClient.get('/products/categories-with-counts')
  return data
}

// User Behavior Tracking API
export const trackSearch = async (searchData, token) => {
  const { data } = await apiClient.post('/user/track/search', searchData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const trackCategoryView = async (categoryData, token) => {
  const { data } = await apiClient.post('/user/track/category', categoryData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const trackProductView = async (productData, token) => {
  const { data } = await apiClient.post('/user/track/product', productData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const trackFilter = async (filterData, token) => {
  const { data } = await apiClient.post('/user/track/filter', filterData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const getUserAnalytics = async (token) => {
  const { data } = await apiClient.get('/user/analytics', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const getPersonalizedFeed = async (token) => {
  const { data } = await apiClient.get('/user/feed', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}
