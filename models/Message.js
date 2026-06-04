import { DataTypes } from 'sequelize';

let Message;

export const initMessage = (sequelize) => {
  Message = sequelize.define(
    'Message',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sentBy: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      audience: {
        type: DataTypes.ENUM('all'),
        defaultValue: 'all',
      },
    },
    {
      tableName: 'messages',
      timestamps: true,
    }
  );

  return Message;
};

export const getMessage = () => Message;
export default null;
