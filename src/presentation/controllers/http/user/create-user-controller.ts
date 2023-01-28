import { HttpRequest, HttpResponse } from '@shared/protocols/http';
import { HttpController } from '@shared/protocols/http/controller';
import { CreateUserUsecase } from '@application/usecases/create-user-usecase';

export class CreateUserController extends HttpController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {
    super();
  }

  public async perform(request: HttpRequest): Promise<HttpResponse> {
    const { name, phone, email, password } = request.body;

    const user = await this.createUserUsecase.handle({ name, phone, email, password });

    return {
      status: 201,
      payload: user,
    };
  }
}
