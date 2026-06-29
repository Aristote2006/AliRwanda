import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.route('/unread-count').get(protect, getUnreadCount);
router.route('/mark-all-read').put(protect, markAllAsRead);
router.route('/:id').put(protect, markAsRead).delete(protect, deleteNotification);

export default router;
