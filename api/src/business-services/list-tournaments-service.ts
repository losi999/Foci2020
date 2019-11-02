import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

export interface IListTournamentsService {
  (): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IListTournamentsService => {
  return async () => {
    const tournaments = await databaseService.queryTournaments().catch((error) => {
      console.log('ERROR databaseService.queryTournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournamentDocumentConverte.createResponseList(tournaments);
  };
};
