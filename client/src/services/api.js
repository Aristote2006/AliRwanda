import axios from 'axios'

const API_URL = '/api'

// Products API
export const getProducts = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/products`, { params })
  return data
}

export const getProduct = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`)
  return data
}

export const getFeaturedProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products/featured`)
  return data
}

export const getTrendingProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products/trending`)
  return data
}

export const getTopProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products/top`)
  return data
}

export const getRelatedProducts = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/related/${id}`)
  return data
}

// Users API
export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/users/login`, {
    email,
    password,
  })
  return data
}

export const register = async (name, email, password) => {
  const { data } = await axios.post(`${API_URL}/users/register`, {
    name,
    email,
    password,
  })
  return data
}

export const getUserProfile = async (token) => {
  const { data } = await axios.get(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

// Orders API
export const createOrder = async (orderData, token) => {
  const { data } = await axios.post(`${API_URL}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getOrder = async (id, token) => {
  const { data } = await axios.get(`${API_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const getMyOrders = async (token) => {
  const { data } = await axios.get(`${API_URL}/orders/myorders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
