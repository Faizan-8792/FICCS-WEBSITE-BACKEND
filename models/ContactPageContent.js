import mongoose from 'mongoose';

const contactPageContentSchema = new mongoose.Schema(
  {
    headline: String,
    introText: String,
    contactSectionHeading: String,
    contactSectionCopy: String,
    officeEmail: String,
    officePhone: String,
    officeAddress: String,
    mapEmbedUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('ContactPageContent', contactPageContentSchema);
