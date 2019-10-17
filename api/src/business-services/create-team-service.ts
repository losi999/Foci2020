import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
import { httpError } from '@/common';
import { TeamRequest } from '@/types/requests';

export interface ICreateTeamService {
  (ctx: {
    body: TeamRequest
  }): Promise<any>;
}

export const createTeamServiceFactory = (databaseService: IDatabaseService, uuid: v4String): ICreateTeamService => {
  return async ({ body }) => {
    try {
      const teamId = uuid();
      await databaseService.saveTeam({
        ...body,
        teamId,
        documentType: 'team',
        'documentType-id': `team-${teamId}`,
        segment: 'details',
        orderingValue: body.teamName
      });
    } catch (error) {
      console.log('ERROR databaseService.saveTeam', error);
      throw httpError(500, 'Error while saving team');
    }
  };
};
