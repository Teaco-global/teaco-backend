import { InputIdentityVerificationInterface, IdentityVerificationInterface } from '../interfaces';
import Model from '../models';
import { BaseRepository } from './baseRepository';

export class IdentityVerificationRepository extends BaseRepository<InputIdentityVerificationInterface, IdentityVerificationInterface> {
  constructor() {
    super(Model.IdentityVerification);
  }
}
