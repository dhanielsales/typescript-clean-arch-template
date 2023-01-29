import { BaseSchema } from '../schemas/base';

export interface Store<Schema extends BaseSchema> {
  create(payload: Schema): Promise<Schema>;
  update(id: string, payload: Partial<Schema>): Promise<number>;
  remove(id: string): Promise<number>;
  findOne(id: string): Promise<Schema | undefined>;
  findMany(): Promise<Schema[]>;
}
