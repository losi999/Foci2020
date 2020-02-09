import { httpError } from '@/shared/common';
import { IMatchDocumentConverter } from '@/match/match-document-converter';
import { IMatchDocumentService } from '@/match/match-document-service';
import { MatchResponse } from '@/shared/types/types';

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
