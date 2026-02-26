import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGuard } from 'src/infrastructure/guards/permissions.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { ForbiddenError } from 'src/domain/exceptions/forbidden.exception';
import { Permission } from 'src/domain/value-objects/permission.enum';
import { mockRole } from 'test/mocks/roleMocks';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsGuard, Reflector],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createExecutionContext = (permissions: Permission[] | undefined, user: any): ExecutionContext => {
    const mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({ user })),
      })),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(permissions);

    return mockExecutionContext;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Returns true when no permissions are required', () => {
    const context = createExecutionContext(undefined, {
      id: 'user-1',
      username: 'test',
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  test('Returns true when user has all required permissions', () => {
    const context = createExecutionContext([Permission.MANAGE_BOOKS], {
      id: 'user-1',
      username: 'test',
      role: mockRole,
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  test('Throws ForbiddenError when user lacks required permissions', () => {
    const context = createExecutionContext([Permission.MANAGE_USERS], {
      id: 'user-1',
      username: 'test',
      role: { ...mockRole, permissions: [Permission.MANAGE_BOOKS] },
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenError);
  });

  test('Throws ForbiddenError when user has no role', () => {
    const context = createExecutionContext([Permission.MANAGE_BOOKS], {
      id: 'user-1',
      username: 'test',
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenError);
  });

  test('Throws ForbiddenError when user role has no permissions', () => {
    const context = createExecutionContext([Permission.MANAGE_BOOKS], {
      id: 'user-1',
      username: 'test',
      role: { id: 'role-1', name: 'viewer', permissions: undefined },
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenError);
  });

  test('Handles multiple required permissions correctly', () => {
    const context = createExecutionContext([Permission.MANAGE_BOOKS, Permission.MANAGE_USERS], {
      id: 'user-1',
      username: 'test',
      role: {
        id: 'role-1',
        name: 'admin',
        permissions: [Permission.MANAGE_BOOKS, Permission.MANAGE_USERS],
      },
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  test('Returns empty array when no permissions are required', () => {
    const context = createExecutionContext([], {
      id: 'user-1',
      username: 'test',
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});
