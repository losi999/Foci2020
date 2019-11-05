import { default as handler } from '@/handlers/get-match-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService } from '@/dependencies';
import { getMatchServiceFactory } from '@/business-services/get-match-service';
import { pathParameters } from '@/schemas/get-match-schemas';

const getMatchService = getMatchServiceFactory(matchDocumentService, matchDocumentConverter);

export default apiRequestValidator({
  pathParameters
})(handler(getMatchService));
