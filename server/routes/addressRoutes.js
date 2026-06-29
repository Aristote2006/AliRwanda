import express from 'express';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getAddresses).post(protect, createAddress);
router
  .route('/:id')
  .get(protect, getAddressById)
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);
router.route('/:id/default').put(protect, setDefaultAddress);

export default router;
