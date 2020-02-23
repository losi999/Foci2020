import { default as handler } from '@/team/delete-team/delete-team-handler';
import { apiRequestValidator, teamDocumentService, authorizer } from '@/shared/dependencies';
import { deleteTeamServiceFactory } from '@/team/delete-team/delete-team-service';
import { pathParameters } from '@/team/delete-team/delete-team-schemas';

const deleteTeamService = deleteTeamServiceFactory(teamDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTeamService)));
