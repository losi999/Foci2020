import { httpError } from '@/common';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IListMatchesService {
  (ctx: { tournamentId: string }): Promise<MatchResponse[]>;
}

export const listMatchesServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  matchDocumentConverter: IMatchDocumentConverter,
): IListMatchesService => {
  return async ({ tournamentId }) => {
    const matches = await matchDocumentService.queryMatches(tournamentId).catch((error) => {
      console.error('Query matches', error);
      throw httpError(500, 'Unable to query matches');
    });

    return matchDocumentConverter.toResponseList(matches);
  };
};
