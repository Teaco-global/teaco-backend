import { WhereOptions } from "sequelize";
import { RoleEnum, UserWorkspaceStatusEnum } from "../enums";
import { Ksuid } from "../helpers";
import { InputWorkspaceInterface, WorkspaceInterface } from "../interfaces";

import {
  RoleRepository,
  UserWorkspaceRepository,
  UserWorkspaceRoleRepository,
  WorkspaceRepository,
} from "../repositories";

export class WorkspaceService {
  private repository: WorkspaceRepository;
  private roleRepository;
  private userWorkspaceRepository;
  private userWorkspaceRoleRepository;

  constructor() {
    this.repository = new WorkspaceRepository();
    this.roleRepository = new RoleRepository();
    this.userWorkspaceRepository = new UserWorkspaceRepository();
    this.userWorkspaceRoleRepository = new UserWorkspaceRoleRepository();
  }

  public async create(
    input: InputWorkspaceInterface
  ): Promise<WorkspaceInterface> {
    const rolesExists = await this.roleRepository.findOne({
      where: { slug: RoleEnum.OWNER.toLocaleLowerCase() },
    });

    if (!rolesExists) {
      throw new Error(`Role does not exists.`);
    }

    input.secret = Ksuid.generate();

    const workspace = await this.repository.create({ ...input });

    const userWorkspace = await this.userWorkspaceRepository.create({
      userId: input.ownerId,
      workspaceId: workspace.id,
      identity: Ksuid.generate(),
      status: UserWorkspaceStatusEnum.ACCEPTED,
    });

    await this.userWorkspaceRoleRepository.create({
      userWorkspaceId: userWorkspace.id,
      roleId: rolesExists.id,
    });

    return workspace;
  }

  public async findBySecret({secret}:{secret: string}): Promise<WorkspaceInterface> {
    let where: WhereOptions<any> = {};

    if(secret) where = { ...where, secret: secret }

    return this.repository.findOne({ where })
  }

  public async findByPk(id: number): Promise<WorkspaceInterface> {
    return this.repository.findByPk(id)
  }
}
