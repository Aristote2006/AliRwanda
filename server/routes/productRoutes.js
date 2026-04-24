import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getRelatedProducts,
  getCategories,
  getProductStats,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.array('productImages', 10), createProduct);
router.route('/top').get(getTopProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/trending').get(getTrendingProducts);
router.route('/related/:id').get(getRelatedProducts);
router.route('/categories').get(getCategories);
router.route('/stats').get(protect, admin, getProductStats);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.array('productImages', 10), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
