import * as Sequelize from "sequelize";
import { Database } from "../config";
import { ProjectStatusEnum } from "../enums";
import Workspace from "./workspace";
const sequelize = Database.sequelize;

const Project = sequelize.define(
  "projects",
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.ENUM(
        ProjectStatusEnum.COMPLETED,
        ProjectStatusEnum.CREATED
      ),
      allowNull: false,
      defaultValue: ProjectStatusEnum.CREATED,
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
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: "start_date",
    },
    completedDate: {
      type: Sequelize.DATE,
      field: "completed_date",
    },
    sprintDuration: {
      type: Sequelize.INTEGER,
      field: "sprint_duration",
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3, 4]],
      }
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Project;
