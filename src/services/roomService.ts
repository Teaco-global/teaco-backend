import { RoomInterface, InputRoomInterface } from "../interfaces";
import { RoomRepository } from "../repositories";
import { Database } from "../config";
import { QueryTypes } from "sequelize";

export class RoomService {
  private repository: RoomRepository;

  constructor() {
    this.repository = new RoomRepository();
  }

  async create(input: InputRoomInterface): Promise<RoomInterface> {
    return this.repository.create(input);
  }

  async findByPk(id: number): Promise<RoomInterface> {
    const roomExists = await this.repository.findByPk(id);

    if (!roomExists) {
      throw new Error("Room does not exists.");
    }

    return roomExists;
  }

  async query({
    workspaceId,
    userWorkspaceId,
    receiverId,
  }: {
    workspaceId: number;
    userWorkspaceId: number;
    receiverId: number;
  }): Promise<any> {
    return await Database.sequelize.query(
      `WITH RankedWorkspaces AS (
      SELECT
          room_id,
          user_workspace_id,
          workspace_id,
          ROW_NUMBER() OVER (PARTITION BY room_id ORDER BY room_id) AS rn
      FROM
          public.chat_room_user_workspaces
      WHERE
          workspace_id = ${workspaceId}
          AND user_workspace_id IN (${userWorkspaceId}, ${receiverId})
  )
  SELECT
      aa.*
  FROM
      public.chat_room_user_workspaces aa
  JOIN
      RankedWorkspaces rw ON aa.room_id = rw.room_id AND rw.rn = 2 and aa.workspace_id = ${workspaceId}
      AND aa.user_workspace_id IN (${userWorkspaceId}, ${receiverId});`,
      { type: QueryTypes.SELECT }
    );
  }
}
