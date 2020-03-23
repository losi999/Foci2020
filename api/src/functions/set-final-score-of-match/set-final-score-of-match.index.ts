import { default as handler } from '@/functions/set-final-score-of-match/set-final-score-of-match-handler';
import { apiRequestValidator, matchDocumentService, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/match-score';
import { default as pathParameters } from '@/schemas/match-id';
import { setFinalScoreOfMatchServiceFactory } from '@/functions/set-final-score-of-match/set-final-score-of-match-service';

const setFinalScoreOfMatchService = setFinalScoreOfMatchServiceFactory(matchDocumentService);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(setFinalScoreOfMatchService)));
