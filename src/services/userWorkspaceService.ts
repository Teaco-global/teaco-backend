import { WhereOptions } from "sequelize";
import * as Sequelize from "sequelize";

import { UserWorkspaceInterface } from "../interfaces";
import {
  RoleRepository,
  UserWorkspaceRepository,
  UserWorkspaceRoleRepository,
} from "../repositories";
import Model from "../models";
import { RoleEnum, SortEnum } from "../enums";
import { Ksuid } from "../helpers";

export class UserWorkspaceService {
  private repository: UserWorkspaceRepository;
  private userWorkspaceRoleRepository: UserWorkspaceRoleRepository;
  private roleRepository: RoleRepository;
  public constructor() {
    this.repository = new UserWorkspaceRepository();
    this.roleRepository = new RoleRepository();
    this.userWorkspaceRoleRepository = new UserWorkspaceRoleRepository();
  }

  public async create({
    userId,
    workspaceId,
    role,
  }: {
    userId: number;
    workspaceId: number;
    role: RoleEnum;
  }): Promise<UserWorkspaceInterface> {
    const userWorkspace = await this.repository.create({ userId, workspaceId, identity: Ksuid.generate() });
    const rolesExists = await this.roleRepository.findOne({
      where: {
        slug: role.toLocaleLowerCase(),
      },
    });
    await this.userWorkspaceRoleRepository.create({
      userWorkspaceId: userWorkspace.id,
      roleId: rolesExists.id,
    });
    return userWorkspace;
  }

  public async findOne({
    userId,
    workspaceId,
    identity,
  }: {
    userId?: number;
    workspaceId?: number;
    identity?: String;
  }): Promise<UserWorkspaceInterface> {
    let where: WhereOptions<any> = {};

    if (userId) where = { ...where, userId: userId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };
    if (identity) where = { ...where, identity: identity };
    console.log(where)
    return this.repository.findOne({
      where: where,
      include: [
        {
          model: Model.User,
          as: "user",
        },
        {
          model: Model.Workspace,
          as: "workspace",
        },
        {
          model: Model.UserWorkspaceRole,
          as: "userWorkspaceRoles",
          include: [
            {
              model: Model.Role,
              as: "role",
            },
          ],
        },
      ],
    });
  }

  public async findAll({
    userId,
    workspaceId,
  }: {
    userId?: number;
    workspaceId?: number;
  }): Promise<UserWorkspaceInterface[]> {
    let where: WhereOptions<any> = {};
    if (userId) where = { ...where, userId: userId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };

    return this.repository.findAll({
      where: where,
      include: [
        {
          model: Model.Workspace,
          as: "workspace",
        },
        {
          model: Model.User,
          as: "user",
        },
        {
          model: Model.UserWorkspaceRole,
          as: "userWorkspaceRoles",
          include: [
            {
              model: Model.Role,
              as: "role",
            },
          ],
        },
      ],
    });
  }

  public async findAndCountAll({
    offset,
    limit,
    sort,
    order,
    userId,
    workspaceId,
  }: {
    offset: number;
    limit: number;
    sort: SortEnum;
    order: string;
    userId?: number;
    workspaceId?: number;
  }): Promise<{
    count: number;
    rows: UserWorkspaceInterface[];
  }> {
    let where: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    if (userId) where = { ...where, userId: userId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };

    return this.repository.findAndCountAll({
      where,
      include: [
        {
          model: Model.Workspace,
          as: "workspace",
        },
        {
          model: Model.User,
          as: "user",
        },
        {
          model: Model.UserWorkspaceRole,
          as: "userWorkspaceRoles",
          include: [
            {
              model: Model.Role,
              as: "role",
            },
          ],
        },
      ],
      offset,
      limit,
      order: [...orderItem, [order, sort]],
      distinct: true,
    });
  }
}
