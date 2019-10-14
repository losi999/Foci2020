import { IDatabaseService } from '@/services/database-service';
import { MatchResponse, MatchDocument, Converter } from '@/types';
import { httpError } from '@/common';

export interface IListMatchesService {
  (ctx: {
    tournamentId?: string
  }): Promise<MatchResponse[]>;
}

export const listMatchesServiceFactory = (
  databaseService: IDatabaseService,
  converter: Converter<MatchDocument[], MatchResponse>,
): IListMatchesService => {
  return async ({ tournamentId }) => {
    const matches = await (!!tournamentId ?
      databaseService.queryMatchesByTournamentId(tournamentId) :
      databaseService.queryMatchesByDocumentType()).catch((error) => {
        console.log('ERROR databaseService.queryMatches', tournamentId, error);
        throw httpError(500, 'Unable to query matches');
      });

    const combined = matches.reduce<{ [matchId: string]: MatchDocument[] }>((accumulator, currentValue) => {
      if (!accumulator[currentValue.matchId]) {
        accumulator[currentValue.matchId] = [];
      }
      accumulator[currentValue.matchId].push(currentValue);
      return accumulator;
    }, {});

    return Object.values(combined)
      .map(docs => converter(docs))
      .sort((a, b) => a.startTime < b.startTime ? -1 : 1);
  };
};
