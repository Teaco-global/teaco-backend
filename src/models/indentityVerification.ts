import * as Sequelize from 'sequelize';
import { Database } from '../config';
const sequelize = Database.sequelize;

const IdentityVerification = sequelize.define(
  'identity_verifications',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    identity: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'identity',
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'expiry_date',
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['token', 'identity'],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

export default IdentityVerification;
