import { getMedia as getMediaModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultMedia } from '../utils/defaultContent.js';
import { uploadAsset } from '../utils/uploadAsset.js';

export const getMedia = asyncHandler(async (req, res) => {
  const Media = getMediaModel();
  const media = await Media.findAll({ order: [['createdAt', 'DESC']] });

  if (!media.length) {
    // Respond with defaults immediately; seed in the background so a slow/
    // failing write on a fresh DB can never hang the request.
    res.json(defaultMedia);
    Media.bulkCreate(defaultMedia).catch((err) =>
      console.error('[media] background seed failed:', err.message)
    );
    return;
  }

  res.json(media);
});

export const createMedia = asyncHandler(async (req, res) => {
  const Media = getMediaModel();
  const media = await Media.create(req.body);
  res.status(201).json(media);
});

export const updateMedia = asyncHandler(async (req, res) => {
  const Media = getMediaModel();
  const media = await Media.findByPk(req.params.id);

  if (!media) {
    res.status(404);
    throw new Error('Media item not found');
  }

  await media.update(req.body);
  res.json(media);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const Media = getMediaModel();
  const media = await Media.findByPk(req.params.id);

  if (!media) {
    res.status(404);
    throw new Error('Media item not found');
  }

  await media.destroy();
  res.json({ message: 'Media item deleted' });
});

export const uploadMediaAsset = asyncHandler(async (req, res) => {
  const url = await uploadAsset(req, 'ficcs-media');

  if (!url) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  res.status(201).json({ url });
});
