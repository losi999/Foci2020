import { default as handler } from '@/handlers/delete-team-handler';
import { apiRequestValidator, notificationService, teamDocumentService } from '@/dependencies';
import { deleteTeamServiceFactory } from '@/business-services/delete-team-service';
import { pathParameters } from '@/schemas/delete-team-schemas';

const deleteTeamService = deleteTeamServiceFactory(teamDocumentService, notificationService);

export default apiRequestValidator({
  pathParameters
})(handler(deleteTeamService));
