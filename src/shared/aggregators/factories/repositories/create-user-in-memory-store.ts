import { User } from '@entities/user/user-entity';
import { CreateUserRepository } from '@entities/user/user-repositories';
import { InMemoryStore } from '@shared/infra/persistence/prototypes/in-memory-store';
import { CreateUserStore } from '@shared/infra/persistence/user/protocols/create-user-store';
import { CreateUserInMemoryStore } from '@shared/infra/persistence/user/repositories/create-user-in-memory-store';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<CreateUserStore>>()
export class CreateUserInMemoryStoreFactory {
  static make(): CreateUserStore {
    const inMemoryStore = InMemoryStore.getInstance<User>();
    const createUserRepository = new CreateUserRepository();

    return new CreateUserInMemoryStore(inMemoryStore, createUserRepository);
  }
}
