import { ListUsersUsecase } from '@application/usecases/list-users-usecase';
import { ListUsersInMemoryRepositoryFactory } from '@shared/aggregators/factories/repositories/list-users-in-memory-repository';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<ListUsersUsecase>>()
export class ListUsersUsecaseFactory {
  static make(): ListUsersUsecase {
    const listUsersInMemoryRepository = ListUsersInMemoryRepositoryFactory.make();

    return new ListUsersUsecase(listUsersInMemoryRepository);
  }
}
