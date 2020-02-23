import { default as handler } from '@/team/update-team/update-team-handler';
import { apiRequestValidator, teamDocumentService, teamDocumentConverter, authorizer } from '@/shared/dependencies';
import { body, pathParameters } from '@/team/update-team/update-team-schemas';
import { updateTeamServiceFactory } from '@/team/update-team/update-team-service';

const updateTeamService = updateTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateTeamService)));
