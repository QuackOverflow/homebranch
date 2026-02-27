import { Inject, Injectable, Logger } from '@nestjs/common';
import { IAuthorRepository } from 'src/application/interfaces/author-repository';
import { Author } from 'src/domain/entities/author.entity';
import { AuthorFactory } from 'src/domain/entities/author.factory';
import { OpenLibraryGateway } from 'src/infrastructure/gateways/open-library.gateway';
import { Result } from 'src/core/result';
import { PaginationResult } from 'src/core/pagination_result';
import { UseCase } from 'src/core/usecase';
import { PaginatedQuery } from 'src/core/paginated-query';

@Injectable()
export class GetAuthorsUseCase
  implements UseCase<PaginatedQuery, PaginationResult<Author[]>>
{
  private readonly logger = new Logger(GetAuthorsUseCase.name);

  constructor(
    @Inject('AuthorRepository') private authorRepository: IAuthorRepository,
    private readonly openLibraryGateway: OpenLibraryGateway,
  ) {}

  async execute({
    query,
    limit,
    offset,
  }: PaginatedQuery): Promise<Result<PaginationResult<Author[]>>> {
    const result = await this.authorRepository.findAll(query, limit, offset);

    if (result.isSuccess()) {
      const unenrichedAuthors = result.value.data.filter(
        (author) =>
          author.id !== null &&
          author.biography === null &&
          author.profilePictureUrl === null,
      );
      this.enrichAuthorsInBackground(unenrichedAuthors);
    }

    return result;
  }

  private enrichAuthorsInBackground(authors: Author[]): void {
    for (const author of authors) {
      this.openLibraryGateway
        .findAuthorEnrichment(author.name)
        .then((enrichment) => {
          if (enrichment.biography === null && enrichment.photoUrl === null) {
            return;
          }
          const updated = AuthorFactory.create(
            author.id,
            author.name,
            enrichment.biography,
            enrichment.photoUrl,
          );
          return this.authorRepository.updateByName(author.name, updated);
        })
        .catch((error: unknown) => {
          this.logger.warn(
            `Background enrichment failed for author "${author.name}": ${error instanceof Error ? error.message : String(error)}`,
          );
        });
    }
  }
}
