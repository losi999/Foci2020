import { TeamDetailsUpdateDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IUpdateMatchWithTeamService {
  (ctx: {
    teamId: string,
    team: TeamDetailsUpdateDocument
  }): Promise<void>;
}

export const updateMatchWithTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateMatchWithTeamService => {
  return async ({ team, teamId }) => {
    const matches = await matchDocumentService.queryMatchKeysByTeamId(teamId);

    await matchDocumentService.updateMatchesWithTeam(matches, team);
  };
};
