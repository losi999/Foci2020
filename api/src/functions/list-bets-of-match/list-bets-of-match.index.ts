import { default as handler } from '@/functions/list-bets-of-match/list-bets-of-match-handler';
import { listBetsOfMatchServiceFactory } from '@/functions/list-bets-of-match/list-bets-of-match-service';
import { default as pathParameters } from '@/schemas/match-id';
import { authorizer, apiRequestValidator, betDocumentService, betDocumentConverter, matchDocumentService } from '@/dependencies';

const listBetsOfMatchService = listBetsOfMatchServiceFactory(betDocumentService, betDocumentConverter, matchDocumentService);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listBetsOfMatchService)));
