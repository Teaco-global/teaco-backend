import { InputSprintInterface, SprintInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class SpritntRepository extends BaseRepository<
  InputSprintInterface,
  SprintInterface
> {
  constructor() {
    super(Model.Sprint);
  }
}
