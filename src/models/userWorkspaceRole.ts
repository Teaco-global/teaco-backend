import * as Sequelize from 'sequelize';
import { Database } from '../config';
import UserWorkspace from './userWorkspace';
const sequelize = Database.sequelize;

const UserWorkspaceRole = sequelize.define<any>(
  'user_workspace_roles',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userWorkspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user_workspaces',
        key: 'id',
      },
      field: 'user_workspace_id',
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
        fields: ['userWorkspaceId', 'roleId'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default UserWorkspaceRole;

