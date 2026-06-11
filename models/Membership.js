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
      // Google Drive folder link where the generated application PDF and the
      // applicant's uploaded documents are archived. Empty when Drive export
      // is not configured or failed (submission still succeeds either way).
      driveFolderUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
      },
      details: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      // Links the application to the logged-in user account that submitted it,
      // so we can promote that user to member and show them their status.
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      // Overall lifecycle status (kept for backward compatibility / listing).
      status: {
        type: DataTypes.ENUM('new', 'reviewing', 'approved', 'rejected'),
        defaultValue: 'new',
      },
      // Stage 1 — admin reviews uploaded documents.
      documentStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      // Stage 2 — admin confirms payment (done off-platform via WhatsApp).
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'approved'),
        defaultValue: 'pending',
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
