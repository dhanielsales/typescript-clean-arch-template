export type IsObject<T> = T extends any[]
  ? false
  : T extends Set<any>
  ? false
  : T extends Map<any, any>
  ? false
  : T extends Record<any, any>
  ? true
  : false;
