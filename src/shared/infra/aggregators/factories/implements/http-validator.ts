import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

import { Validator } from '@shared/infra/protocols/validator';
import { HttpRequest } from '@presentation/protocols/http';
import { HttpValidationSchema } from '@presentation/protocols/http/validator';

import { HttpValidator } from '../../validators/http/http-validator';
import { ZodHttpValidator } from '../../adapters/validators/zod-http-validator';

@StaticImplements<Factory<Validator<HttpRequest, HttpValidationSchema>>>()
export class HttpValidatorFactory {
  static make(): Validator<HttpRequest, HttpValidationSchema> {
    const validatorsTypes = new ZodHttpValidator();
    return new HttpValidator(validatorsTypes);
  }
}
