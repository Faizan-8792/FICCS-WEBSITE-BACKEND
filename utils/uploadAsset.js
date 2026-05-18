import fs from 'node:fs/promises';
import { cloudinary } from '../config/cloudinary.js';

export const uploadAsset = async (req, folder = 'ficcs') => {
  if (!req.file) {
    return null;
  }

  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder,
      resource_type: 'auto',
    });

    await fs.unlink(req.file.path);
    return result.secure_url;
  }

  return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};
