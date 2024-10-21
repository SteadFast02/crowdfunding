import express from 'express';
import { createsubAdmin, loginsubAdmin } from '../controllers/subadminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', protect, createsubAdmin);
router.post('/login', loginsubAdmin);

export default router;