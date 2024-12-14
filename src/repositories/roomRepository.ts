import { RoomInterface, InputRoomInterface } from "../interfaces";
import { BaseRepository } from "./baseRepository";
import Model from "../models";

export class RoomRepository extends BaseRepository<
  InputRoomInterface,
  RoomInterface
> {
  constructor() {
    super(Model.Room);
  }
}