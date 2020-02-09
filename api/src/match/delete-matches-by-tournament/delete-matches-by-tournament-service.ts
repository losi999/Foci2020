import { IMatchDocumentService } from '@/match/match-document-service';

export interface IDeleteMatchesByTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteMatchesByTournamentServiceFactory = (matchDocumentService: IMatchDocumentService): IDeleteMatchesByTournamentService => {
  return async ({ tournamentId }) => {
    const matchIds = (await matchDocumentService.queryMatchKeysByTournamentId(tournamentId).catch((error) => {
      console.error('Query matches to delete', error, tournamentId);
      throw error;
    })).map(m => m.id);

    await matchDocumentService.deleteMatches(matchIds).catch((error) => {
      console.error('Delete matches', error);
      throw error;
    });
  };
};
