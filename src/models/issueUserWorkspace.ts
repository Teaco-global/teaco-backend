import * as Sequelize from "sequelize";
import { Database } from "../config";

const sequelize = Database.sequelize;

const IssueUserWorkspace = sequelize.define(
  "issue_user_workspaces",
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
    issueId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "issues",
        key: "id",
      },
      field: "issue_id",
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
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["workspaceId", "issueId", "assignedToId"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);

export default IssueUserWorkspace;
