import { IncludeOptions, WhereOptions } from "sequelize";
import { RoomUserWorkspaceRepository } from "../repositories";
import { RoomUserWorkspaceInterface, InputRoomUserWorkspaceInterface } from "../interfaces";
import Model from "../models";
import { RoomTypeEnum } from "../enums";

export class RoomUserWorkspaceService {
  private repository: RoomUserWorkspaceRepository;

  constructor() {
    this.repository = new RoomUserWorkspaceRepository();
  }

  async create(input: InputRoomUserWorkspaceInterface): Promise<RoomUserWorkspaceInterface> {
    return this.repository.create(input);
  }

  findOne({}: {}): Promise<RoomUserWorkspaceInterface> {
    let where: WhereOptions<any> = {};
    return this.repository.findOne({
      where,
    });
  }

  findAll({
    where,
  }: {
    where?: WhereOptions<any>;
  }): Promise<RoomUserWorkspaceInterface[]> {
    return this.repository.findAll({ where });
  }

  async findByPk(id: number): Promise<RoomUserWorkspaceInterface> {
    const chatRoomExists = await this.repository.findByPk(id);
    if (!chatRoomExists) throw new Error(`roomUserWorkspace.chatRoomExists.error`);
    return chatRoomExists;
  }

  async count({
    where,
    include,
    distinct,
  }: {
    where?: WhereOptions<RoomUserWorkspaceInterface>;
    include?: IncludeOptions[];
    distinct?: boolean;
  }): Promise<number> {
    return this.repository.count({
      where,
      include,
      distinct: distinct ?? true,
    });
  }

  public async findAndCountAll({
    workspaceId,
    userWorkspaceId,
    type,
  }: {
    workspaceId?: number;
    userWorkspaceId?: number;
    type?: RoomTypeEnum;
  }): Promise<{
    count: number;
    rows: RoomUserWorkspaceInterface[];
  }> {
    let where: WhereOptions<any> = {},
      roomWhere: WhereOptions<any> = {};

    if (userWorkspaceId) where = { ...where, userWorkspaceId: userWorkspaceId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };
    if (type) roomWhere = { ...roomWhere, type: type}

    return this.repository.findAndCountAll({
      where,
      include: [
        {
          model: Model.Room,
          as: "room",
          ...(Object.keys(roomWhere).length > 0 && { where: roomWhere }),
        },
      ],
      distinct: true,
    });
  }
}