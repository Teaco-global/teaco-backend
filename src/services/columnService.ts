import { where, WhereOptions } from "sequelize";
import { InputColumnInterface, ColumnInterface } from "../interfaces";
import {
    ColumnRepository,
} from "../repositories";

export class ColumnService {
  private repository:ColumnRepository;
  constructor() {
    this.repository = new ColumnRepository();
  }

  public async findAll(): Promise<ColumnInterface[]> {
    return this.repository.findAll({
      order: [['position', 'ASC']]
  })
  }

  public async create(input: InputColumnInterface): Promise<ColumnInterface> {
    const column = await this.repository.create(input);

    return column 
  }

  public async updateOne({id, input}:{id: number, input: Partial<InputColumnInterface>}) {
    return this.repository.updateOne({ id, input })
  }

  public async deleteOne(id: number): Promise<Boolean> {
    await this.repository.deleteOne(id);
    return true
  }

  public async findDefaultColumn(projectId: number): Promise<ColumnInterface> {
    return this.repository.findOne({
      where: {
        projectId: projectId,
        position: 1
      }
    })
  }
}
