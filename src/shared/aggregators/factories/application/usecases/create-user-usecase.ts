import { CreateUserUsecase } from '@application/usecases/create-user-usecase';
import { CreateUserInMemoryStoreFactory } from '@shared/aggregators/factories/repositories/create-user-in-memory-store';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';
import { NotifyUserCreationFactory } from '../events/notify-user-creation';

@StaticImplements<Factory<CreateUserUsecase>>()
export class CreateUserUsecaseFactory {
  static make(): CreateUserUsecase {
    const createUserInMemoryStore = CreateUserInMemoryStoreFactory.make();
    const notifyUserCreation = NotifyUserCreationFactory.make();

    return new CreateUserUsecase(createUserInMemoryStore, notifyUserCreation);
  }
}
