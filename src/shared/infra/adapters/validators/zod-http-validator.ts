import { z } from 'zod';

import { HttpValidatorsTypes } from '@presentation/protocols/http/validator';

export class ZodHttpValidator implements HttpValidatorsTypes {
  // General
  public boolean(value: any): boolean {
    return !z.boolean().safeParse(value).success;
  }

  public object(value: any): boolean {
    return Array.isArray(value) || typeof value !== 'object' || value === null;
  }

  public array(value: any): boolean {
    return !Array.isArray(value);
  }

  // Strings
  public string(value: any): boolean {
    return !z.string().safeParse(value).success;
  }

  public email(value: any): boolean {
    return !z.string().email().safeParse(value).success;
  }

  public datetime(value: any): boolean {
    return !z.string().datetime().safeParse(value).success;
  }

  // Numbers
  public number(value: any): boolean {
    return !z.number().safeParse(value).success;
  }

  public positive(value: any): boolean {
    return !z.number().positive().safeParse(value).success;
  }

  public negative(value: any): boolean {
    return !z.number().negative().safeParse(value).success;
  }

  public integer(value: any): boolean {
    return !z.number().int().safeParse(value).success;
  }
}
