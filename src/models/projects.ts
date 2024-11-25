import * as Sequelize from "sequelize";
import { Database } from "../config";
import { ProjectStatusEnum } from "../enums";
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
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Project;
