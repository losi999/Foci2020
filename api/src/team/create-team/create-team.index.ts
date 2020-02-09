
import { default as handler } from '@/team/create-team/create-team-handler';
import { apiRequestValidator, teamDocumentService, teamDocumentConverter } from '@/shared/dependencies';
import { body } from '@/team/create-team/create-team-schemas';
import { createTeamServiceFactory } from '@/team/create-team/create-team-service';

const createTeamService = createTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default apiRequestValidator({
  body
})(handler(createTeamService));
