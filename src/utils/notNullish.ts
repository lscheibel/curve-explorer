export const notNullish = <T>(v: T | null | undefined): v is T => v != null;
