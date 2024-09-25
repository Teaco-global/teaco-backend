import * as Sequelize from "sequelize";
import { Database } from "../config";
import { SprintStatusEnum } from "../enums";
const sequelize = Database.sequelize;

const Sprint = sequelize.define(
  "sprints",
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
    goal: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM(
        SprintStatusEnum.CREATED,
        SprintStatusEnum.STARTED,
        SprintStatusEnum.COMPLETED,
        SprintStatusEnum.OVERDUED
      ),
      allowNull: false,
      defaultValue: SprintStatusEnum.CREATED,
    },
    sprintCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "sprint_count",
    },
    startDate: {
      type: Sequelize.DATE,
      field: "start_date",
    },
    dueDate: {
      type: Sequelize.DATE,
      field: "due_date",
    },
    completedDate: {
      type: Sequelize.DATE,
      field: "completed_date",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Sprint;
