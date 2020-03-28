import { httpError } from '@/common';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

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
    const match = await databaseService.getMatchById(matchId).catch((error) => {
      console.error('Query match by Id', error);
      throw httpError(500, 'Unable to query match');
    });

    if (!match) {
      throw httpError(404, 'No match found');
    }

    return matchDocumentConverter.toResponse(match);
  };
};
