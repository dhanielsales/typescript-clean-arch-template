import { RouteGroup } from '@presentation/protocols/http/route';

import { CreateUserControllerSchema } from '@presentation/controllers/http/user/validation/create-user-controller-schema';
import { CreateUserControllerFactory } from '@shared/infra/aggregators/factories/presentation/controllers/http/create-user-controller';

import { ListUsersControllerFactory } from '@shared/infra/aggregators/factories/presentation/controllers/http/list-users-controller';

export const UserRoutes: RouteGroup = {
  prefix: '/user',
  routes: [
    {
      path: '/',
      method: 'GET',
      handler: ListUsersControllerFactory.make(),
    },
    {
      path: '/',
      method: 'POST',
      handler: CreateUserControllerFactory.make(),
      schema: CreateUserControllerSchema,
    },
  ],
};
