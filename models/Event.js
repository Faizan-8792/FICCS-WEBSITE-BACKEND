import { DataTypes } from 'sequelize';

let Event;

export const initEvent = (sequelize) => {
  Event = sequelize.define(
    'Event',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
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
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        defaultValue: '',
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
      tableName: 'events',
      timestamps: true,
    }
  );

  return Event;
};

export const getEvent = () => Event;
export default null;
