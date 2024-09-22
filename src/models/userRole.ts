import * as Sequelize from 'sequelize';
import { Database } from '../config';
const sequelize = Database.sequelize;

const UserRole = sequelize.define<any>(
  'user_roles',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      field: 'role_id',
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'roleId'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default UserRole;
