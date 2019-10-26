import uuid from 'uuid';
import { default as handler } from '@/handlers/create-match-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { body } from '@/schemas/create-match-schemas';
import { createMatchServiceFactory } from '@/business-services/create-match-service';

const createMatchService = createMatchServiceFactory(databaseService, uuid);

export default apiRequestValidator({
  body
})(handler(createMatchService));
