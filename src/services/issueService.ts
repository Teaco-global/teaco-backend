import { WhereOptions } from "sequelize";
import { InputIssueInterface, IssueInterface } from "../interfaces";
import { IssueRepository } from "../repositories";

export class IssueService {
  private repository: IssueRepository;
  public constructor() {
    this.repository = new IssueRepository();
  }

  public async create(input: InputIssueInterface): Promise<IssueInterface> {
    const lastIssue = await this.repository.findOne({
      where: {
        projectId: input.projectId
      },
      order: [['createdAt', 'DESC']]
    })
    if(lastIssue) {
      input.issueCount = lastIssue.issueCount + 1
    } else {
      input.issueCount = 1
    }
    return this.repository.create(input);
  }

  public async findByPk(id: number): Promise<IssueInterface> {
    const issue = await this.repository.findByPk(id);

    if (!issue) throw new Error("Issue-type does not exists");

    return issue;
  }

  public async findAllActiveSprintIssues({sprintId, projectId}: {sprintId: number, projectId: number}): Promise<IssueInterface[]> {
    return this.repository.findAll({
      where: {
        projectId: projectId,
        sprintId: sprintId
      }
    })
  }

  public async findBacklogIssues({
    projectId,
  }: {
    projectId: number;
  }): Promise<IssueInterface[]> {
    return this.repository.findAll({
      where: {
        projectId: projectId,
        sprintId: null
      }
    })
  }

  public async findAll({
    workspaceId,
    projectId,
  }: {
    workspaceId: number;
    projectId: number;
  }): Promise<IssueInterface[]> {
    let where: WhereOptions<any> = {};

    if (workspaceId) where = { ...where, workspaceId: workspaceId };
    if (projectId) where = { ...where, projectId: projectId };

    return this.repository.findAll({
      where: where,
    });
  }

  public async updateOne({
    id,
    input,
  }: {
    id: number;
    input: Partial<InputIssueInterface>;
  }): Promise<IssueInterface> {
    const issueExists = await this.repository.findByPk(id)
    if (!issueExists) throw new Error('Issue does not exists') 
    await this.repository.updateOne({ id, input });

    return this.repository.findByPk(id);
  }

  public async deleteOne(id: number): Promise<Boolean> {
    this.repository.deleteOne(id);

    return true;
  }
}
