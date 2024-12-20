import * as Sequelize from "sequelize"; // Assuming direct Sequelize import
import { Database } from "../config"; // Assuming Database holds connection details
import { IssuePriorityEnum, IssueStatusEnum, IssueTypeEnum } from "../enums";
import Sprint from "./sprint";

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
    issueCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "issue_count",
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    priority: {
      type: Sequelize.ENUM(
        IssuePriorityEnum.HIGH,
        IssuePriorityEnum.LOW,
        IssuePriorityEnum.MEDIUM
      ),
      allowNull: false,
      defaultValue: IssuePriorityEnum.LOW,
    },
    estimatedPoints: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 13,
      },
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
    assignedById: {
      type: Sequelize.INTEGER,
      references: {
        model: "user_workspaces",
        key: "id",
      },
      field: "assigned_by_id",
    },
    assignedToId: {
      type: Sequelize.INTEGER,
      references: {
        model: "user_workspaces",
        key: "id",
      },
      field: "assigned_to_id",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Issue;
