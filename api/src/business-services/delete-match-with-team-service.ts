import { IMatchDocumentService } from '@/services/match-document-service';
import { DocumentKey } from '@/types/documents';

export interface IDeleteMatchWithTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteMatchWithTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IDeleteMatchWithTeamService => {
  return async ({ teamId }) => {
    const matches = await Promise.all([
      matchDocumentService.queryMatchKeysByHomeTeamId(teamId),
      matchDocumentService.queryMatchKeysByAwayTeamId(teamId),
    ]);

    await Promise.all(matches.flat<DocumentKey>().map(m => matchDocumentService.deleteMatch(m.id).catch((error) => {
      console.log('DELETE MATCH ERROR', error, m.id);
      // TODO write to SQS?
    })));
  };
};
