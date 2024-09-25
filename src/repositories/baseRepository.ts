import { WhereOptions } from 'sequelize';
import { Attributes, GroupOption, IncludeOptions, Order } from 'sequelize/types/model';

interface RepositoryWriter<IT, RT> {
  create(input: Partial<IT>, include?: IncludeOptions): Promise<RT>;
  bulkCreate(input: Partial<IT[]>): Promise<RT[]>;
  updateOne({ id, input, include }: { id: number; input: Partial<IT>; include: IncludeOptions[] }): Promise<[number]>;
  update({ where, input }: { where: object; input: Partial<IT> }): Promise<[number]>;
  deleteOne(id: number): Promise<number>;
  deleteMany({ where }: { where: object }): Promise<number>;
  restore(id: number): Promise<number>;
}

interface RepositoryReader<RT> {
  findAll({
    where,
    attributes,
    include,
    order,
    distinct,
    logging,
    offset
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    distinct?: boolean;
    logging?: boolean;
    offset?: number;
  }): Promise<RT[]>;
  findOne({
    where,
    attributes,
    include,
    order,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
  }): Promise<RT>;
  findByPk(
    id: number,
    options?: {
      attributes?: Attributes<any>;
      include?: IncludeOptions[];
    },
  ): Promise<RT>;
  findAndCountAll({
    where,
    attributes,
    include,
    order,
    offset,
    limit,
    distinct,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    offset?: number;
    limit?: number;
    distinct?: boolean;
  }): Promise<{ count: number; rows: RT[] }>;
  count({ where }: { where?: WhereOptions<any> }): Promise<number>;
}

export abstract class BaseRepository<IT, RT> implements RepositoryWriter<IT, RT>, RepositoryReader<RT> {
  constructor(public readonly model: any) { }

  findAll({
    where,
    attributes,
    include,
    order,
    group,
    limit,
    distinct,
    logging,
    offset
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    group?: GroupOption;
    limit?: number;
    distinct?: boolean;
    logging?: boolean;
    offset?: number;
  }): Promise<RT[]> {
    return this.model.findAll({ where, attributes, include, order, group, limit, logging, distinct, offset });
  }

  findOne({
    where,
    attributes,
    include,
    order,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
  }): Promise<RT> {
    return this.model.findOne({ where, attributes, include, order });
  }

  findByPk(
    id: number,
    options?: {
      attributes?: Attributes<any>;
      include?: IncludeOptions[];
    },
  ): Promise<RT> {
    return this.model.findByPk(id, options);
  }

  findAndCountAll({
    where,
    attributes,
    include,
    order,
    offset,
    logging,
    limit,
    distinct,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    logging?: boolean;
  }): Promise<{ count: number; rows: RT[] }> {
    return this.model.findAndCountAll({
      where,
      attributes,
      include,
      order,
      offset,
      limit,
      distinct,
      logging
    });
  }

  count({ where, include, distinct }: { where?: WhereOptions<any>, include?: any, distinct?: boolean }): Promise<number> {
    return this.model.count({ where, include, distinct: distinct ?? true });
  }

  create(input: Partial<IT>, include?: IncludeOptions): Promise<RT> {
    return this.model.create(input, include);
  }

  bulkCreate(input: Partial<IT[]>): Promise<RT[]> {
    return this.model.bulkCreate(input, { ignoreDuplicates: true });
  }

  updateOne({ id, input }: { id: number; input: Partial<IT> }): Promise<[number]> {
    return this.model.update(input, { where: { id } });
  }

  update({ where, input }: { where: WhereOptions<any>; input: Partial<IT> }): Promise<[number]> {
    return this.model.update(input, { where });
  }

  deleteOne(id: number): Promise<number> {  
      return this.model.destroy({
      where: { id },
    });
  }

  deleteMany({ where }: { where: object }): Promise<number> {
    return this.model.destroy({
      where,
    });
  }

  restore(id: number): Promise<number> {
    return this.model.restore({
      where: { id },
    });
  }
}
