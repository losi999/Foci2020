import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { IStandingDocumentConverter } from '@foci2020/shared/converters/standing-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamDocument, TournamentDocument, MatchDocument, BetDocument } from '@foci2020/shared/types/documents';
import { TeamIdType, TournamentIdType, MatchIdType, UserIdType } from '@foci2020/shared/types/common';

export interface IRelatedDocumentService {
  teamDeleted(teamId: TeamIdType): Promise<void>;
  tournamentDeleted(tournamentId: TournamentIdType): Promise<void>;
  teamUpdated(team: TeamDocument): Promise<void>;
  tournamentUpdated(tournament: TournamentDocument): Promise<void>;
  matchDeleted(matchId: MatchIdType): Promise<void>;
  matchFinalScoreUpdated(match: MatchDocument): Promise<void>;
  betResultCalculated(tournamentId: TournamentIdType, userId: UserIdType, expiresIn: number): Promise<void>;
}

export const relatedDocumentServiceFactory = (
  databaseService: IDatabaseService,
  betDocumentConverter: IBetDocumentConverter,
  standingDocumentConverter: IStandingDocumentConverter,
): IRelatedDocumentService => {
  const deleteMatchesById = async (matchIds: MatchIdType[]): Promise<unknown> => {
    return Promise.all(matchIds.map(id => databaseService.deleteMatch(id))).catch((error) => {
      console.error('Delete matches', error);
      throw error;
    });
  };

  const queryMatchIdsByTournamentId = async (tournamentId: TournamentIdType): Promise<MatchIdType[]> => {
    return (await databaseService.queryMatchesByTournamentId(tournamentId).catch((error) => {
      console.error('Query matches to delete', error, tournamentId);
      throw error;
    })).map(m => m.id);
  };

  const queryMatchIdsByTeamId = async (teamId: TeamIdType): Promise<{
    homeMatchIds: MatchIdType[],
    awayMatchIds: MatchIdType[]
  }> => {
    const [homeMatches, awayMatches] = await Promise.all([
      databaseService.queryMatchKeysByHomeTeamId(teamId),
      databaseService.queryMatchKeysByAwayTeamId(teamId),
    ]).catch((error) => {
      console.error('Query matches to delete', error, teamId);
      throw error;
    });

    return {
      homeMatchIds: homeMatches.map(m => m.id),
      awayMatchIds: awayMatches.map(m => m.id)
    };
  };

  const queryBetsOfMatch = (matchId: MatchIdType): Promise<BetDocument[]> => {
    return databaseService.queryBetsByMatchId(matchId).catch((error) => {
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
        ...homeMatchIds.map(id => databaseService.updateTeamOfMatch(id, team, 'home')),
        ...awayMatchIds.map(id => databaseService.updateTeamOfMatch(id, team, 'away'))
      ]).catch((error) => {
        console.error('Update team of matches', error);
        throw error;
      });
    },
    tournamentUpdated: async (tournament) => {
      const matchIds = await queryMatchIdsByTournamentId(tournament.id);

      await Promise.all(matchIds.map(id => databaseService.updateTournamentOfMatch(id, tournament))).catch((error) => {
        console.error('Update tournament of matches', tournament.id, error);
        throw error;
      });
    },
    matchDeleted: async (matchId) => {
      const bets = await queryBetsOfMatch(matchId);

      await Promise.all(bets.map(bet => databaseService.deleteBet(bet.userId, bet.matchId))).catch((error) => {
        console.error('Delete bets of match', matchId, error);
        throw error;
      });
    },
    matchFinalScoreUpdated: async (match) => {
      const bets = await queryBetsOfMatch(match.id);

      const betsWithResult = bets.map(bet => betDocumentConverter.calculateResult(bet, match.finalScore));

      await Promise.all(betsWithResult.map(bet => databaseService.updateBet(bet))).catch((error) => {
        console.error('Bet update with result', match.id, error);
        throw error;
      });
    },
    betResultCalculated: async (tournamentId, userId, expiresIn) => {
      const bets = await databaseService.queryBetsByTournamentIdUserId(tournamentId, userId).catch((error) => {
        console.error('Query bets by tournament and user Id', tournamentId, userId, error);
        throw error;
      });

      const standing = standingDocumentConverter.create(bets, expiresIn);

      await databaseService.saveStanding(standing).catch((error) => {
        console.error('Save standing', error);
        throw error;
      });
    }
  };
};
