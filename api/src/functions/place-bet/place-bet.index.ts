import { default as handler } from '@foci2020/api/functions/place-bet/place-bet-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { betDocumentConverter } from '@foci2020/shared/dependencies/converters/bet-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { placeBetServiceFactory } from '@foci2020/api/functions/place-bet/place-bet-service';
import { default as body } from '@foci2020/shared/schemas/match-score';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';

const placeBetService = placeBetServiceFactory(databaseService, betDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  body,
  pathParameters
})(handler(placeBetService)));
