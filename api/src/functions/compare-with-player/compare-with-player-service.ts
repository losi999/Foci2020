import { CompareResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';
import { IIdentityService } from '@/services/identity-service';
import { ICompareDocumentConverter } from '@/converters/compare-document-converter';
import { httpError } from '@/common';

export interface ICompareWithPlayerService {
  (ctx: {
    tournamentId: string;
    ownUserId: string;
    ownUserName: string;
    otherUserId: string;
  }): Promise<CompareResponse>;
}

export const compareWithPlayerServiceFactory = (
  databaseService: IDatabaseService,
  identityService: IIdentityService,
  compareDocumentConverter: ICompareDocumentConverter): ICompareWithPlayerService => {

  return async ({ otherUserId, ownUserId, ownUserName, tournamentId }) => {
    const [matches, ownBetDocuments, otherBetDocuments, otherUserName] = await Promise.all([
      databaseService.queryMatchesByTournamentId(tournamentId),
      databaseService.queryBetsByTournamentIdUserId(tournamentId, ownUserId),
      databaseService.queryBetsByTournamentIdUserId(tournamentId, otherUserId),
      identityService.getUserName(otherUserId)
    ]).catch((error) => {
      console.error('Compare documents', error);
      throw httpError(500, 'Unable to get related documents');
    });

    const ownBets = ownBetDocuments.reduce((accumulator, currentValue) => {
      return {
        [currentValue.matchId]: currentValue,
        ...accumulator
      };
    }, {});

    const otherBets = otherBetDocuments.reduce((accumulator, currentValue) => {
      return {
        [currentValue.matchId]: currentValue,
        ...accumulator
      };
    }, {});

    return compareDocumentConverter.toResponse(matches, ownBets, otherBets, ownUserName, otherUserName);
  };
};