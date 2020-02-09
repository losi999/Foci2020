import { default as handler } from '@/team/update-team/update-team-handler';
import { apiRequestValidator, notificationService, teamDocumentService, teamDocumentConverter } from '@/shared/dependencies';
import { body, pathParameters } from '@/team/update-team/update-team-schemas';
import { updateTeamServiceFactory } from '@/team/update-team/update-team-service';

const updateTeamService = updateTeamServiceFactory(teamDocumentService, teamDocumentConverter, notificationService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateTeamService));
