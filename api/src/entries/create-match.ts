import uuid from 'uuid';
import { default as handler } from '@/handlers/create-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService } from '@/dependencies';
import { body } from '@/schemas/create-match-schemas';
import { createMatchServiceFactory } from '@/business-services/create-match-service';

const createMatchService = createMatchServiceFactory(matchDocumentService, teamDocumentService, tournamentDocumentService, uuid);

export default apiRequestValidator({
  body
})(handler(createMatchService));
