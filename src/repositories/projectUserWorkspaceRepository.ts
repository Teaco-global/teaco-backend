import {
  InputProjectUserWorkspaceInterface,
  ProjectUserWorkspaceInterface,
} from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class ProjectUserWorkspaceRepository extends BaseRepository<
  InputProjectUserWorkspaceInterface,
  ProjectUserWorkspaceInterface
> {
  constructor() {
    super(Model.ProjectUserWorkspace);
  }
}
