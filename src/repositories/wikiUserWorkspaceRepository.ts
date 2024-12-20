import {
  InputWikiUserWorkspaceInterface,
  WikiUserWorkspaceInterface,
} from "../interfaces";
import { BaseRepository } from "./baseRepository";
import Model from "../models";

export class WikiUserWorkspaceRepository extends BaseRepository<
  InputWikiUserWorkspaceInterface,
  WikiUserWorkspaceInterface
> {
  constructor() {
    super(Model.WikiUserWorkspace);
  }
}
