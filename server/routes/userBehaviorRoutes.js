import express from 'express';
import {
  trackSearch,
  trackCategoryView,
  trackProductView,
  trackFilter,
  getUserAnalytics,
  getPersonalizedFeed,
} from '../controllers/userBehaviorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Tracking endpoints
router.post('/track/search', protect, trackSearch);
router.post('/track/category', protect, trackCategoryView);
router.post('/track/product', protect, trackProductView);
router.post('/track/filter', protect, trackFilter);

// Analytics and Feed endpoints
router.get('/analytics', protect, getUserAnalytics);
router.get('/feed', protect, getPersonalizedFeed);

export default router;
