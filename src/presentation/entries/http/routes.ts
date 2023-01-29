import { MainGroup } from '@presentation/protocols/http/route';
import { UserRoutes } from './user/user-routes';

export const Main: MainGroup = {
  baseUrl: '/api',
  groups: [UserRoutes],
};
