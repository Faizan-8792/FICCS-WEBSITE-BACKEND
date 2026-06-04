import express from 'express';
import {
  getMemberships,
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

router.post('/', membershipUpload, submitMembership);
router.get('/', protect, adminOnly, getMemberships);
router.patch('/:id/status', protect, adminOnly, updateMembershipStatus);

export default router;
