import { IMatchDocumentService } from '@/services/match-document-service';
import { DocumentKey } from '@/types/documents';

export interface IDeleteMatchesByTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteMatchesByTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IDeleteMatchesByTeamService => {
  return async ({ teamId }) => {
    const matches = await Promise.all([
      matchDocumentService.queryMatchKeysByHomeTeamId(teamId),
      matchDocumentService.queryMatchKeysByAwayTeamId(teamId),
    ]).catch((error) => {
      console.error('Query matches to delete', error, teamId);
      throw error;
    });

    const matchIds = matches.flat<DocumentKey>().map(m => m.id);
    await matchDocumentService.deleteMatches(matchIds).catch((error) => {
      console.error('Delete matches', error);
      throw error;
    });
  };
};
