import { WhereOptions } from "sequelize";
import { InputSprintInterface, SprintInterface } from "../interfaces";
import { SpritntRepository } from "../repositories";
import { SprintStatusEnum } from "../enums";

export class SprintService {
  private repository;
  constructor() {
    this.repository = new SpritntRepository();
  }

  public async findByPk(id): Promise<SprintInterface> {
    return this.repository.findByPk(id);
  }

  public async findOne({ status, projectId }: {status: SprintStatusEnum, projectId: number}) : Promise<SprintInterface> {
    let where: WhereOptions<any> = {};

    if (projectId) where = {...where, projectId: projectId}
    if (status) where = { ...where, status: status}
    return this.repository.findOne({
      where: where
    })
  }
  public async create(input: InputSprintInterface): Promise<SprintInterface> {
    return this.repository.create(input);
  }

  public async findAll({
    workspaceId,
    projectId,
  }: {
    workspaceId: number;
    projectId: number;
  }): Promise<SprintInterface[]> {
    let where: WhereOptions<any> = {};

    if (workspaceId) where = { ...where, workspaceId: workspaceId };
    if (projectId) where = { ...where, projectId: projectId };
    return this.repository.findAll({
      where: where,
    });
  }

  public async updateOne({ id, input }: { id: number, input: Partial<InputSprintInterface>}) {
    return this.repository.updateOne({ id, input })
  }
}
