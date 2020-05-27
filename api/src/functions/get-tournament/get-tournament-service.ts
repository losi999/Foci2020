import { httpError } from '@foci2020/shared/common/utils';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentResponse } from '@foci2020/shared/types/responses';

export interface IGetTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<TournamentResponse>;
}

export const getTournamentServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IGetTournamentService => {
  return async ({ tournamentId }) => {
    const tournament = await databaseService.getTournamentById(tournamentId).catch((error) => {
      console.error('Query tournament by Id', error);
      throw httpError(500, 'Unable to query tournament');
    });

    if (!tournament) {
      throw httpError(404, 'No tournament found');
    }

    return tournamentDocumentConverte.toResponse(tournament);
  };
};
