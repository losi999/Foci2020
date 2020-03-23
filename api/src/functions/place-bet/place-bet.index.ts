import { default as handler } from '@/functions/place-bet/place-bet-handler';
import { authorizer, apiRequestValidator, matchDocumentService, betDocumentService, betDocumentConverter } from '@/dependencies';
import { placeBetServiceFactory } from '@/functions/place-bet/place-bet-service';
import { default as body } from '@/schemas/match-score';
import { default as pathParameters } from '@/schemas/match-id';

const placeBetService = placeBetServiceFactory(matchDocumentService, betDocumentConverter, betDocumentService);

export default authorizer('player')(apiRequestValidator({
  body,
  pathParameters
})(handler(placeBetService)));
