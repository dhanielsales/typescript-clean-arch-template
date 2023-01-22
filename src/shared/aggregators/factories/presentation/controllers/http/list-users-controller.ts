import { HttpController } from '@shared/protocols/http';
import { ListUsersController } from '@presentation/controllers/http/user/list-users-controller';

import { ListUsersUsecaseFactory } from '@shared/aggregators/factories/application/usecases/list-users-usecase';
import { StaticImplements } from '@shared/utils/types/static-implements';
import { Factory } from '@shared/protocols/factory';

@StaticImplements<Factory<HttpController>>()
export class ListUsersControllerFactory {
  static make(): HttpController {
    const createUserUsecase = ListUsersUsecaseFactory.make();

    return new ListUsersController(createUserUsecase);
  }
}
