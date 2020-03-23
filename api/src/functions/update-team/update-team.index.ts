import { default as handler } from '@/functions/update-team/update-team-handler';
import { apiRequestValidator, teamDocumentService, teamDocumentConverter, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/team';
import { default as pathParameters } from '@/schemas/team-id';
import { updateTeamServiceFactory } from '@/functions/update-team/update-team-service';

const updateTeamService = updateTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateTeamService)));
