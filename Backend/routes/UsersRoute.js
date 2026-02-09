import express from 'express';
const router = express.Router();

import { getAllUsers, deleteUser, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

// Public routes
router.get("/", getAllUsers);
router.delete("/:deleteUserId", protect, admin, deleteUser);
router.patch("/:userId/role", protect, admin, updateUserRole);
export default router;