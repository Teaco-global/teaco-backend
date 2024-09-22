import { InputWorkspaceInterface, WorkspaceInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class WorkspaceRepository extends BaseRepository<
  InputWorkspaceInterface,
  WorkspaceInterface
> {
  constructor() {
    super(Model.Workspace);
  }
}
