import { ColumnInterface, InputColumnInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class ColumnRepository extends BaseRepository<
InputColumnInterface,
  ColumnInterface
> {
  constructor() {
    super(Model.Column);
  }
}
