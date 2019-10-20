import { default as handler } from '@/handlers/update-match-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-match-schemas';
import { updateMatchServiceFactory } from '@/business-services/update-match-service';

const updateMatchService = updateMatchServiceFactory(databaseService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateMatchService));
