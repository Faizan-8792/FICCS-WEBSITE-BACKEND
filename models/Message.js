import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // 'all' = broadcast to all approved users
    audience: { type: String, enum: ['all'], default: 'all' },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
