import { CreateUserController } from '@presentation/controllers/http/user/create-user-controller';
import { HttpController } from '@shared/protocols/http';

import { CreateUserUsecaseFactory } from '@shared/aggregators/factories/application/usecases/create-user-usecase';
import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<HttpController>>()
export class CreateUserControllerFactory {
  static make(): HttpController {
    const createUserUsecase = CreateUserUsecaseFactory.make();

    return new CreateUserController(createUserUsecase);
  }
}
