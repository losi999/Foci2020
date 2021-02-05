import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamUpdatedEvent } from '@foci2020/shared/types/events';

export interface ITeamUpdatedService {
  (ctx: TeamUpdatedEvent): Promise<void>;
}

export const teamUpdatedServiceFactory = (databaseService: IDatabaseService): ITeamUpdatedService => {
  return async ({ team }) => {
    const [homeMatches, awayMatches] = await Promise.all([
      databaseService.queryMatchKeysByHomeTeamId(team.id),
      databaseService.queryMatchKeysByAwayTeamId(team.id),
    ]).catch((error) => {
      console.error('Query matches to update', error, team.id);
      throw error;
    });

    await Promise.all([
      ...homeMatches.map(({ 'documentType-id': key }) => databaseService.updateTeamOfMatch(key, team, 'home')),
      ...awayMatches.map(({ 'documentType-id': key }) => databaseService.updateTeamOfMatch(key, team, 'away'))
    ]).catch((error) => {
      console.error('Update team of matches', error);
      throw error;
    });
  };
};
