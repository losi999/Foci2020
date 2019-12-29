import { IMatchDocumentService } from '@/services/match-document-service';
import { DocumentKey } from '@/types/documents';

export interface IDeleteMatchWithTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteMatchWithTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IDeleteMatchWithTeamService => {
  return async ({ teamId }) => {
    let matches;
    try {
      matches = await Promise.all([
        matchDocumentService.queryMatchKeysByHomeTeamId(teamId),
        matchDocumentService.queryMatchKeysByAwayTeamId(teamId),
      ]);
    } catch (error) {
      console.log('QUERY MATCHES TO DELETE ERROR', error, teamId);
      return;
    }

    await Promise.all(matches.flat<DocumentKey>().map(m => matchDocumentService.deleteMatch(m.id).catch((error) => {
      console.log('DELETE MATCH ERROR', error, m.id);
      // TODO write to SQS?
    })));
  };
};
