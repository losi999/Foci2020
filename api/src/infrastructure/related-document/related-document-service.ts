import { TeamDocument, TournamentDocument } from '@/shared/types/types';
import { IMatchDocumentService } from '@/match/match-document-service';
import { IBetDocumentService } from '@/match/bet-document-service';

export interface IRelatedDocumentService {
  teamDeleted(teamId: string): Promise<void>;
  tournamentDeleted(tournamentId: string): Promise<void>;
  teamUpdated(team: TeamDocument): Promise<void>;
  tournamentUpdated(tournament: TournamentDocument): Promise<void>;
  matchDeleted(matchId: string): Promise<void>;
}

export const relatedDocumentServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  betDocumentService: IBetDocumentService
): IRelatedDocumentService => {
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
    teamDeleted: async (teamId) => {
      const { homeMatchIds, awayMatchIds } = await queryMatchIdsByTeamId(teamId);

      await Promise.all([
        deleteMatchesById(homeMatchIds),
        deleteMatchesById(awayMatchIds)
      ]);
    },
    tournamentDeleted: async (tournamentId) => {
      const matchIds = await queryMatchIdsByTournamentId(tournamentId);

      await deleteMatchesById(matchIds);
    },
    teamUpdated: async (team) => {
      const { homeMatchIds, awayMatchIds } = await queryMatchIdsByTeamId(team.id);

      await Promise.all([
        ...homeMatchIds.map(id => matchDocumentService.updateTeamOfMatch(id, team, 'home')),
        ...awayMatchIds.map(id => matchDocumentService.updateTeamOfMatch(id, team, 'away'))
      ]).catch((error) => {
        console.error('Update team of matches', error);
        throw error;
      });
    },
    tournamentUpdated: async (tournament) => {
      const matchIds = await queryMatchIdsByTournamentId(tournament.id);

      await Promise.all(matchIds.map(id => matchDocumentService.updateTournamentOfMatch(id, tournament))).catch((error) => {
        console.error('Update tournament of matches', tournament.id, error);
        throw error;
      });
    },
    matchDeleted: async (matchId) => {
      const bets = await betDocumentService.queryBetsByMatchId(matchId);

      await Promise.all(bets.map(bet => betDocumentService.deleteBet(bet.id))).catch((error) => {
        console.error('Delete bets of match', matchId, error);
        throw error;
      });
    }
  };
};
