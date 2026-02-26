import { Test, TestingModule } from '@nestjs/testing';
import { IRoleRepository } from 'src/application/interfaces/role-repository';
import { IUserRepository } from 'src/application/interfaces/user-repository';
import { DeleteRoleUseCase } from 'src/application/usecases/role/delete-role.usecase';
import { mock } from 'jest-mock-extended';
import { mockRole } from 'test/mocks/roleMocks';
import { Result } from 'src/core/result';
import { RoleHasAssignedUsersFailure, RoleNotFoundFailure } from 'src/domain/failures/role.failures';
import Mocked = jest.Mocked;

describe('DeleteRoleUseCase', () => {
  let useCase: DeleteRoleUseCase;
  let roleRepository: Mocked<IRoleRepository>;
  let userRepository: Mocked<IUserRepository>;

  const roleNotFoundFailure = new RoleNotFoundFailure();
  const roleHasUsersFailure = new RoleHasAssignedUsersFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteRoleUseCase,
        {
          provide: 'RoleRepository',
          useValue: mock<IRoleRepository>(),
        },
        {
          provide: 'UserRepository',
          useValue: mock<IUserRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<DeleteRoleUseCase>(DeleteRoleUseCase);
    roleRepository = module.get('RoleRepository');
    userRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully deletes a role when no users are assigned', async () => {
    roleRepository.findById.mockResolvedValueOnce(Result.ok(mockRole));
    userRepository.countByRoleId.mockResolvedValueOnce(0);
    roleRepository.delete.mockResolvedValueOnce(Result.ok(mockRole));

    const result = await useCase.execute({ id: mockRole.id });

    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith(mockRole.id);
    expect(userRepository.countByRoleId).toHaveBeenCalledTimes(1);
    expect(userRepository.countByRoleId).toHaveBeenCalledWith(mockRole.id);
    expect(roleRepository.delete).toHaveBeenCalledTimes(1);
    expect(roleRepository.delete).toHaveBeenCalledWith(mockRole.id);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockRole);
  });

  test('Fails when role not found', async () => {
    roleRepository.findById.mockResolvedValueOnce(Result.fail(roleNotFoundFailure));

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(userRepository.countByRoleId).not.toHaveBeenCalled();
    expect(roleRepository.delete).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(roleNotFoundFailure);
  });

  test('Fails when role has assigned users', async () => {
    roleRepository.findById.mockResolvedValueOnce(Result.ok(mockRole));
    userRepository.countByRoleId.mockResolvedValueOnce(2);

    const result = await useCase.execute({ id: mockRole.id });

    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith(mockRole.id);
    expect(userRepository.countByRoleId).toHaveBeenCalledTimes(1);
    expect(userRepository.countByRoleId).toHaveBeenCalledWith(mockRole.id);
    expect(roleRepository.delete).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(roleHasUsersFailure);
  });
});
