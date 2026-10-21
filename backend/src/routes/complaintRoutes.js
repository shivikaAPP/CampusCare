import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getComplaintStats,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/all', protect, adminOnly, getAllComplaints);
router.get('/analytics', protect, getComplaintStats);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, adminOnly, updateComplaintStatus);
router.delete('/:id', protect, deleteComplaint);

export default router;
