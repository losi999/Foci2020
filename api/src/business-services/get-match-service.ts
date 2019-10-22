import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { MatchResponse } from '@/types/responses';
import { MatchDocument } from '@/types/documents';
import { Converter } from '@/types/types';

export interface IGetMatchService {
  (ctx: {
    matchId: string
  }): Promise<MatchResponse>;
}

export const getMatchServiceFactory = (
  databaseService: IDatabaseService,
  converter: Converter<MatchDocument[], MatchResponse>
): IGetMatchService => {
  return async ({ matchId }) => {
    const match = await databaseService.queryMatchById(matchId).catch((error) => {
      console.log('ERROR databaseService.queryMatchById', error);
      throw httpError(500, 'Unable to query match');
    });

    return converter(match);
  };
};
