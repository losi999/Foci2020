import { default as handler } from '@/handlers/get-team-handler';
import { apiRequestValidator, teamDocumentConverter, teamDocumentService } from '@/dependencies';
import { getTeamServiceFactory } from '@/business-services/get-team-service';
import { pathParameters } from '@/schemas/get-team-schemas';

const getTeamService = getTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default apiRequestValidator({
  pathParameters
})(handler(getTeamService));
