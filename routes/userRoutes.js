import express from 'express';
import { createUser, fetchUserById, fetchAllUsers, deleteUser, loginUser,fetchAllCampaign } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/fetchone', protect, fetchUserById);
router.get('/fetchall', protect, fetchAllUsers);
router.post('/delete/:id', protect, deleteUser);
router.get('/fetchall/campaign',fetchAllCampaign)
export default router;
