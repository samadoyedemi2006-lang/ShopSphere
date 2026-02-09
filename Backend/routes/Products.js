import express from 'express';
import { getProducts, addProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, addProduct);

router.route('/:id')
  .delete(protect, admin, deleteProduct);

export default router;