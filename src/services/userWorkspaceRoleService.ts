import Model from "../models";
import { UserWorkspaceRoleInterface } from "../interfaces";
import { UserWorkspaceRoleRepository } from "../repositories";

export class UserWorkspaceRoleService {
  private repository: UserWorkspaceRoleRepository;

  constructor() {
    this.repository = new UserWorkspaceRoleRepository();
  }

  async findOne({
    userWorkspaceId,
  }: {
    userWorkspaceId?: number;
  }): Promise<UserWorkspaceRoleInterface> {
    return this.repository.findOne({
      where: {
        userWorkspaceId: userWorkspaceId,
      },
      include: [
        {
          model: Model.Role,
          as: "role"
        },
      ],
    });
  }
}
