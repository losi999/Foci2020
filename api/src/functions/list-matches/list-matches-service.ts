import { httpError } from '@/common';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { MatchResponse } from '@/types/types';

export interface IListMatchesService {
  (): Promise<MatchResponse[]>;
}

export const listMatchesServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  matchDocumentConverter: IMatchDocumentConverter,
): IListMatchesService => {
  return async () => {
    const matches = await matchDocumentService.listMatches().catch((error) => {
      console.error('List matches', error);
      throw httpError(500, 'Unable to list matches');
    });

    return matchDocumentConverter.toResponseList(matches);
  };
};
