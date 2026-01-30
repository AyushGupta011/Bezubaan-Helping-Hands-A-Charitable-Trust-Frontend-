import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllContacts,
  getAllVolunteers,
  getAllReports,
  getAllDonations,
  updateReportStatus,
  deleteContact,
  verifyAdmin,
  adminLogout
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);
router.post('/verify', verifyAdmin);
router.post('/logout', adminLogout);

// Protected routes
router.get('/dashboard-stats', authMiddleware, getDashboardStats);
router.get('/contacts', authMiddleware, getAllContacts);
router.get('/volunteers', authMiddleware, getAllVolunteers);
router.get('/reports', authMiddleware, getAllReports);
router.get('/donations', authMiddleware, getAllDonations);

// Update routes
router.put('/reports/:id/status', authMiddleware, updateReportStatus);

// Delete routes
router.delete('/contacts/:id', authMiddleware, deleteContact);

export default router;
