import { MatchFinalScoreRequest } from '@/types/types';
import { IMatchDocumentService } from '@/services/match-document-service';
import { addMinutes, httpError } from '@/common';

export interface ISetFinalScoreOfMatchService {
  (ctx: {
    matchId: string;
    finalScore: MatchFinalScoreRequest;
  }): Promise<void>;
}

export const setFinalScoreOfMatchServiceFactory = (matchDocumentService: IMatchDocumentService): ISetFinalScoreOfMatchService =>
  async ({ matchId, finalScore }) => {
    const match = await matchDocumentService.getMatchById(matchId).catch((error) => {
      console.error('Query match by id', error);
      throw httpError(500, 'Unable to query match by Id');
    });
    if (new Date() < addMinutes(105, new Date(match.startTime))) {
      throw httpError(400, 'Final score cannot be set during the game');
    }

    await matchDocumentService.updateMatch({
      ...match,
      finalScore
    }).catch((error) => {
      console.error('Update match', error);
      throw httpError(500, 'Unable to update match');
    });
  };
