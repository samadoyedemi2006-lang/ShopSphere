import express from "express";
const router = express.Router();

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { getUserOrders } from "../controllers/userController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// User creates order & views own orders
router.route("/my-orders")
  .post(protect, createOrder)
  .get(protect, getMyOrders);

// Admin gets all orders
router.route("/all")
  .get(protect, admin, getAllOrders);

// Get single order by ID (MUST BE LAST)
router.route("/:id")
  .get(protect, getOrderById);

// Update order status (Admin only)
router.route("/:id/status")
  .patch(protect, admin, updateOrderStatus);

router.route("/user/:userId")
  .get(protect, admin, getUserOrders);

export default router;
