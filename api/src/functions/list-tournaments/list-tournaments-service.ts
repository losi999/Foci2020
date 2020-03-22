import { httpError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { TournamentResponse } from '@/types/types';

export interface IListTournamentsService {
  (): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IListTournamentsService => {
  return async () => {
    const tournaments = await tournamentDocumentService.listTournaments().catch((error) => {
      console.error('Query tournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournamentDocumentConverte.toResponseList(tournaments);
  };
};
