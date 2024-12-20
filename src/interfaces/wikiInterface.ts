import * as Sequelize from "sequelize";

import {
  ModelTimestampExtend,
  ModelCreatorIdExtend,
} from ".";

export interface InputWikiInterface extends ModelCreatorIdExtend {
  title?: string;
  content?: JSON
  identity: string;
  workspaceId: number;
}

export interface WikiInterface
  extends ModelCreatorIdExtend,
    ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  title?: string;
  content?: JSON
  identity: string;
  workspaceId: number;
}

export interface WikiModelInterface
  extends Sequelize.Model<WikiInterface, Partial<InputWikiInterface>>,
    WikiInterface {}