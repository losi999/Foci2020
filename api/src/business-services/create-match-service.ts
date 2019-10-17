import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
import { httpError, addMinutes } from '@/common';
import { MatchRequest } from '@/types/requests';
import { MatchSaveDocument } from '@/types/documents';

export interface ICreateMatchService {
  (ctx: {
    body: MatchRequest
  }): Promise<any>;
}

export const createMatchServiceFactory = (databaseService: IDatabaseService, uuid: v4String): ICreateMatchService => {
  return async ({ body }) => {
    if (addMinutes(5) > new Date(body.startTime)) {
      throw httpError(400, 'Start time has to be at least 5 minutes from now');
    }

    if (body.homeTeamId === body.awayTeamId) {
      throw httpError(400, 'Home and away teams cannot be the same');
    }

    const homeTeam = await databaseService.queryTeamById(body.homeTeamId).catch((error) => {
      console.log('ERROR queryTeamById', error);
      throw httpError(500, 'Unable to query home team');
    });

    if (!homeTeam) {
      throw httpError(400, 'No team found');
    }

    const awayTeam = await databaseService.queryTeamById(body.awayTeamId).catch((error) => {
      console.log('ERROR queryTeamById', error);
      throw httpError(500, 'Unable to query away team');
    });

    if (!awayTeam) {
      throw httpError(400, 'No team found');
    }

    const tournament = await databaseService.queryTournamentById(body.tournamentId).catch((error) => {
      console.log('ERROR queryTournamentById', error);
      throw httpError(500, 'Unable to query tournament');
    });

    if (!tournament) {
      throw httpError(400, 'No tournament found');
    }

    const matchId = uuid();
    const partitionKey = `match-${matchId}`;
    const orderingValue = `${body.tournamentId}-${body.startTime}`;
    const matchDocument: MatchSaveDocument = [
      {
        matchId,
        orderingValue,
        'documentType-id': partitionKey,
        segment: 'details',
        documentType: 'match',
        group: body.group,
        startTime: body.startTime,
      },
      {
        matchId,
        orderingValue,
        'documentType-id': partitionKey,
        segment: 'homeTeam',
        documentType: 'match',
        teamId: homeTeam.teamId,
        image: homeTeam.image,
        shortName: homeTeam.shortName,
        teamName: homeTeam.teamName
      },
      {
        matchId,
        orderingValue,
        'documentType-id': partitionKey,
        segment: 'awayTeam',
        documentType: 'match',
        teamId: awayTeam.teamId,
        image: awayTeam.image,
        shortName: awayTeam.shortName,
        teamName: awayTeam.teamName
      }, {
        matchId,
        orderingValue,
        'documentType-id': partitionKey,
        segment: 'tournament',
        documentType: 'match',
        tournamentId: tournament.tournamentId,
        tournamentName: tournament.tournamentName
      }
    ];
    try {
      await databaseService.saveMatch(matchDocument);
    } catch (error) {
      console.log('ERROR databaseService.saveMatch', error);
      throw httpError(500, 'Error while saving team');
    }
  };
};
