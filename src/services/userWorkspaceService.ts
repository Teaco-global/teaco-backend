import { WhereOptions } from "sequelize";
import * as Sequelize from "sequelize";

import { InputUserWorkspaceInterface, UserWorkspaceInterface } from "../interfaces";
import {
  RoleRepository,
  UserWorkspaceRepository,
  UserWorkspaceRoleRepository,
} from "../repositories";
import Model from "../models";
import { RoleEnum, SortEnum, UserWorkspaceStatusEnum } from "../enums";
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
    identity
  }: {
    userId?: number;
    workspaceId?: number;
    identity?: String;
  }): Promise<UserWorkspaceInterface> {
    let where: WhereOptions<any> = {};

    if (userId) where = { ...where, userId: userId };
    if (workspaceId) where = { ...where, workspaceId: workspaceId };
    if (identity) where = { ...where, identity: identity };
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
    status
  }: {
    offset: number;
    limit: number;
    sort: SortEnum;
    order: string;
    userId?: number;
    workspaceId?: number;
    status?: UserWorkspaceStatusEnum
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
    if (status) where = { ...where, status: status };

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

  async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputUserWorkspaceInterface>,
  ): Promise<number[]> {
    if (id) {
      const userExists = await this.repository.findByPk(id);
      if (!userExists)
        throw new Error('User does not exists.')
    }
    return this.repository.updateOne({
      id: id,
      input: input,
    });
  }

  async deleteOne({
    id,
  }:{
    id: number
  }): Promise<boolean> {
    await this.repository.deleteOne(id)
    return true
  }
}
