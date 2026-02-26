import { Test, TestingModule } from '@nestjs/testing';
import { ISavedPositionRepository } from 'src/application/interfaces/saved-position-repository';
import { DeleteSavedPositionUseCase } from 'src/application/usecases/saved-position/delete-saved-position.usecase';
import { mock } from 'jest-mock-extended';
import { mockSavedPosition } from 'test/mocks/savedPositionMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import Mocked = jest.Mocked;

describe('DeleteSavedPositionUseCase', () => {
  let useCase: DeleteSavedPositionUseCase;
  let savedPositionRepository: Mocked<ISavedPositionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSavedPositionUseCase,
        {
          provide: 'SavedPositionRepository',
          useValue: mock<ISavedPositionRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<DeleteSavedPositionUseCase>(DeleteSavedPositionUseCase);
    savedPositionRepository = module.get('SavedPositionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully deletes a saved position', async () => {
    savedPositionRepository.delete.mockResolvedValueOnce(Result.ok(undefined));

    const result = await useCase.execute({
      bookId: mockSavedPosition.bookId,
      userId: mockSavedPosition.userId,
    });

    expect(savedPositionRepository.delete).toHaveBeenCalledTimes(1);
    expect(savedPositionRepository.delete).toHaveBeenCalledWith(mockSavedPosition.bookId, mockSavedPosition.userId);
    expect(result.isSuccess()).toBe(true);
  });

  test('Fails when delete operation fails', async () => {
    const unexpectedFailure = new UnexpectedFailure('Unexpected error');
    savedPositionRepository.delete.mockResolvedValueOnce(Result.fail(unexpectedFailure));

    const result = await useCase.execute({
      bookId: mockSavedPosition.bookId,
      userId: mockSavedPosition.userId,
    });

    expect(savedPositionRepository.delete).toHaveBeenCalledTimes(1);
    expect(savedPositionRepository.delete).toHaveBeenCalledWith(mockSavedPosition.bookId, mockSavedPosition.userId);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(unexpectedFailure);
  });
});
