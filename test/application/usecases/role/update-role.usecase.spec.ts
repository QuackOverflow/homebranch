import { Test, TestingModule } from '@nestjs/testing';
import { IRoleRepository } from 'src/application/interfaces/role-repository';
import { UpdateRoleUseCase } from 'src/application/usecases/role/update-role.usecase';
import { mock } from 'jest-mock-extended';
import { mockRole } from 'test/mocks/roleMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { RoleNotFoundFailure } from 'src/domain/failures/role.failures';
import { Permission } from 'src/domain/value-objects/permission.enum';
import Mocked = jest.Mocked;

describe('UpdateRoleUseCase', () => {
  let useCase: UpdateRoleUseCase;
  let roleRepository: Mocked<IRoleRepository>;

  const roleNotFoundFailure = new RoleNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRoleUseCase,
        {
          provide: 'RoleRepository',
          useValue: mock<IRoleRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<UpdateRoleUseCase>(UpdateRoleUseCase);
    roleRepository = module.get('RoleRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully updates a role', async () => {
    const newPermissions = [Permission.MANAGE_BOOKSHELVES, Permission.MANAGE_BOOKS];
    const updatedRole = { ...mockRole, permissions: newPermissions };
    roleRepository.findById.mockResolvedValueOnce(Result.ok(mockRole));
    roleRepository.update.mockResolvedValueOnce(Result.ok(updatedRole));

    const result = await useCase.execute({
      id: mockRole.id,
      permissions: newPermissions,
    });

    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith(mockRole.id);
    expect(roleRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(updatedRole);
  });

  test('Fails when role not found', async () => {
    roleRepository.findById.mockResolvedValueOnce(Result.fail(roleNotFoundFailure));

    const result = await useCase.execute({
      id: 'non-existent-id',
      permissions: [Permission.MANAGE_BOOKS],
    });

    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(roleRepository.update).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(roleNotFoundFailure);
  });

  test('Fails when update operation fails', async () => {
    const unexpectedFailure = new UnexpectedFailure('Unexpected error');
    roleRepository.findById.mockResolvedValueOnce(Result.ok(mockRole));
    roleRepository.update.mockResolvedValueOnce(Result.fail(unexpectedFailure));

    const result = await useCase.execute({
      id: mockRole.id,
      permissions: [Permission.MANAGE_BOOKS],
    });

    expect(roleRepository.findById).toHaveBeenCalledTimes(1);
    expect(roleRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(unexpectedFailure);
  });
});
