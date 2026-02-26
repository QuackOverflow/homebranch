import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/application/interfaces/user-repository';
import { GetUsersUseCase } from 'src/application/usecases/user/get-users.usecase';
import { mock } from 'jest-mock-extended';
import { mockUser } from 'test/mocks/userMocks';
import { Result } from 'src/core/result';
import { PaginationResult } from 'src/core/pagination_result';
import { User } from 'src/domain/entities/user.entity';
import Mocked = jest.Mocked;

describe('GetUsersUseCase', () => {
  let useCase: GetUsersUseCase;
  let userRepository: Mocked<IUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersUseCase,
        {
          provide: 'UserRepository',
          useValue: mock<IUserRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetUsersUseCase>(GetUsersUseCase);
    userRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves paginated users', async () => {
    const mockUsers = [mockUser, new User('user-2', 'bob', 'bob@example.com', false)];
    const paginationResult: PaginationResult<User[]> = {
      data: mockUsers,
      limit: 10,
      offset: 0,
      total: 2,
      nextCursor: null,
    };
    userRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(userRepository.findAll).toHaveBeenCalledWith(10, 0);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(paginationResult);
  });

  test('Successfully retrieves users with different pagination parameters', async () => {
    const mockUsers = [mockUser];
    const paginationResult: PaginationResult<User[]> = {
      data: mockUsers,
      limit: 5,
      offset: 10,
      total: 50,
      nextCursor: 15,
    };
    userRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    const result = await useCase.execute({ limit: 5, offset: 10 });

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(userRepository.findAll).toHaveBeenCalledWith(5, 10);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(paginationResult);
  });
});
