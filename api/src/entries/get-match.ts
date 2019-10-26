import { default as handler } from '@/handlers/get-match-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { getMatchServiceFactory } from '@/business-services/get-match-service';
import { default as converter } from '@/converters/match-documents-to-response-converter';
import { pathParameters } from '@/schemas/get-match-schemas';

const getMatchService = getMatchServiceFactory(databaseService, converter);

export default apiRequestValidator({
  pathParameters
})(handler(getMatchService));
