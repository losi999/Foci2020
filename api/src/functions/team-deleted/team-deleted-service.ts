import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamDeletedEvent } from '@foci2020/shared/types/events';

export interface ITeamDeletedService {
  (ctx: TeamDeletedEvent): Promise<void>;
}

export const teamDeletedServiceFactory = (databaseService: IDatabaseService): ITeamDeletedService => {
  return async ({ teamId }) => {
    const matches = await Promise.all([
      databaseService.queryMatchKeysByHomeTeamId(teamId),
      databaseService.queryMatchKeysByAwayTeamId(teamId),
    ]).catch((error) => {
      console.error('Query matches to delete', error, teamId);
      throw error;
    });

    const matchKeys = matches.flat().map(m => m['documentType-id']);

    await databaseService.deleteDocuments(matchKeys);
  };
};
