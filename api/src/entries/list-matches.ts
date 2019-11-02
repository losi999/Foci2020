import { default as handler } from '@/handlers/list-matches-handler';
import { databaseService, apiRequestValidator, matchDocumentConverter } from '@/dependencies';
import { queryStringParameters } from '@/schemas/list-matches-schemas';
import { listMatchesServiceFactory } from '@/business-services/list-matches-service';

const listMatchesService = listMatchesServiceFactory(databaseService, matchDocumentConverter);

export default apiRequestValidator({
  queryStringParameters
})(handler(listMatchesService));
