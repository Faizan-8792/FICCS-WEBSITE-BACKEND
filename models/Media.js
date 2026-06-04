import { DataTypes } from 'sequelize';

let Media;

export const initMedia = (sequelize) => {
  Media = sequelize.define(
    'Media',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('photo', 'video'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
    },
    {
      tableName: 'media',
      timestamps: true,
    }
  );

  return Media;
};

export const getMedia = () => Media;
export default null;
