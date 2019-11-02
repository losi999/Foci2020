import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';

export interface IGetMatchService {
  (ctx: {
    matchId: string
  }): Promise<MatchResponse>;
}

export const getMatchServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter
): IGetMatchService => {
  return async ({ matchId }) => {
    const match = await databaseService.queryMatchById(matchId).catch((error) => {
      console.log('ERROR databaseService.queryMatchById', error);
      throw httpError(500, 'Unable to query match');
    });

    return matchDocumentConverter.createResponse(match);
  };
};
