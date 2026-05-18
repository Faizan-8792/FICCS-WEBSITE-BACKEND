import express from 'express';
import {
  createMedia,
  deleteMedia,
  getMedia,
  updateMedia,
  uploadMediaAsset,
} from '../controllers/mediaController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getMedia);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadMediaAsset);
router.post('/', protect, adminOnly, createMedia);
router
  .route('/:id')
  .put(protect, adminOnly, updateMedia)
  .delete(protect, adminOnly, deleteMedia);

export default router;
