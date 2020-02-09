import { IMatchDocumentService } from '@/services/match-document-service';
import { TeamDocument } from '@/types/types';

export interface IUpdateTeamOfMatchesService {
  (ctx: {
    teamId: string,
    team: TeamDocument,
  }): Promise<void>;
}

export const updateTeamOfMatchesServiceFactory = (matchDocumentService: IMatchDocumentService) => {
  const updateTeamOfMatches = (matchIds: string[], team: TeamDocument, type: 'home' | 'away') => {
    return matchDocumentService.updateTeamOfMatches(matchIds, team, type).catch((error) => {
      console.error('Update team of matches', error);
      throw error;
    });
  };

  return {
    home: (): IUpdateTeamOfMatchesService =>
      async ({ teamId, team }) => {
        const matchIds = (await matchDocumentService.queryMatchKeysByHomeTeamId(teamId).catch((error) => {
          console.error('Query matches by home team', teamId, error);
          throw error;
        })).map(m => m.id);

        await updateTeamOfMatches(matchIds, team, 'home');
      },
    away: (): IUpdateTeamOfMatchesService =>
      async ({ teamId, team }) => {
        const matchIds = (await matchDocumentService.queryMatchKeysByAwayTeamId(teamId).catch((error) => {
          console.error('Query matches by away team', teamId, error);
          throw error;
        })).map(m => m.id);

        await updateTeamOfMatches(matchIds, team, 'away');
      },
  };
};
