import { default as handler } from '@/handlers/get-team-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { getTeamServiceFactory } from '@/business-services/get-team-service';
import { default as converter } from '@/converters/team-documents-to-response-converter';
import { pathParameters } from '@/schemas/get-team-schemas';

const getTeamService = getTeamServiceFactory(databaseService, converter);

export default apiRequestValidator({
  pathParameters
})(handler(getTeamService));
