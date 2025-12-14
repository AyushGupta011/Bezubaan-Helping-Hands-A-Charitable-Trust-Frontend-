import express from 'express';
import { submitVolunteer, getVolunteers } from '../controllers/volunteerController.js';

const router = express.Router();
router.post('/new', submitVolunteer);
router.get('/all', getVolunteers);

export default router;
