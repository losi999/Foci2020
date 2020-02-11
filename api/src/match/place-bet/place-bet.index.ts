import { default as handler } from '@/match/place-bet/place-bet-handler';
import { authorizer, apiRequestValidator, matchDocumentService, betDocumentService, betDocumentConverter } from '@/shared/dependencies';
import { placeBetServiceFactory } from '@/match/place-bet/place-bet-service';
import { body, pathParameters } from '@/match/place-bet/place-bet-schemas';

const placeBetService = placeBetServiceFactory(matchDocumentService, betDocumentConverter, betDocumentService);

export default authorizer('player')(apiRequestValidator({
  body,
  pathParameters
})(handler(placeBetService)));
