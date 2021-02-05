import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentDeletedEvent } from '@foci2020/shared/types/events';

export interface ITournamentDeletedService {
  (ctx: TournamentDeletedEvent): Promise<void>;
}

export const tournamentDeletedServiceFactory = (databaseService: IDatabaseService): ITournamentDeletedService => {
  return async ({ tournamentId }) => {
    const matches = await databaseService.queryMatchesByTournamentId(tournamentId).catch((error) => {
      console.error('Query matches to delete', error, tournamentId);
      throw error;
    });

    const matchKeys = matches.flat().map(m => m['documentType-id']);

    await databaseService.deleteDocuments(matchKeys);
  };
};
