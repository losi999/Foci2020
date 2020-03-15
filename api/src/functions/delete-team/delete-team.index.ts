import { default as handler } from '@/functions/delete-team/delete-team-handler';
import { apiRequestValidator, teamDocumentService, authorizer } from '@/dependencies';
import { deleteTeamServiceFactory } from '@/functions/delete-team/delete-team-service';
import { pathParameters } from '@/functions/delete-team/delete-team-schemas';

const deleteTeamService = deleteTeamServiceFactory(teamDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTeamService)));
