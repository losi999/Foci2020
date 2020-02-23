import { TeamDocument, TournamentDocument } from '@/shared/types/types';
import { IMatchDocumentService } from '@/match/match-document-service';

export interface IMatchRelatedDocumentService {
  deleteMatchByTeam(teamId: string): Promise<void>;
  deleteMatchByTournament(tournamentId: string): Promise<void>;
  updateTeamOfMatch(team: TeamDocument): Promise<void>;
  updateTournamentOfMatch(tournament: TournamentDocument): Promise<void>;
}

export const matchRelatedDocumentServiceFactory = (matchDocumentService: IMatchDocumentService): IMatchRelatedDocumentService => {
  const deleteMatchesById = async (matchIds: string[]): Promise<unknown> => {
    return Promise.all(matchIds.map(id => matchDocumentService.deleteMatch(id))).catch((error) => {
      console.error('Delete matches', error);
      throw error;
    });
  };

  const queryMatchIdsByTournamentId = async (tournamentId: string): Promise<string[]> => {
    return (await matchDocumentService.queryMatchKeysByTournamentId(tournamentId).catch((error) => {
      console.error('Query matches to delete', error, tournamentId);
      throw error;
    })).map(m => m.id);
  };

  const queryMatchIdsByTeamId = async (teamId: string): Promise<{
    homeMatchIds: string[],
    awayMatchIds: string[]
  }> => {
    const [homeMatches, awayMatches] = await Promise.all([
      matchDocumentService.queryMatchKeysByHomeTeamId(teamId),
      matchDocumentService.queryMatchKeysByAwayTeamId(teamId),
    ]).catch((error) => {
      console.error('Query matches to delete', error, teamId);
      throw error;
    });

    return {
      homeMatchIds: homeMatches.map(m => m.id),
      awayMatchIds: awayMatches.map(m => m.id)
    };
  };

  return {
    deleteMatchByTeam: async (teamId) => {
      const { homeMatchIds, awayMatchIds } = await queryMatchIdsByTeamId(teamId);

      await Promise.all([
        deleteMatchesById(homeMatchIds),
        deleteMatchesById(awayMatchIds)
      ]);
    },
    deleteMatchByTournament: async (tournamentId) => {
      const matchIds = await queryMatchIdsByTournamentId(tournamentId);

      await deleteMatchesById(matchIds);
    },
    updateTeamOfMatch: async (team) => {
      const { homeMatchIds, awayMatchIds } = await queryMatchIdsByTeamId(team.id);

      await Promise.all([
        ...homeMatchIds.map(id => matchDocumentService.updateTeamOfMatch(id, team, 'home')),
        ...awayMatchIds.map(id => matchDocumentService.updateTeamOfMatch(id, team, 'away'))
      ]).catch((error) => {
        console.error('Update team of matches', error);
        throw error;
      });
    },
    updateTournamentOfMatch: async (tournament) => {
      const matchIds = await queryMatchIdsByTournamentId(tournament.id);

      await Promise.all(matchIds.map(id => matchDocumentService.updateTournamentOfMatch(id, tournament))).catch((error) => {
        console.error('Update tournament of matches', tournament.id, error);
        throw error;
      });
    }
  };
};
