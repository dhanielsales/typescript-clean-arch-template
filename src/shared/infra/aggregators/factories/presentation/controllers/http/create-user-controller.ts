import { CreateUserController } from '@presentation/controllers/http/user/create-user-controller';
import { HttpController } from '@presentation/protocols/http/controller';

import { CreateUserUsecaseFactory } from '@shared/infra/aggregators/factories/application/usecases/create-user-usecase';
import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<HttpController>>()
export class CreateUserControllerFactory {
  static make(): HttpController {
    const createUserUsecase = CreateUserUsecaseFactory.make();

    return new CreateUserController(createUserUsecase);
  }
}
