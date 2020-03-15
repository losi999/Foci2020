
import { default as handler } from '@/functions/create-team/create-team-handler';
import { apiRequestValidator, teamDocumentService, teamDocumentConverter, authorizer } from '@/dependencies';
import { body } from '@/functions/create-team/create-team-schemas';
import { createTeamServiceFactory } from '@/functions/create-team/create-team-service';

const createTeamService = createTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTeamService)));
