import { httpError } from '@/shared/common';
import { ITournamentDocumentConverter } from '@/tournament/tournament-document-converter';
import { ITournamentDocumentService } from '@/tournament/tournament-document-service';
import { TournamentResponse } from '@/shared/types/types';

export interface IListTournamentsService {
  (): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IListTournamentsService => {
  return async () => {
    const tournaments = await tournamentDocumentService.queryTournaments().catch((error) => {
      console.error('Query tournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournamentDocumentConverte.toResponseList(tournaments);
  };
};
