import { default as handler } from '@/functions/place-bet/place-bet-handler';
import { authorizer, apiRequestValidator, matchDocumentService, betDocumentService, betDocumentConverter } from '@/dependencies';
import { placeBetServiceFactory } from '@/functions/place-bet/place-bet-service';
import { body, pathParameters } from '@/functions/place-bet/place-bet-schemas';

const placeBetService = placeBetServiceFactory(matchDocumentService, betDocumentConverter, betDocumentService);

export default authorizer('player')(apiRequestValidator({
  body,
  pathParameters
})(handler(placeBetService)));
