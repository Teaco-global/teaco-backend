import { InputWikiInterface, WikiInterface } from "../interfaces";
import { WikiRepository, WikiUserWorkspaceRepository } from "../repositories";

export class WikiService {
  private repository: WikiRepository;
  private wikiUserWorkspaceRepository: WikiUserWorkspaceRepository;
  constructor() {
    this.repository = new WikiRepository();
    this.wikiUserWorkspaceRepository = new WikiUserWorkspaceRepository();
  }

  public create(input: InputWikiInterface): Promise<WikiInterface> {
    return this.repository.create({
      identity: input.identity,
      title: "Untitled Document",
      workspaceId: input.workspaceId,
      createdById: input.createdById,
      updatedById: input.updatedById,
    });
  }

  public async findByPk(id: number): Promise<WikiInterface> {
    return this.repository.findByPk(id);
  }

  public async updateOne({
    id,
    input,
  }: {
    id: number;
    input: Partial<InputWikiInterface>;
  }): Promise<WikiInterface> {
    await this.repository.updateOne({
      id,
      input,
    });
    return this.repository.findByPk(id);
  }

  public async deleteOne(id: number): Promise<Boolean> {
    await this.repository.deleteOne(id);
    await this.wikiUserWorkspaceRepository.deleteMany({
      where: {
        wikiId: id,
      },
    });
    return true;
  }
}
