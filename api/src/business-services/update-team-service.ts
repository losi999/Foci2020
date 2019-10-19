import { TeamRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';

export interface IUpdateTeamService {
  (ctx: {
    teamId: string,
    body: TeamRequest
  }): Promise<any>;
}

export const updateTeamServiceFactory = (databaseService: IDatabaseService): IUpdateTeamService => {
  return async ({ body, teamId }) => {
    try {
      await databaseService.updateTeam({
        'documentType-id': `team-${teamId}`,
        segment: 'details'
      }, body);
    } catch (error) {
      console.log('ERROR databaseService.updateTeam', error);
      throw httpError(500, 'Error while updating team');
    }
  };
};
