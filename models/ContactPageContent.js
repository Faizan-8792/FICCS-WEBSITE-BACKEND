import { DataTypes } from 'sequelize';

let ContactPageContent;

export const initContactPageContent = (sequelize) => {
  ContactPageContent = sequelize.define(
    'ContactPageContent',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      headline: { type: DataTypes.STRING(255), defaultValue: '' },
      introText: { type: DataTypes.TEXT, defaultValue: '' },
      contactSectionHeading: { type: DataTypes.STRING(255), defaultValue: '' },
      contactSectionCopy: { type: DataTypes.TEXT, defaultValue: '' },
      officeEmail: { type: DataTypes.STRING(255), defaultValue: '' },
      officePhone: { type: DataTypes.STRING(50), defaultValue: '' },
      officeAddress: { type: DataTypes.TEXT, defaultValue: '' },
      mapEmbedUrl: { type: DataTypes.STRING(500), defaultValue: '' },
    },
    {
      tableName: 'contact_page_content',
      timestamps: true,
    }
  );

  return ContactPageContent;
};

export const getContactPageContent = () => ContactPageContent;
export default null;
