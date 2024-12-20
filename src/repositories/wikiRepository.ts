import { InputWikiInterface, WikiInterface } from "../interfaces";
import { BaseRepository } from "./baseRepository";
import Model from "../models";

export class WikiRepository extends BaseRepository<
  InputWikiInterface,
  WikiInterface
> {
  constructor() {
    super(Model.Wiki);
  }
}
