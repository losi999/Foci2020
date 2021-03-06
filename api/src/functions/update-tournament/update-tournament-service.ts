import { httpError } from '@foci2020/shared/common/utils';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TournamentIdType } from '@foci2020/shared/types/common';

export interface IUpdateTournamentService {
  (ctx: {
    tournamentId: TournamentIdType;
    body: TournamentRequest;
    expiresIn: number;
  }): Promise<void>;
}

export const updateTournamentServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverter: ITournamentDocumentConverter
): IUpdateTournamentService => {
  return async ({ body, tournamentId, expiresIn }) => {
    const document = tournamentDocumentConverter.update(tournamentId, body, expiresIn);

    await databaseService.updateTournament(document).catch((error) => {
      console.error('Update tournament', error);
      if (error.code === 'ConditionalCheckFailedException') {
        throw httpError(404, 'No tournament found');
      }
      throw httpError(500, 'Error while updating tournament');
    });
  };
};
