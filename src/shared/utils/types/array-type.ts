export type ArrayType<T> = T extends Array<infer A> ? A : T;
