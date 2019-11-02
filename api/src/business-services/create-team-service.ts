import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
import { httpError } from '@/common';
import { TeamRequest } from '@/types/requests';

export interface ICreateTeamService {
  (ctx: {
    body: TeamRequest
  }): Promise<void>;
}

export const createTeamServiceFactory = (databaseService: IDatabaseService, uuid: v4String): ICreateTeamService => {
  return async ({ body }) => {
    const teamId = uuid();
    try {
      await databaseService.saveTeam(teamId, body);
    } catch (error) {
      console.log('ERROR databaseService.saveTeam', error);
      throw httpError(500, 'Error while saving team');
    }
  };
};
