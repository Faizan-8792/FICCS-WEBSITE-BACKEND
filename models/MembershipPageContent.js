import mongoose from 'mongoose';

const eligibilitySchema = new mongoose.Schema(
  {
    text: String,
  },
  { _id: false }
);

const benefitSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    copy: String,
  },
  { _id: false }
);

const membershipStatSchema = new mongoose.Schema(
  {
    stat: String,
    label: String,
  },
  { _id: false }
);

const membershipPageContentSchema = new mongoose.Schema(
  {
    heroEyebrow: String,
    heroTitle: String,
    heroCopy: String,
    eligibilitySection: {
      eyebrow: String,
      heading: String,
      description: String,
      items: [eligibilitySchema],
    },
    benefitsSection: {
      eyebrow: String,
      heading: String,
      description: String,
      items: [benefitSchema],
    },
    whyItMattersSection: {
      eyebrow: String,
      heading: String,
      description1: String,
      description2: String,
      ctaText: String,
      ctaLink: String,
      stats: [membershipStatSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.model('MembershipPageContent', membershipPageContentSchema);
