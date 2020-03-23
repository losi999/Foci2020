import { httpError, addMinutes } from '@/common';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchRequest } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateMatchService {
  (ctx: {
    matchId: string,
    body: MatchRequest
  }): Promise<void>;
}

export const updateMatchServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter
): IUpdateMatchService => {
  return async ({ body, matchId }) => {
    if (addMinutes(5) > new Date(body.startTime)) {
      throw httpError(400, 'Start time has to be at least 5 minutes from now');
    }

    if (body.homeTeamId === body.awayTeamId) {
      throw httpError(400, 'Home and away teams cannot be the same');
    }

    const [homeTeam, awayTeam, tournament] = await Promise.all([
      databaseService.getTeamById(body.homeTeamId),
      databaseService.getTeamById(body.awayTeamId),
      databaseService.getTournamentById(body.tournamentId)
    ]).catch((error) => {
      console.error('Query related documents', error);
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

    const document = matchDocumentConverter.update(matchId, body, homeTeam, awayTeam, tournament);

    await databaseService.updateMatch(document).catch((error) => {
      console.error('Update match', error);
      throw httpError(500, 'Error while updating match');
    });
  };
};
