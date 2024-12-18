import * as Sequelize from "sequelize";

import { ModelTimestampExtend } from ".";

export interface InputRoomUserWorkspaceInterface {
  roomId: number;
  workspaceId: number;
  userWorkspaceId: number;
}

export interface RoomUserWorkspaceInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  roomId: number;
  workspaceId: number;
  userWorkspaceId: number;
  membersCount?: number;
}

export interface RoomsUserWorkspaceModelInterface
  extends Sequelize.Model<
      RoomUserWorkspaceInterface,
      Partial<InputRoomUserWorkspaceInterface>
    >,
    RoomUserWorkspaceInterface {}