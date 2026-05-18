import mongoose from 'mongoose';

/**
 * Tracks per-user read/dismissed state for broadcast messages.
 * One document per (user, message) pair.
 */
const userMessageStateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    read: { type: Boolean, default: false },
    dismissed: { type: Boolean, default: false }, // user deleted it from their view
  },
  { timestamps: true }
);

// Compound unique index — one state per user+message
userMessageStateSchema.index({ user: 1, message: 1 }, { unique: true });

export default mongoose.model('UserMessageState', userMessageStateSchema);
