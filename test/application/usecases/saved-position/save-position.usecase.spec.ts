import { Test, TestingModule } from '@nestjs/testing';
import { ISavedPositionRepository } from 'src/application/interfaces/saved-position-repository';
import { SavePositionUseCase } from 'src/application/usecases/saved-position/save-position.usecase';
import { mock } from 'jest-mock-extended';
import { mockSavedPosition } from 'test/mocks/savedPositionMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import Mocked = jest.Mocked;

describe('SavePositionUseCase', () => {
  let useCase: SavePositionUseCase;
  let savedPositionRepository: Mocked<ISavedPositionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavePositionUseCase,
        {
          provide: 'SavedPositionRepository',
          useValue: mock<ISavedPositionRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<SavePositionUseCase>(SavePositionUseCase);
    savedPositionRepository = module.get('SavedPositionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully saves a position', async () => {
    savedPositionRepository.upsert.mockResolvedValueOnce(Result.ok(mockSavedPosition));

    const result = await useCase.execute({
      bookId: mockSavedPosition.bookId,
      userId: mockSavedPosition.userId,
      position: mockSavedPosition.position,
      deviceName: mockSavedPosition.deviceName,
    });

    expect(savedPositionRepository.upsert).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockSavedPosition);
  });

  test('Fails when upsert operation fails', async () => {
    const unexpectedFailure = new UnexpectedFailure('Unexpected error');
    savedPositionRepository.upsert.mockResolvedValueOnce(Result.fail(unexpectedFailure));

    const result = await useCase.execute({
      bookId: mockSavedPosition.bookId,
      userId: mockSavedPosition.userId,
      position: mockSavedPosition.position,
      deviceName: mockSavedPosition.deviceName,
    });

    expect(savedPositionRepository.upsert).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(unexpectedFailure);
  });
});
