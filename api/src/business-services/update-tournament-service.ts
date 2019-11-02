import { TournamentRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';

export interface IUpdateTournamentService {
  (ctx: {
    tournamentId: string,
    body: TournamentRequest
  }): Promise<void>;
}

export const updateTournamentServiceFactory = (databaseService: IDatabaseService, notificationService: INotificationService): IUpdateTournamentService => {
  return async ({ body, tournamentId }) => {
    await databaseService.updateTournament(tournamentId, body).catch((error) => {
      console.log('ERROR databaseService.updateTournament', error);
      throw httpError(500, 'Error while updating tournament');
    });

    await notificationService.tournamentUpdated({
      tournamentId,
      tournament: body
    }).catch((error) => {
      console.log('ERROR notificationService.tournamentUpdated', error);
      throw httpError(500, 'Unable to send tournament updated notification');
    });
  };
};
