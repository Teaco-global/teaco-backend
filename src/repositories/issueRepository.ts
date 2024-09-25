import { InputIssueInterface, IssueInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class IssueRepository extends BaseRepository<
  InputIssueInterface,
  IssueInterface
> {
  constructor() {
    super(Model.Issue);
  }
}
