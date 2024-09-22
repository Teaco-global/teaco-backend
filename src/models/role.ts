import * as Sequelize from 'sequelize';

import { RoleModelInterface } from '../interfaces';
import { Database } from '../config';
import User from './user';
import UserRole from './userRole';
import UserWorkspaceRole from './userWorkspaceRole';
const sequelize = Database.sequelize;

const Role = sequelize.define<RoleModelInterface>(
  'roles',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

Role.hasMany(UserWorkspaceRole, {
  foreignKey: 'roleId',
  as: 'userWorkspaceRoles',
});

UserWorkspaceRole.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

Role.hasMany(UserRole, {
  foreignKey: 'roleId',
  as: 'role_users',
});

UserRole.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

User.belongsToMany(Role, {
  through: { model: UserRole },
  as: 'roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
});

Role.belongsToMany(User, {
  through: { model: UserRole },
  as: 'users',
  foreignKey: 'roleId',
  otherKey: 'userId',
});

export default Role;
