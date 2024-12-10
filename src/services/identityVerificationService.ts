import { CreationOptional, Op, WhereOptions } from 'sequelize';
import { tokenExpireTime } from '../config';
import { IdentityVerificationInterface, InputIdentityVerificationInterface } from '../interfaces';
import { IdentityVerificationRepository } from '../repositories';

export class IdentityVerificationService {
  private repository: IdentityVerificationRepository;

  constructor() {
    this.repository = new IdentityVerificationRepository();
  }

  public async create(input: InputIdentityVerificationInterface): Promise<IdentityVerificationInterface> {
    const identityVerificationExists = await this.repository.findOne({
      where: { identity: input.identity },
    });

    if (identityVerificationExists) {
      await this.updateOne(identityVerificationExists.id, { expiryDate: new Date() });
    }

    return this.repository.create({...input, expiryDate: new Date(new Date().setHours(new Date().getHours() + tokenExpireTime))});
  }

  public findOne({
    identity,
    token,
    expiryDate,
    meta
  }: {
    identity?: string;
    token?: string;
    expiryDate?: Date;
    meta?: any;
  }): Promise<IdentityVerificationInterface | undefined> {
    let where: WhereOptions = {};

    if (identity) {
      where = { ...where, identity: identity };
    }

    if (token) {
      where = { ...where, token: token };
    }

    if (expiryDate) {
      where = { ...where, expiryDate: { [Op.gt]: new Date() } };
    }

    if(meta) {
      where = { ...where, meta:{[Op.and] : [{workspaceId: meta.workspaceId}, {userWorkspaceId: meta.userWorkspaceId}]}}
    }

    return this.repository.findOne({
      where: where,
    });
  }

  public async updateOne(
    id: CreationOptional<number>,
    input: Partial<InputIdentityVerificationInterface>,
  ): Promise<IdentityVerificationInterface> {
    await this.repository.updateOne({
      id: id,
      input: input,
    });

    return this.repository.findByPk(id);
  }

  public async deleteOne(id: CreationOptional<number>): Promise<boolean> {
    await this.repository.deleteOne(id);
    return true;
  }
}
