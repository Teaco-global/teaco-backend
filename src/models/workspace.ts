import { Database } from "../config";
import { WorkspaceModelInterface } from "../interfaces";
import { DataTypes } from "sequelize"; 
import UserWorkspace from "./userWorkspace";

const sequelize = Database.sequelize;

const Workspace = sequelize.define<WorkspaceModelInterface>(
  "workspaces",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", 
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: "secret",
        fields: ["secret"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

UserWorkspace.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

Workspace.hasMany(UserWorkspace, {
  foreignKey: 'workspaceId',
  as: 'workspaceUsers',
});

export default Workspace;
