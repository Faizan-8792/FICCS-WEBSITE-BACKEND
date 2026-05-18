import Media from '../models/Media.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultMedia } from '../utils/defaultContent.js';
import { uploadAsset } from '../utils/uploadAsset.js';

export const getMedia = asyncHandler(async (req, res) => {
  let media = await Media.find().sort({ createdAt: -1 });
  if (!media.length) {
    await Media.insertMany(defaultMedia);
    media = await Media.find().sort({ createdAt: -1 });
  }
  res.json(media);
});

export const createMedia = asyncHandler(async (req, res) => {
  const media = await Media.create(req.body);
  res.status(201).json(media);
});

export const updateMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!media) {
    res.status(404);
    throw new Error('Media item not found');
  }

  res.json(media);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id);

  if (!media) {
    res.status(404);
    throw new Error('Media item not found');
  }

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
