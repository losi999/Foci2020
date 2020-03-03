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
    const match = await matchDocumentService.queryMatchById(matchId);
    if (new Date() < addMinutes(105, new Date(match.startTime))) {
      throw httpError(400, 'Too early');
    }

    await matchDocumentService.updateMatch({
      ...match,
      finalScore
    });
  };
