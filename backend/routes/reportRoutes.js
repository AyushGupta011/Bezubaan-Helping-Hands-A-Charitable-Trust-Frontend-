import express from 'express';
import { submitReport, getReports } from '../controllers/reportController.js';

const router = express.Router();
router.post('/new', submitReport);
router.get('/all', getReports);

export default router;