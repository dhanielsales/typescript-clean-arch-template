import { HttpRequest, HttpResponse } from '@shared/protocols/http';
import { HttpController } from '@shared/protocols/http/controller';

import { ListUsersUsecase } from '@application/usecases/list-users-usecase';

export class ListUsersController extends HttpController {
  constructor(private readonly listUsersUsecase: ListUsersUsecase) {
    super();
  }

  public async perform(_request: HttpRequest): Promise<HttpResponse> {
    const users = await this.listUsersUsecase.handle();

    return {
      status: 200,
      payload: users,
    };
  }
}
