import * as Sequelize from "sequelize";
import { Database } from "../config";
const sequelize = Database.sequelize;

const ProjectUserWorkspace = sequelize.define(
  "project_user_workspaces",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { 
        model: "workspaces",
        key: "id",
      },
      field: "workspace_id",
    },
    assignedToId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_workspaces",
        key: "id",
      },
      field: "assigned_to_id",
    },
    assignedById: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_workspaces",
        key: "id",
      },
      field: "assigned_by_id",
    },
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
      field: "project_id",
    },
    assignedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      field: "assigned_at",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["workspaceId", "projectId", "assignedToId"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);

export default ProjectUserWorkspace;
