import { where, WhereOptions } from "sequelize";
import { InputProjectInterface, ProjectInterface } from "../interfaces";
import {
  ProjectRepository,
  ProjectUserWorkspaceRepository,
} from "../repositories";

export class ProjectService {
  private repository;
  private projectUserWorkspaceRepository;
  constructor() {
    this.repository = new ProjectRepository();
    this.projectUserWorkspaceRepository = new ProjectUserWorkspaceRepository();
  }

  public async findByPk(id: number): Promise<ProjectInterface> {
    return this.repository.findByPk(id)
  }

  public async findAll( {workspaceId}: {workspaceId: number} ): Promise<ProjectInterface[]> {
    let where: WhereOptions<any> = {}


    if (workspaceId) where = {...where, workspaceId: workspaceId}

    return this.repository.findAll({
      where: where
    })
  }

  public async create(input: InputProjectInterface): Promise<ProjectInterface> {
    input.startDate = new Date();
    input.createdById;

    const project = await this.repository.create(input);
    await this.projectUserWorkspaceRepository.create({
      workspaceId: input.workspaceId,
      assignedToId: input.createdById,
      assignedById: input.createdById,
      projectId: project.id,
      assignedAt: new Date(),
    });

    return project;
  }

  public async updateOne({id, input}:{id: number, input: Partial<InputProjectInterface>}) {
    return this.repository.updateOne({ id, input })
  }

  public async deleteOne(id: number): Promise<Boolean> {
    await this.projectUserWorkspaceRepository.deleteMany({
      where: {
        projectId: id,
      },
    });
    return this.repository.deleteOne(id);
  }
}
