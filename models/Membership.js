import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    status: { type: String, default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Membership', membershipSchema);
