import * as Sequelize from "sequelize"; // Assuming direct Sequelize import
import { Database } from "../config"; // Assuming Database holds connection details
import { IssueStatusEnum, IssueTypeEnum } from "../enums";

const sequelize = Database.sequelize;

const Issue = sequelize.define(
  "issues",
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
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: true,
    },
    parentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "issues",
        key: "id",
      },
      field: "parent_id",
    },
    status: {
      type: Sequelize.ENUM(
        IssueStatusEnum.IN_BACKLOG,
        IssueStatusEnum.PENDING,
        IssueStatusEnum.COMPLETED
      ),
    },
    sprintId: {
      type: Sequelize.INTEGER,
      references: {
        model: "sprints",
        key: "id",
      },
      field: "sprint_id",
    },
    columnId: {
      type: Sequelize.INTEGER,
      references: {
        model: "columns",
        key: "id",
      },
      field: "column_id",
    },
    type: {
      type: Sequelize.ENUM(
        IssueTypeEnum.FEATURE,
        IssueTypeEnum.BUG,
        IssueTypeEnum.ENHANCEMENT,
        IssueTypeEnum.REFACTOR,
        IssueTypeEnum.DOCUMENTATION,
        IssueTypeEnum.TASK,
        IssueTypeEnum.CHORE,
        IssueTypeEnum.QUESTION,
        IssueTypeEnum.SUPPORT,
        IssueTypeEnum.SECURITY,
        IssueTypeEnum.PERFORMANCE,
        IssueTypeEnum.UX,
        IssueTypeEnum.DEPLOYMENT,
        IssueTypeEnum.TESTING,
        IssueTypeEnum.CI_CD,
        IssueTypeEnum.UNCATEGORIZED
      ),
      allowNull: false,
      defaultValue: IssueTypeEnum.UNCATEGORIZED,
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
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Issue;
