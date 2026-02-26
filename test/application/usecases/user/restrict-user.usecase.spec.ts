import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/application/interfaces/user-repository';
import { RestrictUserUseCase } from 'src/application/usecases/user/restrict-user.usecase';
import { mock } from 'jest-mock-extended';
import { mockUser } from 'test/mocks/userMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { UserNotFoundFailure } from 'src/domain/failures/user.failures';
import Mocked = jest.Mocked;

describe('RestrictUserUseCase', () => {
  let useCase: RestrictUserUseCase;
  let userRepository: Mocked<IUserRepository>;

  const userNotFoundFailure = new UserNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestrictUserUseCase,
        {
          provide: 'UserRepository',
          useValue: mock<IUserRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<RestrictUserUseCase>(RestrictUserUseCase);
    userRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully restricts a user', async () => {
    const restrictedUser = { ...mockUser, isRestricted: true };
    userRepository.findById.mockResolvedValueOnce(Result.ok(mockUser));
    userRepository.update.mockResolvedValueOnce(Result.ok(restrictedUser));

    const result = await useCase.execute({ id: mockUser.id });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value!.isRestricted).toBe(true);
  });

  test('Fails when user not found', async () => {
    userRepository.findById.mockResolvedValueOnce(Result.fail(userNotFoundFailure));

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(userRepository.update).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(userNotFoundFailure);
  });

  test('Fails when update operation fails', async () => {
    const unexpectedFailure = new UnexpectedFailure('Unexpected error');
    userRepository.findById.mockResolvedValueOnce(Result.ok(mockUser));
    userRepository.update.mockResolvedValueOnce(Result.fail(unexpectedFailure));

    const result = await useCase.execute({ id: mockUser.id });

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(unexpectedFailure);
  });
});
