import { InputIssueInterface, IssueInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class IssueWorkspaceRepository extends BaseRepository<
  InputIssueInterface,
  IssueInterface
> {
  constructor() {
    super(Model.Issue);
  }
}
