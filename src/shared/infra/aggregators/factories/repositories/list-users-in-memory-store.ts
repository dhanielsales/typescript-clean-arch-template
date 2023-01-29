import { User } from '@domain/entities/user/user-entity';
import { InMemoryStore } from '@shared/infra/persistence/prototypes/in-memory-store';
import { ListUsersStore } from '@shared/infra/persistence/user/protocols/list-users-store';
import { ListUsersInMemoryStore } from '@shared/infra/persistence/user/repositories/list-users-in-memory-store';
import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<ListUsersStore>>()
export class ListUsersInMemoryStoreFactory {
  static make(): ListUsersStore {
    const inMemoryStore = InMemoryStore.getInstance<User>();

    return new ListUsersInMemoryStore(inMemoryStore);
  }
}
