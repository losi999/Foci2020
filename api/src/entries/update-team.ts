import { default as handler } from '@/handlers/update-team-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-team-schemas';
import { updateTeamServiceFactory } from '@/business-services/update-team-service';

const updateTeamService = updateTeamServiceFactory(databaseService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateTeamService));
