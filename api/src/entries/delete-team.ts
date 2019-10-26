import { default as handler } from '@/handlers/delete-team-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { deleteTeamServiceFactory } from '@/business-services/delete-team-service';
import { pathParameters } from '@/schemas/delete-team-schemas';

const deleteTeamService = deleteTeamServiceFactory(databaseService);

export default apiRequestValidator({
  pathParameters
})(handler(deleteTeamService));
