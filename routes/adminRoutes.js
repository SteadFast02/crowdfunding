import express from 'express';
import { createAdmin, deleteSubAdmin, loginAdmin, updateSubAdminStatus,dashboardStats,resetsubadminIds } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { resetAllData } from '../controllers/resetAll.js';

const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.post('/reset',protect, resetsubadminIds);

router.post('/updatestatus/:id',protect,updateSubAdminStatus)
router.post('/delete/:id',protect,deleteSubAdmin)
router.get('/dashboard', protect, dashboardStats);


router.post('/resetall',resetAllData)
export default router;