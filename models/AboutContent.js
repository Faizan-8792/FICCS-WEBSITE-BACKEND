import mongoose from 'mongoose';

const aboutFounderSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    description: String,
    image: String,
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    year: String,
    title: String,
    description: String,
  },
  { _id: false }
);

const iconItemSchema = new mongoose.Schema(
  {
    icon: String,
    label: String,
  },
  { _id: false }
);

const iconCardSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    copy: String,
  },
  { _id: false }
);

const aboutContentSchema = new mongoose.Schema(
  {
    companyDescription: String,
    mission: String,
    founderNote: String,
    contactEmail: String,
    contactPhone: String,
    contactAddress: String,
    founders: [aboutFounderSchema],
    timeline: [timelineSchema],
    whoWeAre: {
      eyebrow: String,
      heading: String,
      description: String,
    },
    whyItMatters: {
      eyebrow: String,
      heading: String,
      description1: String,
      description2: String,
      items: [iconItemSchema],
    },
    intensivistRole: {
      eyebrow: String,
      heading: String,
      description: String,
      cards: [iconCardSchema],
    },
    visionMission: {
      eyebrow: String,
      heading: String,
      description: String,
      items: [iconItemSchema],
    },
    standardsEthics: {
      eyebrow: String,
      heading: String,
      description1: String,
      description2: String,
      blockquote: String,
      blockquoteFooter: String,
    },
    collaboration: {
      eyebrow: String,
      heading: String,
      description: String,
      items: [iconItemSchema],
    },
    commitment: {
      heading: String,
      description1: String,
      description2: String,
    },
    timelineSection: {
      eyebrow: String,
      title: String,
    },
    foundersSection: {
      eyebrow: String,
      title: String,
      copy: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AboutContent', aboutContentSchema);
