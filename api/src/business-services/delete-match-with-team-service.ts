import { IMatchDocumentService } from '@/services/match-document-service';

export interface IDeleteMatchWithTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteMatchWithTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IDeleteMatchWithTeamService => {
  return async ({ teamId }) => {
    const matches = await matchDocumentService.queryMatchKeysByTeamId(teamId);

    await Promise.all(matches.map(m => matchDocumentService.deleteMatch(m.matchId)));
  };
};
