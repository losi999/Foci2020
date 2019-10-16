import { default as handler } from '@/handlers/list-matches-handler';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { validatorService, databaseService } from '@/dependencies';
import { default as queryStringParameters } from '@/schemas/list-matches-schemas';
import { listMatchesServiceFactory } from '@/business-services/list-matches-service';
import { default as converter } from '@/converters/match-documents-to-response-converter';

const listMatchesService = listMatchesServiceFactory(databaseService, converter);

export default apiRequestValidatorHandler(validatorService)({
  queryStringParameters
})(handler(listMatchesService));
