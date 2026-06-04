import { DataTypes } from 'sequelize';

let MembershipPageContent;

export const initMembershipPageContent = (sequelize) => {
  MembershipPageContent = sequelize.define(
    'MembershipPageContent',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      heroEyebrow: { type: DataTypes.STRING(255), defaultValue: '' },
      heroTitle: { type: DataTypes.STRING(255), defaultValue: '' },
      heroCopy: { type: DataTypes.TEXT, defaultValue: '' },
      eligibilitySection: { type: DataTypes.JSON, defaultValue: {} },
      benefitsSection: { type: DataTypes.JSON, defaultValue: {} },
      whyItMattersSection: { type: DataTypes.JSON, defaultValue: {} },
    },
    {
      tableName: 'membership_page_content',
      timestamps: true,
    }
  );

  return MembershipPageContent;
};

export const getMembershipPageContent = () => MembershipPageContent;
export default null;
