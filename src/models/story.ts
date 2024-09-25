import * as Sequelize from "sequelize";
import { Database } from "../config";
const sequelize = Database.sequelize;

const Story = sequelize.define(
  "stories",
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
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
      field: "project_id",
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
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_workspaces",
        key: "id",
      },
      field: "created_by_id",
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
    sprintId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "sprints",
        key: "id",
      },
      field: "sprint_id",
    },
    boardId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "boards",
        key: "id",
      },
      field: "board_id",
    },
    storyPoint: {
      type: Sequelize.INTEGER,
      field: "story_point",
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Story;
