import { InputUserRoleInterface, UserRoleInterface } from "../interfaces";
import Model from '../models'
import { BaseRepository } from "./baseRepository";

export class UserRoleRepository extends BaseRepository<
  InputUserRoleInterface,
  UserRoleInterface
> {
  constructor() {
    super(Model.UserRole);
  }
}
