import { ListUsersUsecase } from '@application/usecases/list-users-usecase';
import { ListUsersInMemoryStoreFactory } from '@shared/aggregators/factories/repositories/list-users-in-memory-store';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<ListUsersUsecase>>()
export class ListUsersUsecaseFactory {
  static make(): ListUsersUsecase {
    const listUsersInMemoryStore = ListUsersInMemoryStoreFactory.make();

    return new ListUsersUsecase(listUsersInMemoryStore);
  }
}
