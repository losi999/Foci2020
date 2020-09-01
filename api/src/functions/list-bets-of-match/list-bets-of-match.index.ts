import { default as handler } from '@foci2020/api/functions/list-bets-of-match/list-bets-of-match-handler';
import { listBetsOfMatchServiceFactory } from '@foci2020/api/functions/list-bets-of-match/list-bets-of-match-service';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';
import { authorizer, apiRequestValidator, databaseService, betDocumentConverter,  } from '@foci2020/api/dependencies';

const listBetsOfMatchService = listBetsOfMatchServiceFactory(databaseService, betDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listBetsOfMatchService)));
