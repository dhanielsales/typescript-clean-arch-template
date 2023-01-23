import { BaseSchema } from '@shared/schemas/base';
import { Store } from '@shared/protocols/store';

export class InMemoryStore<Schema extends BaseSchema = any> implements Store<Schema> {
  private data: Schema[] = [];
  private static instance: InMemoryStore;

  private constructor() {}

  public static getInstance<Schema extends BaseSchema>(): InMemoryStore<Schema> {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
    }

    return InMemoryStore.instance;
  }

  public async create(payload: Schema): Promise<Schema> {
    this.data.push(payload);

    return payload;
  }

  public async update(id: string, payload: Partial<Schema>): Promise<number> {
    const finded = this.data.findIndex((curr) => curr.id === id);

    if (finded === -1) {
      return 0;
    }

    const updated = {
      ...this.data[finded],
      ...payload,
    };

    this.data[finded] = updated;

    return 1;
  }

  public async remove(id: string): Promise<number> {
    const finded = this.data.find((curr) => curr.id === id);

    if (!finded) {
      return 0;
    }

    this.data = this.data.filter((curr) => curr.id !== id);

    return 1;
  }

  public async findOne(id: string): Promise<Schema | undefined> {
    const finded = this.data.find((curr) => curr.id === id);

    return finded;
  }

  public async findMany(): Promise<Schema[]> {
    return this.data;
  }
}
