import { HttpRequest } from '@presentation/protocols/http';
import {
  HttpValidation,
  HttpValidationSchema,
  HttpValidatorsTypes,
} from '@presentation/protocols/http/validator';

import { Validator } from '@shared/infra/protocols/validator';
import { isPrimitive } from '@shared/utils/is-primitive';
import { BadRequestError } from '@shared/infra/aggregators/errors/bad-request-error';

interface InvalidFieldsDetail {
  [field: string]: string;
}

interface InvalidFields {
  [HttpValidation.Context.BODY]?: InvalidFieldsDetail;
  [HttpValidation.Context.QUERY]?: InvalidFieldsDetail;
  [HttpValidation.Context.PARAMS]?: InvalidFieldsDetail;
}

interface ValidateParams {
  fieldName: string;
  value: any;
  context: HttpValidation.Context;
  invalidFields: InvalidFields;
}

interface ValidateParamsRules extends ValidateParams {
  rules: HttpValidation.Constraints<any, any>;
}

interface ValidateParamsTypes extends ValidateParams {
  type: HttpValidation.Types;
}

export class HttpValidator implements Validator<HttpRequest, HttpValidationSchema> {
  constructor(private readonly validatorsTypes: HttpValidatorsTypes) {}

  public validate(request: HttpRequest, schema: HttpValidationSchema): void {
    const contexts = Object.values(HttpValidation.Context);
    let invalidFields: InvalidFields = {};

    for (const context of contexts) {
      const fieldsInSchema = schema[context] ?? {};

      invalidFields = this.handle(context, request[context], fieldsInSchema, invalidFields);
    }

    const hasInvalidFields = Object.values(invalidFields).length > 0;
    if (hasInvalidFields) {
      throw new BadRequestError('Invalid fields', { invalid: invalidFields });
    }
  }

  private handle(
    context: HttpValidation.Context,
    payload: any,
    fields: HttpValidation.Fields<any>,
    invalidFields: InvalidFields,
    parentFieldName: string = '',
  ): InvalidFields {
    const fieldNames = Object.keys(fields);

    for (const name of fieldNames) {
      // Setup
      const value = payload?.[name];
      const rules = fields[name] as HttpValidation.ConstraintsAny;
      const fieldName = this.getComposedName(parentFieldName, name);

      // Requirement Validate
      invalidFields = this.validateRequirement({ fieldName, value, rules, context, invalidFields });

      // Type Validate
      invalidFields = this.validateType({
        fieldName,
        value,
        type: rules.type,
        context,
        invalidFields,
      });

      // Array Validate
      invalidFields = this.validateArray({ fieldName, value, rules, context, invalidFields });

      // Object Validate
      invalidFields = this.validateObject({ fieldName, value, rules, context, invalidFields });
    }

    return invalidFields;
  }

  private validateObject(params: ValidateParamsRules): InvalidFields {
    const { value, context, rules, fieldName } = params;
    let { invalidFields } = params;

    const valueExists = value !== null && value !== undefined;
    const ruleTypeIsObject = HttpValidation.constraintsHasType(rules, 'object');

    if (!ruleTypeIsObject || !valueExists) {
      return invalidFields;
    }

    const rulesHaveItemType = HttpValidation.constraintsHasField(rules, 'itemType');

    if (!rulesHaveItemType) {
      return invalidFields;
    }

    const fields = rules.itemType as HttpValidation.Fields<any>;
    invalidFields = this.handle(context, value, fields, invalidFields, fieldName);

    return invalidFields;
  }

  private validateArray(params: ValidateParamsRules): InvalidFields {
    const { value, context, rules, fieldName } = params;
    let { invalidFields } = params;

    const valueIsArray = Array.isArray(value);
    const ruleTypeIsArray = HttpValidation.constraintsHasType(rules, 'array');

    if (!ruleTypeIsArray || !valueIsArray) {
      return invalidFields;
    }

    const rulesHaveItemType = HttpValidation.constraintsHasField(rules, 'itemType');

    if (!rulesHaveItemType) {
      return invalidFields;
    }

    const itemTypeIsFields = HttpValidation.isFields(rules.itemType);

    if (itemTypeIsFields) {
      const fields = rules.itemType as HttpValidation.Fields<any>;

      for (const val of value) {
        if (isPrimitive(val)) {
          invalidFields = this.validateType({
            fieldName,
            value: val,
            type: 'object',
            context,
            invalidFields,
          });
        } else {
          invalidFields = this.handle(context, val, fields, invalidFields, fieldName);
        }
      }
    } else {
      const itemType = rules.itemType as HttpValidation.Types;

      for (const val of value) {
        invalidFields = this.validateType({
          fieldName,
          value: val,
          type: itemType,
          context,
          invalidFields,
        });
      }
    }

    return invalidFields;
  }

  private validateRequirement(params: ValidateParamsRules): InvalidFields {
    const { value, context, rules, fieldName } = params;
    let { invalidFields } = params;

    const isRequired = rules.required;
    const isUndefined = value === undefined;

    const isInvalid = !!(isRequired && isUndefined);

    if (isInvalid) {
      const message = `Field '${fieldName}' is required.`;
      invalidFields = this.updateInvalidFields(fieldName, context, message, invalidFields);
    }

    return invalidFields;
  }

  private validateType(params: ValidateParamsTypes): InvalidFields {
    const { value, context, type, fieldName } = params;
    let { invalidFields } = params;

    const valueExists = value !== null && value !== undefined;
    const typeValidator = this.getFieldValidator(type);

    const isInvalid = !!(valueExists && typeValidator(value));

    if (isInvalid) {
      const message = `Invalid type on field '${fieldName}', expected type '${type}' but received '${typeof value}'.`;
      invalidFields = this.updateInvalidFields(fieldName, context, message, invalidFields);
    }

    return invalidFields;
  }

  private getFieldValidator(type: HttpValidation.Types): (value: any) => boolean {
    return this.validatorsTypes[type];
  }

  private getComposedName(...names: string[]): string {
    return names.filter(Boolean).join('.');
  }

  private updateInvalidFields(
    fieldName: string,
    context: HttpValidation.Context,
    message: string,
    invalidFields: InvalidFields,
  ): InvalidFields {
    return {
      ...invalidFields,
      [context]: {
        ...invalidFields[context],
        [fieldName]: message,
      },
    };
  }
}
