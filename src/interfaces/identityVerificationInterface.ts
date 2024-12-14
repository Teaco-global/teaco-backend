import * as Sequelize from 'sequelize';
import { ModelTimestampExtend } from '.';

export interface InputIdentityVerificationInterface {
  token: string;
  identity: string;
  expiryDate?: Date;
}

export interface IdentityVerificationInterface extends ModelTimestampExtend {
  id: number;
  token: string;
  identity: string;
  expiryDate: Date;
}

export interface IdentityVerificationModelInterface
  extends Sequelize.Model<IdentityVerificationInterface, Partial<InputIdentityVerificationInterface>>,
    IdentityVerificationInterface {}
