import { User } from '@entities/user/user-entity';
import { InMemoryPersistenceRepository } from '@shared/infra/persistence/prototypes/in-memory-persistence-repository';
import { ListUsersPersistenceRepository } from '@shared/infra/persistence/user/protocols/list-users-persistence-repository';
import { ListUsersInMemoryRepository } from '@shared/infra/persistence/user/repositories/list-users-in-memory-repository';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<ListUsersPersistenceRepository>>()
export class ListUsersInMemoryRepositoryFactory {
  static make(): ListUsersPersistenceRepository {
    const inMemoryPersistenceRepository = InMemoryPersistenceRepository.getInstance<User>();

    return new ListUsersInMemoryRepository(inMemoryPersistenceRepository);
  }
}
