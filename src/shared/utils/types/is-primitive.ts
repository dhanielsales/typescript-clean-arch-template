export type IsPrimitive<T> = T extends string
  ? true
  : T extends number
  ? true
  : T extends boolean
  ? true
  : false;
