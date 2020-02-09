import { httpError } from '@/shared/common';
import { IMatchDocumentConverter } from '@/match/match-document-converter';
import { IMatchDocumentService } from '@/match/match-document-service';
import { MatchResponse } from '@/shared/types/types';

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
