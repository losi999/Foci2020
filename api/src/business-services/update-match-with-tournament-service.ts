import { TournamentDocument, IndexByTournamentIdDocument } from '@/types/documents';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateMatchWithTournamentService {
  (ctx: {
    tournament: TournamentDocument
  }): Promise<any>;
}

export const updateMatchWithTournamentServiceFactory = (databaseService: IDatabaseService): IUpdateMatchWithTournamentService => {
  return async ({ tournament }) => {
    let matches: IndexByTournamentIdDocument[];
    try {
      matches = await databaseService.queryMatchKeysByTournamentId(tournament.tournamentId);
    } catch (error) {
      console.log('Unable to get matches by tournament', tournament.tournamentId, error);
      return;
    }
    try {
      return databaseService.updateMatchesWithTournament(matches, tournament);
    } catch (error) {
      console.log('Unable to update match', error);
      return;
    }
  };
};
