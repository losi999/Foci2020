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
      console.error('Query match by Id', error);
      throw httpError(500, 'Unable to query match');
    });

    if (!match) {
      throw httpError(404, 'No match found');
    }

    return matchDocumentConverter.toResponse(match);
  };
};
