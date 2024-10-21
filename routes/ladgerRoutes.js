import express from 'express';
import { Ledger } from '../controllers/ladgerController.js';

const router = express.Router();

// Route to render the ledger
router.get('/fetch', Ledger);

export default router;
