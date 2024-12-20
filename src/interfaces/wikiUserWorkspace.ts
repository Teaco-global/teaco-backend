import * as Sequelize from "sequelize";

import { ModelTimestampExtend } from ".";

export interface InputWikiUserWorkspaceInterface {
  wikiId: number;
  workspaceId: number;
  userWorkspaceId: number;
}

export interface WikiUserWorkspaceInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  wikiId: number;
  workspaceId: number;
  userWorkspaceId: number;
}

export interface WikisUserWorkspaceModelInterface
  extends Sequelize.Model<
      WikiUserWorkspaceInterface,
      Partial<InputWikiUserWorkspaceInterface>
    >,
    WikiUserWorkspaceInterface {}