import { httpError } from '@foci2020/shared/common/utils';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchResponse } from '@foci2020/shared/types/responses';

export interface IListMatchesService {
  (): Promise<MatchResponse[]>;
}

export const listMatchesServiceFactory = (
  databaseService: IDatabaseService,
  matchDocumentConverter: IMatchDocumentConverter,
): IListMatchesService => {
  return async () => {
    const matches = await databaseService.listMatches().catch((error) => {
      console.error('List matches', error);
      throw httpError(500, 'Unable to list matches');
    });

    return matchDocumentConverter.toResponseList(matches);
  };
};
