import { default as handler } from '@/team/get-team/get-team-handler';
import { apiRequestValidator, teamDocumentConverter, teamDocumentService } from '@/shared/dependencies';
import { getTeamServiceFactory } from '@/team/get-team/get-team-service';
import { pathParameters } from '@/team/get-team/get-team-schemas';

const getTeamService = getTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default apiRequestValidator({
  pathParameters
})(handler(getTeamService));
