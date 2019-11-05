import { httpError } from '@/common';
import { IMatchDocumentService } from '@/services/match-document-service';

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
      console.log('ERROR databaseService.deleteMatch', error);
      throw httpError(500, 'Unable to delete match');
    });
  };
};
