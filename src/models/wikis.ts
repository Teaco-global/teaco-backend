import * as Sequelize from "sequelize";

import { Database } from "../config";
import WikiUserWorkspace from "./wikiUserWorkspace";

const sequelize = Database.sequelize;

const Wiki = sequelize.define(
  "wikis",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING(25),
      allowNull: true,
    },
    content: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    identity: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "workspace_id",
      references: {
        model: "workspaces",
        key: "id",
      },
    },
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "created_by_id",
      references: {
        model: "user_workspaces",
        key: "id",
      },
    },
    updatedById: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "updated_by_id",
      references: {
        model: "user_workspaces",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "wikis",
    freezeTableName: true,
    indexes: [
      {
        unique: false,
        concurrently: true,
        name: "wikis_identity",
        fields: ["identity"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);

Wiki.hasMany(WikiUserWorkspace, {
  foreignKey: "wikiId",
  as: "wikiUserWorkspaces",
});

WikiUserWorkspace.belongsTo(Wiki, {
  foreignKey: "wikiId",
  as: "wiki",
});

export default Wiki;
