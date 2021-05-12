import { lambda } from '@foci2020/shared/dependencies/aws/lambda';
import { eventServiceFactory } from '@foci2020/shared/services/event-service';

export const eventService = eventServiceFactory({
  tournamentUpdatedLambda: process.env.TOURNAMENT_UPDATED_LAMBDA,
  tournamentDeletedLambda: process.env.TOURNAMENT_DELETED_LAMBDA,
  teamUpdatedLambda: process.env.TEAM_UPDATED_LAMBDA,
  teamDeletedLambda: process.env.TEAM_DELETED_LAMBDA,
  matchDeletedLambda: process.env.MATCH_DELETED_LAMBDA,
  betResultCalculatedLambda: process.env.BET_RESULT_CALCULATED_LAMBDA,
  matchFinalScoreUpdatedLambda: process.env.MATCH_FINAL_SCORE_UPDATED_LAMBDA,
  archiveDocumentLambda: process.env.ARCHIVE_DOCUMENT_LAMBDA,
}, lambda);
