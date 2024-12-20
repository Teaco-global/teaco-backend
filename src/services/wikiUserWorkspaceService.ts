import { WhereOptions } from "sequelize";
import * as Sequelize from "sequelize";

import { SortEnum } from "../enums";
import { WikiUserWorkspaceRepository } from "../repositories";
import { InputWikiUserWorkspaceInterface, WikiUserWorkspaceInterface } from "../interfaces";
import Model from "../models";

export class WikiUserWorkspaceService {
  private repository: WikiUserWorkspaceRepository;

  constructor() {
    this.repository = new WikiUserWorkspaceRepository();
  }

  public async create(input: InputWikiUserWorkspaceInterface): Promise<WikiUserWorkspaceInterface> {
    return this.repository.create(input)
  }

  public async findAndCountAll({
    offset,
    limit,
    sort,
    order,
    userWorkspaceId,
    workspaceId,
  }: {
    offset: number;
    limit: number;
    sort: SortEnum;
    order: string;
    userWorkspaceId: number;
    workspaceId: number;
  }): Promise<{
    count: number;
    rows: WikiUserWorkspaceInterface[];
  }> {
    let where: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    if (userWorkspaceId) where = { ...where, userWorkspaceId: userWorkspaceId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };

    const {rows, count} = await this.repository.findAndCountAll({
      where,
      include: [
        {
          model: Model.Wiki,
          as: "wiki",
        },
        {
          model: Model.UserWorkspace,
          as: "userWorkspace",
          include: [
            {
              model: Model.User,
              as: "user",
            },
          ],
        },
      ],
      offset,
      limit,
      order: [...orderItem, [order, sort]],
      distinct: true,
    });
    return {rows, count}
  }

}
