import { ListUsersUsecase } from '@application/usecases/list-users-usecase';
import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { HttpController } from '@presentation/protocols/http/controller';

export class ListUsersController extends HttpController {
  constructor(private readonly listUsersUsecase: ListUsersUsecase) {
    super();
  }

  public async handle(_request: HttpRequest): Promise<HttpResponse> {
    const users = await this.listUsersUsecase.handle();

    return {
      status: 200,
      payload: users,
    };
  }
}
