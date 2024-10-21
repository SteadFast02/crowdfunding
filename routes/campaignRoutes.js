import express from 'express';
import { createCampaign, deleteCampaign, fetchCampaignById, listCampaigns, updateCampaign } from '../controllers/campaignController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createCampaign);
router.post('/delete/:id', protect, deleteCampaign);
router.get('/fetch/:id', protect, fetchCampaignById );
router.post('/update/:id', protect, updateCampaign );
router.get('/fetchall', protect, listCampaigns );


export default router;