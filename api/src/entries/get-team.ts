import { default as handler } from '@/handlers/get-team-handler';
import { databaseService, apiRequestValidator, teamDocumentConverter } from '@/dependencies';
import { getTeamServiceFactory } from '@/business-services/get-team-service';
import { pathParameters } from '@/schemas/get-team-schemas';

const getTeamService = getTeamServiceFactory(databaseService, teamDocumentConverter);

export default apiRequestValidator({
  pathParameters
})(handler(getTeamService));
