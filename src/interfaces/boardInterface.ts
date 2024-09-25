import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputBoardInterface {
  workspaceId: number;
  projectId: number;
  label: string;
  position: number;
}

export interface BoardInterface extends InputBoardInterface, ModelTimestampExtend {
    id: number;
}

export interface BoardModelInterface
  extends Sequelize.Model<BoardInterface, Partial<InputBoardInterface>>,
    BoardInterface {}
