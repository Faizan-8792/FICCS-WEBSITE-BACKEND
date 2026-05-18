import express from 'express';
import { changePassword, getMe, login, signup, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('photo'), updateProfile);
router.put('/password', protect, changePassword);

export default router;
