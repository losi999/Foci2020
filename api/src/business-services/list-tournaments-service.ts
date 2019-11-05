import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

export interface IListTournamentsService {
  (): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IListTournamentsService => {
  return async () => {
    const tournaments = await tournamentDocumentService.queryTournaments().catch((error) => {
      console.log('ERROR databaseService.queryTournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournamentDocumentConverte.createResponseList(tournaments);
  };
};
