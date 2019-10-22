import { TournamentDocument, IndexByTournamentIdDocument } from '@/types/documents';
import { IDatabaseService } from '@/services/database-service';

export interface IDeleteMatchWithTournamentService {
  (ctx: {
    tournament: TournamentDocument
  }): Promise<void>;
}

export const deleteMatchWithTournamentServiceFactory = (databaseService: IDatabaseService): IDeleteMatchWithTournamentService => {
  return async ({ tournament }) => {
    let matches: IndexByTournamentIdDocument[];
    try {
      matches = await databaseService.queryMatchKeysByTournamentId(tournament.tournamentId);
    } catch (error) {
      console.log('Unable to get matches by tournament', tournament.tournamentId, error);
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
