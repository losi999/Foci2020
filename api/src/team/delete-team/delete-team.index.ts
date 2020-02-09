import { default as handler } from '@/team/delete-team/delete-team-handler';
import { apiRequestValidator, notificationService, teamDocumentService } from '@/shared/dependencies';
import { deleteTeamServiceFactory } from '@/team/delete-team/delete-team-service';
import { pathParameters } from '@/team/delete-team/delete-team-schemas';

const deleteTeamService = deleteTeamServiceFactory(teamDocumentService, notificationService);

export default apiRequestValidator({
  pathParameters
})(handler(deleteTeamService));
