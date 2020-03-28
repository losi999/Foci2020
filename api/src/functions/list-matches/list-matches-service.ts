import { httpError } from '@/common';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IListMatchesService {
  (): Promise<MatchResponse[]>;
}

export const listMatchesServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter,
): IListMatchesService => {
  return async () => {
    const matches = await databaseService.listMatches().catch((error) => {
      console.error('List matches', error);
      throw httpError(500, 'Unable to list matches');
    });

    return matchDocumentConverter.toResponseList(matches);
  };
};
