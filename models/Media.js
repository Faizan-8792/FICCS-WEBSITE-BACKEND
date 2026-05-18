import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['photo', 'video'], required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
