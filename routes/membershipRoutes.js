import express from 'express';
import {
  approveMembershipDocuments,
  approveMembershipPayment,
  getMemberships,
  getMyMembership,
  submitMembership,
  updateMembershipStatus,
} from '../controllers/membershipController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const membershipUpload = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'mciCertificate', maxCount: 1 },
  { name: 'govtId', maxCount: 5 },
  { name: 'degreeCertificates', maxCount: 5 },
]);

// Applicant submits (protected so we can link the application to their account).
router.post('/', protect, membershipUpload, submitMembership);
// Applicant views their own application + approval stage.
router.get('/mine', protect, getMyMembership);

// Admin
router.get('/', protect, adminOnly, getMemberships);
router.patch('/:id/documents', protect, adminOnly, approveMembershipDocuments);
router.patch('/:id/payment', protect, adminOnly, approveMembershipPayment);
router.patch('/:id/status', protect, adminOnly, updateMembershipStatus);

export default router;
