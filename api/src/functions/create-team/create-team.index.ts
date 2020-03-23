
import { default as handler } from '@/functions/create-team/create-team-handler';
import { apiRequestValidator, teamDocumentService, teamDocumentConverter, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/team';
import { createTeamServiceFactory } from '@/functions/create-team/create-team-service';

const createTeamService = createTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTeamService)));
