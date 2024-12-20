import * as Sequelize from "sequelize";

import {
  ModelTimestampExtend,
  ModelCreatorIdExtend,
} from ".";
import { RoomTypeEnum } from "../enums";

export interface InputRoomInterface extends ModelCreatorIdExtend {
  label?: string;
  identity: string;
  type: RoomTypeEnum;
  isPublic: boolean;
  workspaceId: number;
}

export interface RoomInterface
  extends ModelCreatorIdExtend,
    ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  label: string;
  identity: string;
  type: RoomTypeEnum;
  isPublic: boolean;
  workspaceId: number;
}

export interface RoomModelInterface
  extends Sequelize.Model<RoomInterface, Partial<InputRoomInterface>>,
    RoomInterface {}