import { httpError } from '@foci2020/shared/common/utils';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { TournamentIdType } from '@foci2020/shared/types/common';

export interface IListMatchesOfTournamentService {
  (ctx: { tournamentId: TournamentIdType }): Promise<MatchResponse[]>;
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
