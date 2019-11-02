import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';

export interface IListMatchesService {
  (ctx: { tournamentId: string }): Promise<MatchResponse[]>;
}

export const listMatchesServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter,
): IListMatchesService => {
  return async ({ tournamentId }) => {
    // TODO by tournamentId
    const matches = await databaseService.queryMatches(tournamentId).catch((error) => {
      console.log('ERROR databaseService.queryMatches', error);
      throw httpError(500, 'Unable to query matches');
    });

    return matchDocumentConverter.createResponseList(matches);
  };
};
