import { default as handler } from '@foci2020/api/functions/set-final-score-of-match/set-final-score-of-match-handler';
import { apiRequestValidator, authorizer, databaseService } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/match-score';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';
import { setFinalScoreOfMatchServiceFactory } from '@foci2020/api/functions/set-final-score-of-match/set-final-score-of-match-service';

const setFinalScoreOfMatchService = setFinalScoreOfMatchServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(setFinalScoreOfMatchService)));
