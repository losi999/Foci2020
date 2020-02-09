import { httpError } from '@/shared/common';
import { IMatchDocumentService } from '@/match/match-document-service';

export interface IDeleteMatchService {
  (ctx: {
    matchId: string
  }): Promise<void>;
}

export const deleteMatchServiceFactory = (
  matchDocumentService: IMatchDocumentService
): IDeleteMatchService => {
  return async ({ matchId }) => {
    await matchDocumentService.deleteMatch(matchId).catch((error) => {
      console.error('Delete match', error);
      throw httpError(500, 'Unable to delete match');
    });
  };
};
