import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { httpError } from '@foci2020/shared/common/utils';
import { IStandingDocumentConverter } from '@foci2020/shared/converters/standing-document-converter';
import { StandingResponse } from '@foci2020/shared/types/responses';
import { TournamentIdType } from '@foci2020/shared/types/common';

export interface IListStandingsOfTournament {
  (ctx: {
    tournamentId: TournamentIdType
  }): Promise<StandingResponse[]>;
}

export const listStandingsOfTournamentFactory = (databaseService: IDatabaseService, standingDocumentConverter: IStandingDocumentConverter): IListStandingsOfTournament =>
  async ({ tournamentId }) => {
    const tournament = await databaseService.getTournamentById(tournamentId).catch((error) => {
      console.error('Query tournament by Id', {
        tournamentId, 
      }, error);
      throw httpError(500, 'Unable to query tournament');
    });

    if (!tournament) {
      throw httpError(400, 'Tournament does not exist');
    }

    const documents = await databaseService.queryStandingsByTournamentId(tournamentId).catch((error) => {
      console.error('Unable to query standings of tournament', {
        tournamentId, 
      }, error);
      throw httpError(500, 'Unable to query standings of tournament');
    });

    return standingDocumentConverter.toResponseList(documents);
  };
