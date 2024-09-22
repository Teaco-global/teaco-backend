
import { Database } from "../config";
import { UserModelInterface } from "../interfaces";
import { UsersStatusEnum } from "../enums";
import { DataTypes } from "sequelize";
import Workspace from "./workspace";
import UserWorkspace from "./userWorkspace";
import UserRole from "./userRole";

const sequelize = Database.sequelize

const User = sequelize.define<UserModelInterface>(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        UsersStatusEnum.VERFIED,
        UsersStatusEnum.UNVERIFIED
      ),
    },
    verificationCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [5, 5],
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: "users_email",
        fields: ["email"],
        where: {
          deletedAt: null,
        },
      },
      {
        unique: true,
        name: "users_verification_code",
        fields: ["verification_code"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

User.hasMany(UserWorkspace, {
  foreignKey: 'userId',
  as: 'userWorkspaces',
});

UserWorkspace.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(UserRole, {
  foreignKey: 'userId',
  as: 'roleRoles',
});

UserRole.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

/* User and Workspace relation */
Workspace.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

User.hasOne(Workspace, {
  foreignKey: 'ownerId',
  as: 'ownerWorkspace',
});

Workspace.belongsToMany(User, {
  through: { model: UserWorkspace },
  as: 'users',
  foreignKey: 'workspaceId',
  otherKey: 'userId',
});

User.belongsToMany(Workspace, {
  through: { model: UserWorkspace },
  as: 'workspaces',
  foreignKey: 'userId',
  otherKey: 'workspaceId',
});

export default User
