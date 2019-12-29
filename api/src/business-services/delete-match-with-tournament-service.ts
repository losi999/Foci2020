import { IMatchDocumentService } from '@/services/match-document-service';

export interface IDeleteMatchWithTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteMatchWithTournamentServiceFactory = (matchDocumentService: IMatchDocumentService): IDeleteMatchWithTournamentService => {
  return async ({ tournamentId }) => {
    let matches;
    try {
      matches = await matchDocumentService.queryMatchKeysByTournamentId(tournamentId);
    } catch (error) {
      console.log('QUERY MATCHES TO DELETE ERROR', error, tournamentId);
      return;
    }

    await Promise.all(matches.map(m => matchDocumentService.deleteMatch(m.id).catch((error) => {
      console.log('DELETE MATCH ERROR', error, m.id);
      // TODO write to SQS?
    })));
  };
};
