import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

export interface IDeleteTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  notificationService: INotificationService
): IDeleteTournamentService => {
  return async ({ tournamentId }) => {
    await tournamentDocumentService.deleteTournament(tournamentId).catch((error) => {
      console.error('Delete tournament', error);
      throw httpError(500, 'Unable to delete tournament');
    });

    await notificationService.tournamentDeleted(tournamentId).catch((error) => {
      console.error('Tournament deleted', error);
      throw httpError(500, 'Unable to send tournament deleted notification');
    });
  };
};
