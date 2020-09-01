import { httpError, addMinutes } from '@foci2020/shared/common/utils';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchRequest } from '@foci2020/shared/types/requests';

export interface ICreateMatchService {
  (ctx: {
    body: MatchRequest;
    expiresIn: number;
  }): Promise<string>;
}

export const createMatchServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter
): ICreateMatchService => {
  return async ({ body, expiresIn }) => {
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

    const document = matchDocumentConverter.create(body, homeTeam, awayTeam, tournament, expiresIn);

    await databaseService.saveMatch(document).catch((error) => {
      console.error('Save match', error);
      throw httpError(500, 'Error while saving match');
    });

    return document.id;
  };
};
