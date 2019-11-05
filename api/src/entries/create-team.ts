import uuid from 'uuid';
import { default as handler } from '@/handlers/create-team-handler';
import { apiRequestValidator, teamDocumentService } from '@/dependencies';
import { body } from '@/schemas/create-team-schemas';
import { createTeamServiceFactory } from '@/business-services/create-team-service';

const createTeamService = createTeamServiceFactory(teamDocumentService, uuid);

export default apiRequestValidator({
  body
})(handler(createTeamService));
