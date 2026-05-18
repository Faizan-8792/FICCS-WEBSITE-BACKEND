import mongoose from 'mongoose';

const founderSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    image: String,
    bio: String,
  },
  { _id: false }
);

const recentActivitySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: Date,
  },
  { _id: false }
);

const impactStatSchema = new mongoose.Schema(
  {
    icon: String,
    value: Number,
    suffix: String,
    label: String,
    description: String,
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    quote: String,
    name: String,
    title: String,
    image: String,
  },
  { _id: false }
);

const focusAreaSchema = new mongoose.Schema(
  {
    label: String,
    icon: String,
    slug: String,
    desc: String,
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    heroTitle: String,
    heroSubtitle: String,
    heroVideoUrl: String,
    heroCta1Link: String,
    heroCta2Link: String,
    aboutPreviewText: String,
    aboutPreviewSection: {
      eyebrow: String,
      title: String,
      ctaText: String,
      ctaUrl: String,
    },
    aboutPreviewStats: {
      programLabel: String,
      programTitle: String,
      programCopy: String,
      stat1Value: String,
      stat1Label: String,
      stat2Value: String,
      stat2Label: String,
    },
    aimTitle: String,
    aimDescription: String,
    aimImage: String,
    founders: [founderSchema],
    recentActivities: [recentActivitySchema],
    socialLinks: {
      linkedin: String,
      instagram: String,
      x: String,
    },
    impactStats: {
      eyebrow: String,
      heading: String,
      description: String,
      items: [impactStatSchema],
    },
    eventsSection: {
      eyebrow: String,
      title: String,
      copy: String,
    },
    featuredSection: {
      heading: String,
      eyebrow: String,
      linkText: String,
      linkUrl: String,
      ctaText: String,
      ctaUrl: String,
    },
    latestProgramsSection: {
      heading: String,
      linkText: String,
      linkUrl: String,
    },
    testimonials: {
      eyebrow: String,
      heading: String,
      description: String,
      items: [testimonialSchema],
    },
    focusAreas: [focusAreaSchema],
    focusAreasSection: {
      heading: String,
    },
    recentUpdatesSection: {
      heading: String,
    },
    missionBanner: {
      eyebrow: String,
      heading: String,
      description: String,
      cta1Text: String,
      cta1Link: String,
      cta2Text: String,
      cta2Link: String,
    },
    activitiesPageHero: {
      eyebrow: String,
      title: String,
      copy: String,
    },
    activitiesSection: {
      eyebrow: String,
      title: String,
      copy: String,
    },
    mediaPageHero: {
      eyebrow: String,
      title: String,
      copy: String,
    },
    photoGallerySection: {
      eyebrow: String,
      title: String,
    },
    videoGallerySection: {
      eyebrow: String,
      title: String,
    },
    contactPageHero: {
      eyebrow: String,
      title: String,
      copy: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('HomeContent', homeContentSchema);
