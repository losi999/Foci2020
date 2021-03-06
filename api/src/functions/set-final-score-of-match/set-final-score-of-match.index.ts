import { default as handler } from '@foci2020/api/functions/set-final-score-of-match/set-final-score-of-match-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as body } from '@foci2020/shared/schemas/match-score';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';
import { setFinalScoreOfMatchServiceFactory } from '@foci2020/api/functions/set-final-score-of-match/set-final-score-of-match-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const setFinalScoreOfMatchService = setFinalScoreOfMatchServiceFactory(databaseService);

export default cors(authorizer('admin')(apiRequestValidator({
  body,
  pathParameters,
})(handler(setFinalScoreOfMatchService))));
