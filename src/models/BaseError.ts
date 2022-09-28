import { ErrorResponseInterface } from "../interfaces/errors/ErrorResponseInterface";

export class BaseError extends Error {
  name: string;
  error: unknown;

  constructor(name: string, error: unknown) {
    super();
    this.name = name;
    this.error = error;
  }
}
