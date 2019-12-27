
import { default as handler } from '@/handlers/create-team-handler';
import { apiRequestValidator, teamDocumentService, teamDocumentConverter } from '@/dependencies';
import { body } from '@/schemas/create-team-schemas';
import { createTeamServiceFactory } from '@/business-services/create-team-service';

const createTeamService = createTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default apiRequestValidator({
  body
})(handler(createTeamService));
