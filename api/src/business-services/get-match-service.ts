import { httpError } from '@/common';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IGetMatchService {
  (ctx: {
    matchId: string
  }): Promise<MatchResponse>;
}

export const getMatchServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  matchDocumentConverter: IMatchDocumentConverter
): IGetMatchService => {
  return async ({ matchId }) => {
    const match = await matchDocumentService.queryMatchById(matchId).catch((error) => {
      console.log('ERROR databaseService.queryMatchById', error);
      throw httpError(500, 'Unable to query match');
    });

    return matchDocumentConverter.toResponse(match);
  };
};
