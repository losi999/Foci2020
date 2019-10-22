import { TeamDocument, IndexByTeamIdDocument } from '@/types/documents';
import { IDatabaseService } from '@/services/database-service';

export interface IDeleteMatchWithTeamService {
  (ctx: {
    team: TeamDocument
  }): Promise<void>;
}

export const deleteMatchWithTeamServiceFactory = (databaseService: IDatabaseService): IDeleteMatchWithTeamService => {
  return async ({ team }) => {
    let matches: IndexByTeamIdDocument[];
    try {
      matches = await databaseService.queryMatchKeysByTeamId(team.teamId);
    } catch (error) {
      console.log('Unable to get matches by team', team.teamId, error);
      return;
    }
    try {
      await Promise.all(matches.map(m => databaseService.deleteMatch(m.matchId)));
    } catch (error) {
      console.log('Unable to delete match', error);
      return;
    }
  };
};
