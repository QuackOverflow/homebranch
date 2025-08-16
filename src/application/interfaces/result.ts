class _Result {
  constructor(public isSuccess: boolean) {}
}

export class Failure extends _Result {
  constructor(public message: string) {
    super(false);
  }
}

export class Success<T> extends _Result {
  constructor(public value: T) {
    super(true);
  }
}

export type Result<T> = Success<T> | Failure;
