import { Test, TestingModule } from '@nestjs/testing';
import { IRoleRepository } from 'src/application/interfaces/role-repository';
import { GetRolesUseCase } from 'src/application/usecases/role/get-roles.usecase';
import { mock } from 'jest-mock-extended';
import { mockRole } from 'test/mocks/roleMocks';
import { Result } from 'src/core/result';
import { Role } from 'src/domain/entities/role.entity';
import { Permission } from 'src/domain/value-objects/permission.enum';
import Mocked = jest.Mocked;

describe('GetRolesUseCase', () => {
  let useCase: GetRolesUseCase;
  let roleRepository: Mocked<IRoleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRolesUseCase,
        {
          provide: 'RoleRepository',
          useValue: mock<IRoleRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetRolesUseCase>(GetRolesUseCase);
    roleRepository = module.get('RoleRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves all roles', async () => {
    const mockRoles = [mockRole, new Role('role-2', 'viewer', [Permission.MANAGE_ROLES])];
    roleRepository.findAll.mockResolvedValueOnce(Result.ok(mockRoles));

    const result = await useCase.execute();

    expect(roleRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockRoles);
  });

  test('Returns empty array when no roles exist', async () => {
    roleRepository.findAll.mockResolvedValueOnce(Result.ok([]));

    const result = await useCase.execute();

    expect(roleRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual([]);
  });
});
