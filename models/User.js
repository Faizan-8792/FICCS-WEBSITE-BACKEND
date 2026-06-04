import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/db.js';

let User;

export const initUser = (sequelize) => {
  User = sequelize.define(
    'User',
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
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved'),
        defaultValue: 'pending',
      },
      approvedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      photo: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      bio: {
        type: DataTypes.STRING(300),
        defaultValue: '',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password && !user.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password') && !user.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.matchPassword = function matchPassword(enteredPassword) {
    if (!enteredPassword || !this.password) return Promise.resolve(false);
    return bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};

export const getUser = () => User;
export default null; // Will be replaced after init
