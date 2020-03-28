import { default as handler } from '@/functions/delete-team/delete-team-handler';
import { apiRequestValidator, databaseService, authorizer } from '@/dependencies';
import { deleteTeamServiceFactory } from '@/functions/delete-team/delete-team-service';
import { default as pathParameters } from '@/schemas/team-id';

const deleteTeamService = deleteTeamServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTeamService)));
