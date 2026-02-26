import { Test, TestingModule } from '@nestjs/testing';
import { IRoleRepository } from 'src/application/interfaces/role-repository';
import { CreateRoleUseCase } from 'src/application/usecases/role/create-role.usecase';
import { mock } from 'jest-mock-extended';
import { mockRole } from 'test/mocks/roleMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { DuplicateRoleNameFailure } from 'src/domain/failures/role.failures';
import Mocked = jest.Mocked;

describe('CreateRoleUseCase', () => {
  let useCase: CreateRoleUseCase;
  let roleRepository: Mocked<IRoleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRoleUseCase,
        {
          provide: 'RoleRepository',
          useValue: mock<IRoleRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<CreateRoleUseCase>(CreateRoleUseCase);
    roleRepository = module.get('RoleRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully creates a role', async () => {
    roleRepository.findByName.mockResolvedValueOnce(Result.fail(new UnexpectedFailure('Role not found')));
    roleRepository.create.mockResolvedValueOnce(Result.ok(mockRole));

    const result = await useCase.execute({
      name: 'editor',
      permissions: mockRole.permissions,
    });

    expect(roleRepository.findByName).toHaveBeenCalledTimes(1);
    expect(roleRepository.findByName).toHaveBeenCalledWith('editor');
    expect(roleRepository.create).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockRole);
  });

  test('Fails when role name already exists', async () => {
    const duplicateFailure = new DuplicateRoleNameFailure();
    roleRepository.findByName.mockResolvedValueOnce(Result.ok(mockRole));

    const result = await useCase.execute({
      name: 'editor',
      permissions: mockRole.permissions,
    });

    expect(roleRepository.findByName).toHaveBeenCalledTimes(1);
    expect(roleRepository.findByName).toHaveBeenCalledWith('editor');
    expect(roleRepository.create).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(duplicateFailure);
  });
});
