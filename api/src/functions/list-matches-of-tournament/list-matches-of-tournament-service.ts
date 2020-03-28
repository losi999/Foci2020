import { httpError } from '@/common';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IListMatchesOfTournamentService {
  (ctx: { tournamentId: string }): Promise<MatchResponse[]>;
}

export const listMatchesOfTournamentServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter,
): IListMatchesOfTournamentService => {
  return async ({ tournamentId }) => {
    const matches = await databaseService.queryMatchesByTournamentId(tournamentId).catch((error) => {
      console.error('Query matches', error);
      throw httpError(500, 'Unable to query matches');
    });

    return matchDocumentConverter.toResponseList(matches);
  };
};
