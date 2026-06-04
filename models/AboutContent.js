import { DataTypes } from 'sequelize';

let AboutContent;

export const initAboutContent = (sequelize) => {
  AboutContent = sequelize.define(
    'AboutContent',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      companyDescription: { type: DataTypes.TEXT, defaultValue: '' },
      mission: { type: DataTypes.TEXT, defaultValue: '' },
      founderNote: { type: DataTypes.TEXT, defaultValue: '' },
      contactEmail: { type: DataTypes.STRING(255), defaultValue: '' },
      contactPhone: { type: DataTypes.STRING(50), defaultValue: '' },
      contactAddress: { type: DataTypes.TEXT, defaultValue: '' },
      founders: { type: DataTypes.JSON, defaultValue: [] },
      timeline: { type: DataTypes.JSON, defaultValue: [] },
      whoWeAre: { type: DataTypes.JSON, defaultValue: {} },
      whyItMatters: { type: DataTypes.JSON, defaultValue: {} },
      intensivistRole: { type: DataTypes.JSON, defaultValue: {} },
      visionMission: { type: DataTypes.JSON, defaultValue: {} },
      standardsEthics: { type: DataTypes.JSON, defaultValue: {} },
      collaboration: { type: DataTypes.JSON, defaultValue: {} },
      commitment: { type: DataTypes.JSON, defaultValue: {} },
      timelineSection: { type: DataTypes.JSON, defaultValue: {} },
      foundersSection: { type: DataTypes.JSON, defaultValue: {} },
    },
    {
      tableName: 'about_content',
      timestamps: true,
    }
  );

  return AboutContent;
};

export const getAboutContent = () => AboutContent;
export default null;
