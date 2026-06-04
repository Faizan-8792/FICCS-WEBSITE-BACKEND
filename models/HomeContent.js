import { DataTypes } from 'sequelize';

let HomeContent;

export const initHomeContent = (sequelize) => {
  HomeContent = sequelize.define(
    'HomeContent',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      heroTitle: { type: DataTypes.STRING(255), defaultValue: '' },
      heroSubtitle: { type: DataTypes.TEXT, defaultValue: '' },
      heroVideoUrl: { type: DataTypes.STRING(500), defaultValue: '' },
      heroCta1Link: { type: DataTypes.STRING(500), defaultValue: '' },
      heroCta2Link: { type: DataTypes.STRING(500), defaultValue: '' },
      aboutPreviewText: { type: DataTypes.TEXT, defaultValue: '' },
      aboutPreviewSection: { type: DataTypes.JSON, defaultValue: {} },
      aboutPreviewStats: { type: DataTypes.JSON, defaultValue: {} },
      aimTitle: { type: DataTypes.STRING(255), defaultValue: '' },
      aimDescription: { type: DataTypes.TEXT, defaultValue: '' },
      aimImage: { type: DataTypes.STRING(500), defaultValue: '' },
      founders: { type: DataTypes.JSON, defaultValue: [] },
      recentActivities: { type: DataTypes.JSON, defaultValue: [] },
      socialLinks: { type: DataTypes.JSON, defaultValue: {} },
      impactStats: { type: DataTypes.JSON, defaultValue: {} },
      eventsSection: { type: DataTypes.JSON, defaultValue: {} },
      featuredSection: { type: DataTypes.JSON, defaultValue: {} },
      latestProgramsSection: { type: DataTypes.JSON, defaultValue: {} },
      testimonials: { type: DataTypes.JSON, defaultValue: {} },
      focusAreas: { type: DataTypes.JSON, defaultValue: [] },
      focusAreasSection: { type: DataTypes.JSON, defaultValue: {} },
      recentUpdatesSection: { type: DataTypes.JSON, defaultValue: {} },
      missionBanner: { type: DataTypes.JSON, defaultValue: {} },
      activitiesPageHero: { type: DataTypes.JSON, defaultValue: {} },
      activitiesSection: { type: DataTypes.JSON, defaultValue: {} },
      mediaPageHero: { type: DataTypes.JSON, defaultValue: {} },
      photoGallerySection: { type: DataTypes.JSON, defaultValue: {} },
      videoGallerySection: { type: DataTypes.JSON, defaultValue: {} },
      contactPageHero: { type: DataTypes.JSON, defaultValue: {} },
    },
    {
      tableName: 'home_content',
      timestamps: true,
    }
  );

  return HomeContent;
};

export const getHomeContent = () => HomeContent;
export default null;
