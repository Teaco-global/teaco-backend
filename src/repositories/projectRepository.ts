import { InputProjectInterface, ProjectInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class ProjectRepository extends BaseRepository<
  InputProjectInterface,
  ProjectInterface
> {
  constructor() {
    super(Model.Project);
  }
}
