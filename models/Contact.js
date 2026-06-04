import { DataTypes } from 'sequelize';

let Contact;

export const initContact = (sequelize) => {
  Contact = sequelize.define(
    'Contact',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'new',
      },
    },
    {
      tableName: 'contacts',
      timestamps: true,
    }
  );

  return Contact;
};

export const getContact = () => Contact;
export default null;
