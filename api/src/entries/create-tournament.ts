import uuid from 'uuid';
import { default as handler } from '@/handlers/create-tournament-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { body } from '@/schemas/create-tournament-schemas';
import { createTournamentServiceFactory } from '@/business-services/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(databaseService, uuid);

export default apiRequestValidator({
  body
})(handler(createTournamentService));
