import Product from '../models/Product.js'

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000

// In-memory cache (in production, use Redis or similar)
let featuredCache = {
  products: [],
  lastUpdated: null,
}

let trendingCache = {
  products: [],
  lastUpdated: null,
}

/**
 * Check if cache is expired
 * @param {number} lastUpdated - Timestamp of last update
 * @returns {boolean}
 */
const isCacheExpired = (lastUpdated) => {
  if (!lastUpdated) return true
  return Date.now() - lastUpdated > CACHE_DURATION
}

/**
 * Select random products from a list
 * @param {Array} products - Array of products
 * @param {number} count - Number of products to select
 * @returns {Array}
 */
const selectRandomProducts = (products, count) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Rotate featured products
 * Selects 8 random products to be featured and updates their flags
 * @returns {Promise<Array>} - Array of featured products
 */
export const rotateFeaturedProducts = async () => {
  try {
    // Check if cache is still valid
    if (!isCacheExpired(featuredCache.lastUpdated)) {
      return featuredCache.products
    }

    // Get all products with good ratings and stock
    const eligibleProducts = await Product.find({
      countInStock: { $gt: 0 },
      rating: { $gte: 3 },
    })

    // Select 8 random products
    const selectedProducts = selectRandomProducts(eligibleProducts, 8)

    // Reset all featured flags
    await Product.updateMany({}, { isFeatured: false })

    // Set new featured flags
    const productIds = selectedProducts.map((p) => p._id)
    await Product.updateMany(
      { _id: { $in: productIds } },
      { isFeatured: true }
    )

    // Update cache
    featuredCache = {
      products: selectedProducts,
      lastUpdated: Date.now(),
    }

    console.log(`Featured products rotated: ${selectedProducts.length} products`)
    return selectedProducts
  } catch (error) {
    console.error('Error rotating featured products:', error)
    throw error
  }
}

/**
 * Rotate trending products
 * Selects 8 random products to be trending and updates their flags
 * @returns {Promise<Array>} - Array of trending products
 */
export const rotateTrendingProducts = async () => {
  try {
    // Check if cache is still valid
    if (!isCacheExpired(trendingCache.lastUpdated)) {
      return trendingCache.products
    }

    // Get all products with good ratings and stock
    const eligibleProducts = await Product.find({
      countInStock: { $gt: 0 },
      rating: { $gte: 3 },
    })

    // Select 8 random products
    const selectedProducts = selectRandomProducts(eligibleProducts, 8)

    // Reset all trending flags
    await Product.updateMany({}, { isTrending: false })

    // Set new trending flags
    const productIds = selectedProducts.map((p) => p._id)
    await Product.updateMany(
      { _id: { $in: productIds } },
      { isTrending: true }
    )

    // Update cache
    trendingCache = {
      products: selectedProducts,
      lastUpdated: Date.now(),
    }

    console.log(`Trending products rotated: ${selectedProducts.length} products`)
    return selectedProducts
  } catch (error) {
    console.error('Error rotating trending products:', error)
    throw error
  }
}

/**
 * Rotate both featured and trending products
 * @returns {Promise<Object>} - Object with featured and trending products
 */
export const rotateAllProducts = async () => {
  const [featured, trending] = await Promise.all([
    rotateFeaturedProducts(),
    rotateTrendingProducts(),
  ])

  return { featured, trending }
}

/**
 * Get cached featured products
 * @returns {Array}
 */
export const getCachedFeaturedProducts = () => {
  return featuredCache.products
}

/**
 * Get cached trending products
 * @returns {Array}
 */
export const getCachedTrendingProducts = () => {
  return trendingCache.products
}

/**
 * Force cache refresh (bypass expiration check)
 * @returns {Promise<Object>}
 */
export const forceRefreshCache = async () => {
  featuredCache.lastUpdated = null
  trendingCache.lastUpdated = null
  return await rotateAllProducts()
}

export default {
  rotateFeaturedProducts,
  rotateTrendingProducts,
  rotateAllProducts,
  getCachedFeaturedProducts,
  getCachedTrendingProducts,
  forceRefreshCache,
}
