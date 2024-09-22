import { InputUserWorkspaceRoleInterface, UserWorkspaceRoleInterface } from '../interfaces';
import Model from '../models';
import { BaseRepository } from './baseRepository';

export class UserWorkspaceRoleRepository extends BaseRepository<
  InputUserWorkspaceRoleInterface,
  UserWorkspaceRoleInterface
> {
  constructor() {
    super(Model.UserWorkspaceRole);
  }
}
