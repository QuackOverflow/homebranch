import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/application/interfaces/user-repository';
import { IRoleRepository } from 'src/application/interfaces/role-repository';
import { AssignRoleUseCase } from 'src/application/usecases/user/assign-role.usecase';
import { mock } from 'jest-mock-extended';
import { mockUser } from 'test/mocks/userMocks';
import { mockRole } from 'test/mocks/roleMocks';
import { Result } from 'src/core/result';
import { UserNotFoundFailure } from 'src/domain/failures/user.failures';
import { RoleNotFoundFailure } from 'src/domain/failures/role.failures';
import Mocked = jest.Mocked;

describe('AssignRoleUseCase', () => {
  let useCase: AssignRoleUseCase;
  let userRepository: Mocked<IUserRepository>;
  let roleRepository: Mocked<IRoleRepository>;

  const userNotFoundFailure = new UserNotFoundFailure();
  const roleNotFoundFailure = new RoleNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignRoleUseCase,
        {
          provide: 'UserRepository',
          useValue: mock<IUserRepository>(),
        },
        {
          provide: 'RoleRepository',
          useValue: mock<IRoleRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<AssignRoleUseCase>(AssignRoleUseCase);
    userRepository = module.get('UserRepository');
    roleRepository = module.get('RoleRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully assigns a role to a user', async () => {
    const userWithRole = { ...mockUser, role: mockRole };
    userRepository.findById.mockResolvedValueOnce(Result.ok(mockUser));
    roleRepository.findById.mockResolvedValueOnce(Result.ok(mockRole));
    userRepository.update.mockResolvedValueOnce(Result.ok(userWithRole));

    const result = await useCase.execute({
      userId: mockUser.id,
      roleId: mockRole.id,
    });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith(mockRole.id);
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(userWithRole);
  });

  test('Fails when user not found', async () => {
    userRepository.findById.mockResolvedValueOnce(Result.fail(userNotFoundFailure));

    const result = await useCase.execute({
      userId: 'non-existent-user-id',
      roleId: mockRole.id,
    });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-user-id');
    expect(roleRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.update).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(userNotFoundFailure);
  });

  test('Fails when role not found', async () => {
    userRepository.findById.mockResolvedValueOnce(Result.ok(mockUser));
    roleRepository.findById.mockResolvedValueOnce(Result.fail(roleNotFoundFailure));

    const result = await useCase.execute({
      userId: mockUser.id,
      roleId: 'non-existent-role-id',
    });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith('non-existent-role-id');
    expect(userRepository.update).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(roleNotFoundFailure);
  });
});
