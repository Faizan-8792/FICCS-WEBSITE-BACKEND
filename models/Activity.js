import { DataTypes } from 'sequelize';

let Activity;

export const initActivity = (sequelize) => {
  Activity = sequelize.define(
    'Activity',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('academic', 'conference', 'research'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      image: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      location: {
        type: DataTypes.STRING(255),
        defaultValue: '',
      },
      highlights: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      registerUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      registerLabel: {
        type: DataTypes.STRING(255),
        defaultValue: 'Register / Learn More',
      },
      membersOnlyContact: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      contactWhatsappNumber: {
        type: DataTypes.STRING(50),
        defaultValue: '',
      },
      contactMessageTemplate: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
    },
    {
      tableName: 'activities',
      timestamps: true,
    }
  );

  return Activity;
};

export const getActivity = () => Activity;
export default null;
