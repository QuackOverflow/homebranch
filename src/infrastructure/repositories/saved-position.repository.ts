import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISavedPositionRepository } from 'src/application/interfaces/saved-position-repository';
import { SavedPositionEntity } from 'src/infrastructure/database/saved-position.entity';
import { SavedPositionMapper } from 'src/infrastructure/mappers/saved-position.mapper';
import { SavedPosition } from 'src/domain/entities/saved-position.entity';
import { SavedPositionNotFoundFailure } from 'src/domain/failures/saved-position.failures';
import { Result } from 'src/core/result';

@Injectable()
export class TypeOrmSavedPositionRepository implements ISavedPositionRepository {
  constructor(
    @InjectRepository(SavedPositionEntity)
    private repository: Repository<SavedPositionEntity>,
  ) {}

  async findAllByUser(userId: string): Promise<Result<SavedPosition[]>> {
    const entities = await this.repository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
    return Result.ok(entities.map((entity) => SavedPositionMapper.toDomain(entity)));
  }

  async findByBookAndUser(bookId: string, userId: string): Promise<Result<SavedPosition>> {
    const entity = await this.repository.findOne({
      where: { bookId, userId },
    });

    if (!entity) {
      return Result.fail(new SavedPositionNotFoundFailure());
    }

    return Result.ok(SavedPositionMapper.toDomain(entity));
  }

  async upsert(savedPosition: SavedPosition): Promise<Result<SavedPosition>> {
    const entity = SavedPositionMapper.toPersistence(savedPosition);
    const saved = await this.repository.save(entity);
    return Result.ok(SavedPositionMapper.toDomain(saved));
  }

  async delete(bookId: string, userId: string): Promise<Result<void>> {
    const result = await this.repository.delete({ bookId, userId });

    if (result.affected === 0) {
      return Result.fail(new SavedPositionNotFoundFailure());
    }

    return Result.ok();
  }
}
