import fs from 'node:fs/promises';
import { cloudinary } from '../config/cloudinary.js';

const hasCloudinary = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const buildLocalUrl = (req, file) =>
  `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

/**
 * Upload a single multer file (from req.file or req.files['fieldname'][i]) to
 * Cloudinary if configured, otherwise fall back to the local /uploads URL.
 * Always cleans up the temp file on the cloud path.
 */
export const uploadFile = async (req, file, folder = 'ficcs') => {
  if (!file) return null;

  if (hasCloudinary()) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto',
    });
    await fs.unlink(file.path).catch(() => {});
    return result.secure_url;
  }

  return buildLocalUrl(req, file);
};

/**
 * Backwards-compatible helper that uploads `req.file` and returns the URL.
 * Preserved so existing callers (mediaController.uploadMediaAsset) keep
 * working without changes.
 */
export const uploadAsset = (req, folder = 'ficcs') =>
  uploadFile(req, req.file, folder);
