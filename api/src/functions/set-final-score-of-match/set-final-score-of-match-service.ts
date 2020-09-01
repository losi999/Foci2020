import { addMinutes, httpError } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchFinalScoreRequest } from '@foci2020/shared/types/requests';
import { MatchIdType } from '@foci2020/shared/types/common';

export interface ISetFinalScoreOfMatchService {
  (ctx: {
    matchId: MatchIdType;
    finalScore: MatchFinalScoreRequest;
  }): Promise<void>;
}

export const setFinalScoreOfMatchServiceFactory = (databaseService: IDatabaseService): ISetFinalScoreOfMatchService =>
  async ({ matchId, finalScore }) => {
    const match = await databaseService.getMatchById(matchId).catch((error) => {
      console.error('Query match by id', error);
      throw httpError(500, 'Unable to query match by Id');
    });

    if (!match) {
      throw httpError(404, 'No match found');
    }

    if (new Date() < addMinutes(105, new Date(match.startTime))) {
      throw httpError(400, 'Final score cannot be set during the game');
    }

    await databaseService.updateMatch({
      ...match,
      finalScore
    }).catch((error) => {
      console.error('Update match', error);
      throw httpError(500, 'Unable to update match');
    });
  };
