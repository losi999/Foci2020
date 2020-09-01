import { httpError } from '@foci2020/shared/common/utils';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { MatchIdType } from '@foci2020/shared/types/common';

export interface IGetMatchService {
  (ctx: {
    matchId: MatchIdType
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
