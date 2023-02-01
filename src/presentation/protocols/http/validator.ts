import { ArrayType, IsAny, IsObject, IsPrimitive, IsArray } from '@shared/utils/types';
import { isObject } from '@shared/utils/is-object';
import { isPrimitive } from '@shared/utils/is-primitive';

export namespace HttpValidation {
  export type TypeString = 'string' | 'email' | 'datetime';
  export type TypeNumber = 'number' | 'positive' | 'negative' | 'integer';
  export type TypeBoolean = 'boolean';
  export type TypeArray = 'array';
  export type TypeObject = 'object';
  export type Types = TypeString | TypeNumber | TypeBoolean | TypeArray | TypeObject;

  type PickType<T> = T extends string
    ? TypeString
    : T extends number
    ? TypeNumber
    : T extends boolean
    ? TypeBoolean
    : never;

  type ItemType<T> = { itemType?: Fields<T> };

  export enum Context {
    BODY = 'body',
    PARAMS = 'params',
    QUERY = 'query',
  }

  export type Fields<T> = {
    [K in keyof T]?: Constraints<K, T>;
  };

  interface BaseConstraints<T> {
    required: boolean;
    type: T;
  }

  export type ConstraintsAny =
    | {
        required: boolean;
        type: Types;
        itemType?: never;
      }
    | {
        required: boolean;
        type: TypeObject;
        itemType?: Fields<any>;
      }
    | {
        required: boolean;
        type: TypeArray;
        itemType?: Fields<any> | TypeString | TypeNumber | TypeBoolean;
      };

  export type Constraints<K extends keyof (T | T[][0]), T> = IsAny<T> extends true
    ? ConstraintsAny
    : IsArray<T[K]> extends true
    ? IsPrimitive<ArrayType<T[K]>> extends true
      ? BaseConstraints<TypeArray> & { itemType: PickType<ArrayType<T[K]>> }
      : BaseConstraints<TypeArray> & ItemType<ArrayType<T[K]>>
    : IsObject<T[K]> extends true
    ? BaseConstraints<TypeObject> & ItemType<T[K]>
    : IsAny<T[K]> extends true
    ? BaseConstraints<TypeObject> & ItemType<T[K]>
    : BaseConstraints<PickType<T[K]>>;

  export function constraintsHasField(object: any, field: keyof ConstraintsAny): boolean {
    const hasProperty = Object.prototype.hasOwnProperty.call(object, field);

    if (hasProperty) {
      return isConstraints(object);
    }

    return false;
  }

  export function constraintsHasType(object: any, type: Types): boolean {
    if (object.type === type) {
      return isConstraints(object);
    }

    return false;
  }

  export function isConstraints(object: any): object is Constraints<any, any> {
    if (!isObject(object)) return false;

    const hasPropertyRequired = Object.prototype.hasOwnProperty.call(object, 'required');
    const hasPropertyType = Object.prototype.hasOwnProperty.call(object, 'type');

    if (!hasPropertyRequired || !hasPropertyType) {
      return false;
    }

    const propRequiredIsBool = typeof object.required === 'boolean';
    const propTypeIsString = typeof object.type === 'string';

    if (!propRequiredIsBool || !propTypeIsString) {
      return false;
    }

    const isTypeObjectOrArray = object.type === 'object' || object.type === 'array';
    const hasPropertyItemType = Object.prototype.hasOwnProperty.call(object, 'itemType');

    if (!isTypeObjectOrArray && hasPropertyItemType) {
      return false;
    }

    const propertyItemTypeIsPrimitive = isPrimitive(object.itemType);

    if (isTypeObjectOrArray && hasPropertyItemType && !propertyItemTypeIsPrimitive) {
      return isFields(object.itemType);
    }

    return true;
  }

  export function isFields(object: any): object is Fields<any> {
    if (!isObject(object)) return false;

    const objectKeys = Object.keys(object);

    if (objectKeys.length === 0) return false;

    for (const key of Object.keys(object)) {
      if (!isConstraints(object[key])) {
        return false;
      }
    }

    return true;
  }
}

export type HttpValidatorsTypes = {
  [Key in HttpValidation.Types]: (value: any) => boolean;
};

export interface HttpValidationSchema<
  Body extends object = any,
  Query extends object = any,
  Params extends object = any,
> {
  [HttpValidation.Context.BODY]?: HttpValidation.Fields<Body>;
  [HttpValidation.Context.QUERY]?: HttpValidation.Fields<Query>;
  [HttpValidation.Context.PARAMS]?: HttpValidation.Fields<Params>;
}
