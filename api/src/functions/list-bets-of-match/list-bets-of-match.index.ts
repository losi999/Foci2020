import { default as handler } from '@/functions/list-bets-of-match/list-bets-of-match-handler';
import { listBetsOfMatchServiceFactory } from '@/functions/list-bets-of-match/list-bets-of-match-service';
import { default as pathParameters } from '@/schemas/match-id';
import { authorizer, apiRequestValidator, databaseService, betDocumentConverter } from '@/dependencies';

const listBetsOfMatchService = listBetsOfMatchServiceFactory(databaseService, betDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listBetsOfMatchService)));
