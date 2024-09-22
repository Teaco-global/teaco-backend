import {
	InputUserWorkspaceInterface,
	UserWorkspaceInterface,
} from '../interfaces';
import { BaseRepository } from './baseRepository';
import Model from '../models';

export class UserWorkspaceRepository extends BaseRepository<
  InputUserWorkspaceInterface,
  UserWorkspaceInterface
> {
	constructor() {
		super(Model.UserWorkspace);
	}
}
