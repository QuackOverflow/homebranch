import { Failure } from '../../application/interfaces/result';

export class BookNotFoundFailure extends Failure {
  constructor() {
    super('Book not found');
  }
}
