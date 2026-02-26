import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/application/interfaces/user-repository';
import { GetUserByIdUseCase } from 'src/application/usecases/user/get-user-by-id.usecase';
import { mock } from 'jest-mock-extended';
import { mockUser } from 'test/mocks/userMocks';
import { Result } from 'src/core/result';
import { UserNotFoundFailure } from 'src/domain/failures/user.failures';
import Mocked = jest.Mocked;

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  let userRepository: Mocked<IUserRepository>;

  const userNotFoundFailure = new UserNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: 'UserRepository',
          useValue: mock<IUserRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    userRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves a user by id', async () => {
    userRepository.findById.mockResolvedValueOnce(Result.ok(mockUser));

    const result = await useCase.execute({ id: mockUser.id });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockUser);
  });

  test('Fails when user not found', async () => {
    userRepository.findById.mockResolvedValueOnce(Result.fail(userNotFoundFailure));

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(userNotFoundFailure);
  });
});
