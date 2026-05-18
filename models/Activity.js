import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['academic', 'conference', 'research'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    body: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    highlights: [{ type: String, trim: true }],
    registerUrl: { type: String, default: '' },
    registerLabel: { type: String, default: 'Register / Learn More', trim: true },
    membersOnlyContact: { type: Boolean, default: true },
    contactWhatsappNumber: { type: String, default: '', trim: true },
    contactMessageTemplate: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
