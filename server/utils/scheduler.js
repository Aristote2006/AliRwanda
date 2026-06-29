import { rotateAllProducts } from './productRotation.js'

/**
 * Initialize the product rotation scheduler
 * Runs every 24 hours
 */
export const initializeScheduler = () => {
  console.log('Initializing product rotation scheduler...')

  // Run immediately on startup
  rotateAllProducts()
    .then(() => console.log('Initial product rotation completed'))
    .catch((err) => console.error('Initial product rotation failed:', err))

  // Schedule rotation every 24 hours (86400000 ms)
  const rotationInterval = setInterval(() => {
    console.log('Running scheduled product rotation...')
    rotateAllProducts()
      .then(() => console.log('Scheduled product rotation completed'))
      .catch((err) => console.error('Scheduled product rotation failed:', err))
  }, 24 * 60 * 60 * 1000) // 24 hours

  // Store interval reference for cleanup if needed
  global.productRotationInterval = rotationInterval

  console.log('Product rotation scheduler initialized (runs every 24 hours)')
}

/**
 * Stop the product rotation scheduler
 */
export const stopScheduler = () => {
  if (global.productRotationInterval) {
    clearInterval(global.productRotationInterval)
    console.log('Product rotation scheduler stopped')
  }
}

export default {
  initializeScheduler,
  stopScheduler,
}
