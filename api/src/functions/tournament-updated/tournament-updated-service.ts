import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentUpdatedEvent } from '@foci2020/shared/types/events';

export interface ITournamentUpdatedService {
  (ctx: TournamentUpdatedEvent): Promise<void>;
}

export const tournamentUpdatedServiceFactory = (databaseService: IDatabaseService): ITournamentUpdatedService => {
  return async ({ tournament }) => {
    const matches = await databaseService.queryMatchesByTournamentId(tournament.id).catch((error) => {
      console.error('Query matches to update', error, tournament.id);
      throw error;
    });

    await Promise.all(matches.map(({ 'documentType-id': key }) => databaseService.updateTournamentOfMatch(key, tournament))).catch((error) => {
      console.error('Update tournament of matches', tournament.id, error);
      throw error;
    });
  };
};
