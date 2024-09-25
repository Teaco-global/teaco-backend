import { WhereOptions } from "sequelize";

import { UserWorkspaceInterface } from "../interfaces";
import { RoleRepository, UserWorkspaceRepository, UserWorkspaceRoleRepository } from "../repositories";
import Model from "../models";
import { RoleEnum } from "../enums";

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
    role
  }: {
    userId: number,
    workspaceId: number,
    role: RoleEnum
  }): Promise<UserWorkspaceInterface> {
    const userWorkspace = await this.repository.create({userId, workspaceId})
    const rolesExists = await this.roleRepository.findOne({
      where:{
        slug: role.toLocaleLowerCase()
      }
    })
    const userWorkspaceRole = this.userWorkspaceRoleRepository.create({userWorkspaceId: userWorkspace.id, roleId: rolesExists.id})
    return userWorkspace
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
      ],
    });
  }
}
