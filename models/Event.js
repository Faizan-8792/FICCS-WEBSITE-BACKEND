import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    body: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    date: { type: Date, required: true },
    location: { type: String, default: '' },
    registerUrl: { type: String, default: '' },
    registerLabel: { type: String, default: 'Register / Learn More', trim: true },
    membersOnlyContact: { type: Boolean, default: true },
    contactWhatsappNumber: { type: String, default: '', trim: true },
    contactMessageTemplate: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
