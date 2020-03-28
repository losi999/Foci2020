import { httpError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IListTournamentsService {
  (): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IListTournamentsService => {
  return async () => {
    const tournaments = await databaseService.listTournaments().catch((error) => {
      console.error('Query tournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournamentDocumentConverte.toResponseList(tournaments);
  };
};
