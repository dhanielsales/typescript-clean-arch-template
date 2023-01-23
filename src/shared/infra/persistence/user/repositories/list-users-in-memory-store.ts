import { InMemoryStore } from '@shared/infra/persistence/prototypes/in-memory-store';
import { UserSchema } from '@shared/schemas/user';
import { ListUsersStore } from '../protocols/list-users-store';

export class ListUsersInMemoryStore implements ListUsersStore {
  constructor(private readonly store: InMemoryStore<UserSchema>) {}

  public async handle(): Promise<ListUsersStore.Response> {
    const users = await this.store.findMany();

    return users;
  }
}
