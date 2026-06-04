import { DataTypes } from 'sequelize';

let UserMessageState;

export const initUserMessageState = (sequelize) => {
  UserMessageState = sequelize.define(
    'UserMessageState',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      messageId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dismissed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'user_message_states',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'messageId'],
        },
      ],
    }
  );

  return UserMessageState;
};

export const getUserMessageState = () => UserMessageState;
export default null;
