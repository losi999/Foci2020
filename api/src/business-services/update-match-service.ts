import { IDatabaseService } from '@/services/database-service';
import { httpError, addMinutes } from '@/common';
import { MatchRequest } from '@/types/requests';

export interface IUpdateMatchService {
  (ctx: {
    matchId: string,
    body: MatchRequest
  }): Promise<void>;
}

export const updateMatchServiceFactory = (databaseService: IDatabaseService): IUpdateMatchService => {
  return async ({ body, matchId }) => {
    if (addMinutes(5) > new Date(body.startTime)) {
      throw httpError(400, 'Start time has to be at least 5 minutes from now');
    }

    if (body.homeTeamId === body.awayTeamId) {
      throw httpError(400, 'Home and away teams cannot be the same');
    }

    const [homeTeam, awayTeam, tournament] = await Promise.all([
      databaseService.queryTeamById(body.homeTeamId),
      databaseService.queryTeamById(body.awayTeamId),
      databaseService.queryTournamentById(body.tournamentId)
    ]).catch((error) => {
      console.log('ERROR query', error);
      throw httpError(500, 'Unable to query related document');
    });

    if (!homeTeam) {
      throw httpError(400, 'Home team not found');
    }

    if (!awayTeam) {
      throw httpError(400, 'Away team not found');
    }

    if (!tournament) {
      throw httpError(400, 'Tournament not found');
    }

    try {
      await databaseService.updateMatch(matchId, body, homeTeam, awayTeam, tournament);
    } catch (error) {
      console.log('ERROR databaseService.updateMatch', error);
      throw httpError(500, 'Error while updating match');
    }
  };
};
