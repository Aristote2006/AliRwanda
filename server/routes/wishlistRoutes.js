import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getWishlist).post(protect, addToWishlist).delete(protect, clearWishlist);
router.route('/check/:productId').get(protect, checkInWishlist);
router.route('/:productId').delete(protect, removeFromWishlist);

export default router;
