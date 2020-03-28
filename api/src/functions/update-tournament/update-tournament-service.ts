import { httpError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentRequest } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateTournamentService {
  (ctx: {
    tournamentId: string,
    body: TournamentRequest
  }): Promise<void>;
}

export const updateTournamentServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverter: ITournamentDocumentConverter
): IUpdateTournamentService => {
  return async ({ body, tournamentId }) => {
    const document = tournamentDocumentConverter.update(tournamentId, body);

    await databaseService.updateTournament(document).catch((error) => {
      console.error('Update tournament', error);
      throw httpError(500, 'Error while updating tournament');
    });
  };
};
