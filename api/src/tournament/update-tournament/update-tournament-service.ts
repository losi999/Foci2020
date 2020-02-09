import { httpError } from '@/shared/common';
import { INotificationService } from '@/shared/services/notification-service';
import { ITournamentDocumentService } from '@/tournament/tournament-document-service';
import { ITournamentDocumentConverter } from '@/tournament/tournament-document-converter';
import { TournamentRequest } from '@/shared/types/types';

export interface IUpdateTournamentService {
  (ctx: {
    tournamentId: string,
    body: TournamentRequest
  }): Promise<void>;
}

export const updateTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverter: ITournamentDocumentConverter,
  notificationService: INotificationService
): IUpdateTournamentService => {
  return async ({ body, tournamentId }) => {
    const document = tournamentDocumentConverter.update(tournamentId, body);

    await tournamentDocumentService.updateTournament(tournamentId, document).catch((error) => {
      console.error('Update tournament', error);
      throw httpError(500, 'Error while updating tournament');
    });

    await notificationService.tournamentUpdated({
      tournamentId,
      tournament: document
    }).catch((error) => {
      console.error('Tournament updated', error);
      throw httpError(500, 'Unable to send tournament updated notification');
    });
  };
};
