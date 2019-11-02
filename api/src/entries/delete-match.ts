import { default as handler } from '@/handlers/delete-match-handler';
import { apiRequestValidator, matchDocumentService } from '@/dependencies';
import { deleteMatchServiceFactory } from '@/business-services/delete-match-service';
import { pathParameters } from '@/schemas/delete-match-schemas';

const deleteMatchService = deleteMatchServiceFactory(matchDocumentService);

export default apiRequestValidator({
  pathParameters
})(handler(deleteMatchService));
