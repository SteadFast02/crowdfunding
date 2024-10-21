import express from 'express';
import { createPledge } from '../controllers/pledgeController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/create/:campaignid', protect, createPledge);
export default router;