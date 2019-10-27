import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';

export interface IDeleteTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteTournamentServiceFactory = (
  databaseService: IDatabaseService,
  notificationService: INotificationService
): IDeleteTournamentService => {
  return async ({ tournamentId }) => {
    await databaseService.deleteTournament(tournamentId).catch((error) => {
      console.log('ERROR databaseService.deleteTournament', error);
      throw httpError(500, 'Unable to delete tournament');
    });

    await notificationService.tournamentDeleted(tournamentId).catch((error) => {
      console.log('ERROR notificationService.tournamentDeleted', error);
      throw httpError(500, 'Unable to send tournament deleted notification');
    });
  };
};
