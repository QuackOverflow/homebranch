import { PERMISSIONS_KEY, RequirePermissions } from 'src/infrastructure/guards/require-permissions.decorator';
import { Permission } from 'src/domain/value-objects/permission.enum';

describe('RequirePermissions Decorator', () => {
  test('PERMISSIONS_KEY constant is defined', () => {
    expect(PERMISSIONS_KEY).toBe('permissions');
  });

  test('RequirePermissions is a function', () => {
    expect(typeof RequirePermissions).toBe('function');
  });

  test('RequirePermissions accepts single permission', () => {
    const decorator = RequirePermissions(Permission.MANAGE_BOOKS);
    expect(decorator).toBeDefined();
  });

  test('RequirePermissions accepts multiple permissions', () => {
    const decorator = RequirePermissions(Permission.MANAGE_BOOKS, Permission.MANAGE_USERS);
    expect(decorator).toBeDefined();
  });

  test('Can decorate a method', () => {
    class TestClass {
      @RequirePermissions(Permission.MANAGE_BOOKS)
      testMethod() {
        return 'test';
      }
    }

    const instance = new TestClass();
    expect(instance.testMethod()).toBe('test');
  });
});
