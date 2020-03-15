import { TeamDocument, TournamentDocument, MatchDocument, BetDocument } from '@/types/types';
import { IMatchDocumentService } from '@/services/match-document-service';
import { IBetDocumentService } from '@/services/bet-document-service';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { IStandingDocumentConverter } from '@/converters/standing-document-converter';
import { IStandingDocumentService } from '@/services/standing-document-service';

export interface IRelatedDocumentService {
  teamDeleted(teamId: string): Promise<void>;
  tournamentDeleted(tournamentId: string): Promise<void>;
  teamUpdated(team: TeamDocument): Promise<void>;
  tournamentUpdated(tournament: TournamentDocument): Promise<void>;
  matchDeleted(matchId: string): Promise<void>;
  matchFinalScoreUpdated(match: MatchDocument): Promise<void>;
  betResultCalculated(tournamentIdUserId: string): Promise<void>;
}

export const relatedDocumentServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  betDocumentService: IBetDocumentService,
  betDocumentConverter: IBetDocumentConverter,
  standingDocumentConverter: IStandingDocumentConverter,
  standingDocumentService: IStandingDocumentService
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

  const queryBetsOfMatch = (matchId: string): Promise<BetDocument[]> => {
    return betDocumentService.queryBetsByMatchId(matchId).catch((error) => {
      console.error('Query bets of match', matchId, error);
      throw error;
    });
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
      const bets = await queryBetsOfMatch(matchId);

      await Promise.all(bets.map(bet => betDocumentService.deleteBet(bet.id))).catch((error) => {
        console.error('Delete bets of match', matchId, error);
        throw error;
      });
    },
    matchFinalScoreUpdated: async (match) => {
      const bets = await queryBetsOfMatch(match.id);

      const betsWithResult = bets.map(bet => betDocumentConverter.calculateResult(bet, match.finalScore));

      await Promise.all(betsWithResult.map(bet => betDocumentService.updateBet(bet))).catch((error) => {
        console.error('Bet update with result', match.id, error);
        throw error;
      });
    },
    betResultCalculated: async (tournamentIdUserId) => {
      const bets = await betDocumentService.queryBetsByTournamentIdUserId(tournamentIdUserId).catch((error) => {
        console.error('Query bets by tournament and user Id', tournamentIdUserId, error);
        throw error;
      });

      const standing = standingDocumentConverter.create(bets);

      await standingDocumentService.saveStanding(standing).catch((error) => {
        console.error('Save standing', error);
        throw error;
      });
    }
  };
};