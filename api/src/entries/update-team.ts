import { default as handler } from '@/handlers/update-team-handler';
import { databaseService, apiRequestValidator, notificationService } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-team-schemas';
import { updateTeamServiceFactory } from '@/business-services/update-team-service';

const updateTeamService = updateTeamServiceFactory(databaseService, notificationService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateTeamService));
