import { v4String } from 'uuid/interfaces';
import { httpError, addMinutes } from '@/common';
import { MatchRequest } from '@/types/requests';
import { IMatchDocumentService } from '@/services/match-document-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

export interface ICreateMatchService {
  (ctx: {
    body: MatchRequest
  }): Promise<void>;
}

export const createMatchServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  teamDocumentService: ITeamDocumentService,
  tournamentDocumentService: ITournamentDocumentService,
  uuid: v4String
): ICreateMatchService => {
  return async ({ body }) => {
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
      await matchDocumentService.saveMatch(matchId, body, homeTeam, awayTeam, tournament);
    } catch (error) {
      console.log('ERROR databaseService.saveMatch', error);
      throw httpError(500, 'Error while saving match');
    }
  };
};
