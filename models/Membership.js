import { DataTypes } from 'sequelize';

let Membership;

export const initMembership = (sequelize) => {
  Membership = sequelize.define(
    'Membership',
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
      mobile: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      dob: {
        type: DataTypes.STRING(50),
        defaultValue: '',
      },
      gender: {
        type: DataTypes.STRING(20),
        defaultValue: '',
      },
      isTrainee: {
        type: DataTypes.STRING(50),
        defaultValue: '',
      },
      presentAffiliation: {
        type: DataTypes.STRING(255),
        defaultValue: '',
      },
      presentState: {
        type: DataTypes.STRING(100),
        defaultValue: '',
      },
      correspondingAddress: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      permanentAddress: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      degrees: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      mdDnbSubject: {
        type: DataTypes.STRING(255),
        defaultValue: '',
      },
      dmJoiningYear: {
        type: DataTypes.STRING(10),
        defaultValue: '',
      },
      dmCompletedYear: {
        type: DataTypes.STRING(10),
        defaultValue: '',
      },
      profilePictureUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      mciCertificateUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      govtIdUrls: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      degreeCertificateUrls: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      details: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      status: {
        type: DataTypes.ENUM('new', 'reviewing', 'approved', 'rejected'),
        defaultValue: 'new',
      },
    },
    {
      tableName: 'memberships',
      timestamps: true,
    }
  );

  return Membership;
};

export const getMembership = () => Membership;
export default null;
