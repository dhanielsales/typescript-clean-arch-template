import { User } from '@entities/user/user-entity';
import { CreateUserRepository } from '@entities/user/user-repositories';
import { InMemoryPersistenceRepository } from '@shared/infra/persistence/prototypes/in-memory-persistence-repository';
import { CreateUserPersistenceRepository } from '@shared/infra/persistence/user/protocols/create-user-persistence-repository';
import { CreateUserInMemoryRepository } from '@shared/infra/persistence/user/repositories/create-user-in-memory-repository';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<CreateUserPersistenceRepository>>()
export class CreateUserInMemoryRepositoryFactory {
  static make(): CreateUserPersistenceRepository {
    const inMemoryPersistenceRepository = InMemoryPersistenceRepository.getInstance<User>();
    const createUserRepository = new CreateUserRepository();

    return new CreateUserInMemoryRepository(inMemoryPersistenceRepository, createUserRepository);
  }
}
