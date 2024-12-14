import { BaseRepository } from "./baseRepository";
import Model from "../models";
import {
  RoomUserWorkspaceInterface,
  InputRoomUserWorkspaceInterface,
} from "../interfaces";

export class RoomUserWorkspaceRepository extends BaseRepository<
  InputRoomUserWorkspaceInterface,
  RoomUserWorkspaceInterface
> {
  constructor() {
    super(Model.RoomUserWorkspaces);
  }
}