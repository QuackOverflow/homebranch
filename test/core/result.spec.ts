import { Failure, Result, UnexpectedFailure } from 'src/core/result';

class TestFailure extends Failure {
  constructor() {
    super('TEST_FAILURE', 'This is a test failure');
  }
}

describe('Result', () => {
  describe('ok', () => {
    test('Creates a successful result with value', () => {
      const result = Result.ok('test value');

      expect(result.success).toBe(true);
      expect(result.value).toBe('test value');
      expect(result.failure).toBeUndefined();
    });

    test('Creates a successful result without value', () => {
      const result = Result.ok();

      expect(result.success).toBe(true);
      expect(result.value).toBeUndefined();
      expect(result.failure).toBeUndefined();
    });

    test('Creates a successful result with complex value', () => {
      const value = { id: '1', name: 'test' };
      const result = Result.ok(value);

      expect(result.success).toBe(true);
      expect(result.value).toEqual(value);
    });

    test('Creates a successful result with array value', () => {
      const value = [1, 2, 3];
      const result = Result.ok(value);

      expect(result.success).toBe(true);
      expect(result.value).toEqual(value);
    });
  });

  describe('fail', () => {
    test('Creates a failed result with failure', () => {
      const failure = new TestFailure();
      const result = Result.fail(failure);

      expect(result.success).toBe(false);
      expect(result.failure).toBe(failure);
      expect(result.value).toBeUndefined();
    });

    test('Creates a failed result with failure and value', () => {
      const failure = new TestFailure();
      const value = 'fallback value';
      const result = Result.fail(failure, value);

      expect(result.success).toBe(false);
      expect(result.failure).toBe(failure);
      expect(result.value).toBe(value);
    });

    test('Creates a failed result with UnexpectedFailure', () => {
      const failure = new UnexpectedFailure('Custom error message');
      const result = Result.fail(failure);

      expect(result.success).toBe(false);
      expect(result.failure?.message).toBe('Custom error message');
    });
  });

  describe('isSuccess', () => {
    test('Returns true for successful result', () => {
      const result = Result.ok('value');

      expect(result.isSuccess()).toBe(true);
    });

    test('Returns false for failed result', () => {
      const result = Result.fail(new TestFailure());

      expect(result.isSuccess()).toBe(false);
    });

    test('Type guard works correctly', () => {
      const result = Result.ok('test');

      if (result.isSuccess()) {
        expect(result.value).toBe('test');
      } else {
        fail('Should be successful');
      }
    });
  });

  describe('isFailure', () => {
    test('Returns true for failed result', () => {
      const result = Result.fail(new TestFailure());

      expect(result.isFailure()).toBe(true);
    });

    test('Returns false for successful result', () => {
      const result = Result.ok('value');

      expect(result.isFailure()).toBe(false);
    });

    test('Type guard works correctly', () => {
      const failure = new TestFailure();
      const result = Result.fail(failure);

      if (result.isFailure()) {
        expect(result.failure).toBe(failure);
      } else {
        fail('Should be failed');
      }
    });
  });

  describe('Failure', () => {
    test('Creates a custom failure with code and message', () => {
      const failure = new TestFailure();

      expect(failure.code).toBe('TEST_FAILURE');
      expect(failure.message).toBe('This is a test failure');
    });

    test('UnexpectedFailure has correct defaults', () => {
      const failure = new UnexpectedFailure();

      expect(failure.code).toBe('UNEXPECTED_ERROR');
      expect(failure.message).toBe('An unexpected error occurred');
    });

    test('UnexpectedFailure uses custom message', () => {
      const customMessage = 'Database connection failed';
      const failure = new UnexpectedFailure(customMessage);

      expect(failure.message).toBe(customMessage);
      expect(failure.code).toBe('UNEXPECTED_ERROR');
    });
  });
});
