import { StandingResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { IStandingDocumentConverter } from '@/converters/standing-document-converter';

export interface IListStandingsOfTournament {
  (ctx: {
    tournamentId: string
  }): Promise<StandingResponse[]>;
}

export const listStandingsOfTournamentFactory = (databaseService: IDatabaseService, standingDocumentConverter: IStandingDocumentConverter): IListStandingsOfTournament =>
  async ({ tournamentId }) => {
    const tournament = await databaseService.getTournamentById(tournamentId).catch((error) => {
      console.error('Query tournament by Id', { tournamentId }, error);
      throw httpError(500, 'Unable to query tournament');
    });

    if (!tournament) {
      throw httpError(400, 'Tournament does not exist');
    }

    const documents = await databaseService.queryStandingsByTournamentId(tournamentId).catch((error) => {
      console.error('Unable to query standings of tournament', { tournamentId }, error);
      throw httpError(500, 'Unable to query standings of tournament');
    });

    return standingDocumentConverter.toResponseList(documents);
  };
