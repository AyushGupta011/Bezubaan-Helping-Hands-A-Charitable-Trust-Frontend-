import express from 'express';
import {createOrder,verifyPayment, getDonations } from '../controllers/DonationController.js';

const router = express.Router();
router.post('/donate', createOrder);
router.post('/verify', verifyPayment);
router.get('/all', getDonations);

export default router;