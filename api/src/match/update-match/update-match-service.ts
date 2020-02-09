import { httpError, addMinutes } from '@/shared/common';
import { IMatchDocumentService } from '@/match/match-document-service';
import { ITeamDocumentService } from '@/team/team-document-service';
import { ITournamentDocumentService } from '@/tournament/tournament-document-service';
import { IMatchDocumentConverter } from '@/match/match-document-converter';
import { MatchRequest } from '@/shared/types/types';

export interface IUpdateMatchService {
  (ctx: {
    matchId: string,
    body: MatchRequest
  }): Promise<void>;
}

export const updateMatchServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  matchDocumentConverter: IMatchDocumentConverter,
  teamDocumentService: ITeamDocumentService,
  tournamentDocumentService: ITournamentDocumentService
): IUpdateMatchService => {
  return async ({ body, matchId }) => {
    if (addMinutes(5) > new Date(body.startTime)) {
      throw httpError(400, 'Start time has to be at least 5 minutes from now');
    }

    if (body.homeTeamId === body.awayTeamId) {
      throw httpError(400, 'Home and away teams cannot be the same');
    }

    const [homeTeam, awayTeam, tournament] = await Promise.all([
      teamDocumentService.queryTeamById(body.homeTeamId),
      teamDocumentService.queryTeamById(body.awayTeamId),
      tournamentDocumentService.queryTournamentById(body.tournamentId)
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

    await matchDocumentService.updateMatch(matchId, document).catch((error) => {
      console.error('Update match', error);
      throw httpError(500, 'Error while updating match');
    });
  };
};