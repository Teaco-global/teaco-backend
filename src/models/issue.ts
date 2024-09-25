import * as Sequelize from 'sequelize';
import { Database } from '../config';
const sequelize = Database.sequelize;

const Issue = sequelize.define('issues', {
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
      model: 'workspaces',
      key: 'id',
    },
    field: 'workspace_id',
  },
  projectId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
    field: 'project_id',
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
});

export default Issue;
