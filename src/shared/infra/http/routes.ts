import { Route } from '@shared/protocols/route';

import { CreateUserControllerFactory } from '@shared/aggregators/factories/presentation/controllers/http/create-user-controller';
import { ListUsersControllerFactory } from '@shared/aggregators/factories/presentation/controllers/http/list-users-controller';

export const Routes: Array<Route> = [
  {
    path: '/user',
    method: 'GET',
    handler: ListUsersControllerFactory.make(),
  },
  {
    path: '/user',
    method: 'POST',
    handler: CreateUserControllerFactory.make(),
  },
];
