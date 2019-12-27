import { default as handler } from '@/handlers/create-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter } from '@/dependencies';
import { body } from '@/schemas/create-match-schemas';
import { createMatchServiceFactory } from '@/business-services/create-match-service';

const createMatchService = createMatchServiceFactory(matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter);

export default apiRequestValidator({
  body
})(handler(createMatchService));
