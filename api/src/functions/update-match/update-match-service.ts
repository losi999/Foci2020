import { httpError, addMinutes } from '@foci2020/shared/common/utils';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { MatchIdType } from '@foci2020/shared/types/common';

export interface IUpdateMatchService {
  (ctx: {
    matchId: MatchIdType;
    body: MatchRequest;
    expiresIn: number;
  }): Promise<void>;
}

export const updateMatchServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter
): IUpdateMatchService => {
  return async ({ body, matchId, expiresIn }) => {
    if (addMinutes(5) > new Date(body.startTime)) {
      throw httpError(400, 'Start time has to be at least 5 minutes from now');
    }

    if (body.homeTeamId === body.awayTeamId) {
      throw httpError(400, 'Home and away teams cannot be the same');
    }

    const oldDocument = await databaseService.getMatchById(matchId).catch((error) => {
      console.error('Query match by id', error);
      throw httpError(500, 'Unable to query match');
    });

    if (!oldDocument) {
      throw httpError(404, 'No match found');
    }

    if (oldDocument.finalScore) {
      throw httpError(400, 'Final score is already set for this match');
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

    const document = matchDocumentConverter.update(matchId, body, homeTeam, awayTeam, tournament, expiresIn);

    await databaseService.updateMatch(document).catch((error) => {
      console.error('Update match', error);
      throw httpError(500, 'Error while updating match');
    });
  };
};
