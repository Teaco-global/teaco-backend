import { WhereOptions } from "sequelize";
import * as Sequelize from "sequelize";

import { InputMessageInterface, MessageInterface } from "../interfaces";
import { MessageRepository } from "../repositories";
import Model from "../models";
import { SortEnum } from "../enums";

export class MessageService {
  private repository: MessageRepository;

  constructor() {
    this.repository = new MessageRepository();
  }

  async create(input: InputMessageInterface): Promise<MessageInterface> {
    const messageData = await this.repository.create(input);

    return this.repository.findByPk(messageData.id, {
      attributes: ["id", "body", "senderId", "createdAt"],
      include: [
        {
          model: Model.UserWorkspace,
          as: 'sender',
          attributes: ['id', 'userId', 'workspaceId'],
          include: [
            {
              model: Model.User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ]
        }
      ]
    })
  }

  public async findAndCountAll({
    offset,
    limit,
    sort,
    order,
    workspaceId,
    roomId,
  }: {
    offset: number;
    limit: number;
    sort: SortEnum;
    order: string;
    workspaceId?: number;
    roomId?: number
  }): Promise<{
    count: number;
    rows: MessageInterface[];
  }> {
    let where: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    if (roomId) where = { ...where, roomId: roomId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };

    return this.repository.findAndCountAll({
      where,
      include: [
        {
          model: Model.UserWorkspace,
          as: "sender",
          include: [
            {
              model: Model.User,
              as: "user",
            },
          ]
        },
      ],
      offset,
      limit,
      order: [...orderItem, [order, sort]],
      distinct: true,
    });
  }
}