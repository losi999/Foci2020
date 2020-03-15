import { default as handler } from '@/functions/set-final-score-of-match/set-final-score-of-match-handler';
import { apiRequestValidator, matchDocumentService, authorizer } from '@/dependencies';
import { body, pathParameters } from '@/functions/set-final-score-of-match/set-final-score-of-match-schemas';
import { setFinalScoreOfMatchServiceFactory } from '@/functions/set-final-score-of-match/set-final-score-of-match-service';

const setFinalScoreOfMatchService = setFinalScoreOfMatchServiceFactory(matchDocumentService);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(setFinalScoreOfMatchService)));
