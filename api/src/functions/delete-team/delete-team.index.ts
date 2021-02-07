import { default as handler } from '@foci2020/api/functions/delete-team/delete-team-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { deleteTeamServiceFactory } from '@foci2020/api/functions/delete-team/delete-team-service';
import { default as pathParameters } from '@foci2020/shared/schemas/team-id';

const deleteTeamService = deleteTeamServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters, 
})(handler(deleteTeamService)));
