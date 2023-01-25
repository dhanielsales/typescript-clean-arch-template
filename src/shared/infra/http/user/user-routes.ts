import { RouteGroup } from '@shared/protocols/route';

import { CreateUserControllerFactory } from '@shared/aggregators/factories/presentation/controllers/http/create-user-controller';
import { ListUsersControllerFactory } from '@shared/aggregators/factories/presentation/controllers/http/list-users-controller';

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
    },
  ],
};
