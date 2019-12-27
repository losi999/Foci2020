import { TournamentDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IUpdateMatchWithTournamentService {
  (ctx: {
    tournamentId: string;
    tournament: TournamentDocument
  }): Promise<void>;
}

export const updateMatchWithTournamentServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateMatchWithTournamentService => {
  return async ({ tournament, tournamentId }) => {
    const matches = await matchDocumentService.queryMatchKeysByTournamentId(tournamentId);

    await Promise.all(matches.map(m => matchDocumentService.updateMatchWithTournament(m.id, tournament).catch((error) => {
      console.log('UPDATE MATCH ERROR', error, m.id);
      // TODO write to SQS?
    })));
  };
};
