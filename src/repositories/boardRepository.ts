import { BoardInterface, InputBoardInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class BoardRepository extends BaseRepository<
  InputBoardInterface,
  BoardInterface
> {
  constructor() {
    super(Model.Board);
  }
}
