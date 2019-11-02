import { default as handler } from '@/handlers/update-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-match-schemas';
import { updateMatchServiceFactory } from '@/business-services/update-match-service';

const updateMatchService = updateMatchServiceFactory(matchDocumentService, teamDocumentService, tournamentDocumentService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateMatchService));
