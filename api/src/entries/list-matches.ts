import { default as handler } from '@/handlers/list-matches-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService } from '@/dependencies';
import { queryStringParameters } from '@/schemas/list-matches-schemas';
import { listMatchesServiceFactory } from '@/business-services/list-matches-service';

const listMatchesService = listMatchesServiceFactory(matchDocumentService, matchDocumentConverter);

export default apiRequestValidator({
  queryStringParameters
})(handler(listMatchesService));
