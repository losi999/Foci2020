import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
import { httpError, addMinutes } from '@/common';
import { MatchRequest } from '@/types/requests';

export interface ICreateMatchService {
  (ctx: {
    body: MatchRequest
  }): Promise<void>;
}

export const createMatchServiceFactory = (databaseService: IDatabaseService, uuid: v4String): ICreateMatchService => {
  return async ({ body }) => {
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

    const matchId = uuid();
    try {
      await databaseService.saveMatch(matchId, body, homeTeam, awayTeam, tournament);
    } catch (error) {
      console.log('ERROR databaseService.saveMatch', error);
      throw httpError(500, 'Error while saving match');
    }
  };
};
