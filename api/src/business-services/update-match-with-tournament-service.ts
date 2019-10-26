import { TournamentUpdateDocument } from '@/types/documents';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateMatchWithTournamentService {
  (ctx: {
    tournamentId: string;
    tournament: TournamentUpdateDocument
  }): Promise<void>;
}

export const updateMatchWithTournamentServiceFactory = (databaseService: IDatabaseService): IUpdateMatchWithTournamentService => {
  return async ({ tournament, tournamentId }) => {
    const matches = await databaseService.queryMatchKeysByTournamentId(tournamentId);

    await databaseService.updateMatchesWithTournament(matches, tournament);
  };
};
