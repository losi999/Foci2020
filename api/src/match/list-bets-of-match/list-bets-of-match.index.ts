import { default as handler } from '@/match/list-bets-of-match/list-bets-of-match-handler';
import { listBetsOfMatchServiceFactory } from '@/match/list-bets-of-match/list-bets-of-match-service';
import { pathParameters } from '@/match/list-bets-of-match/list-bets-of-match-schemas';
import { authorizer, apiRequestValidator, betDocumentService, betDocumentConverter, matchDocumentService } from '@/shared/dependencies';

const listBetsOfMatchService = listBetsOfMatchServiceFactory(betDocumentService, betDocumentConverter, matchDocumentService);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listBetsOfMatchService)));
