import { default as handler } from '@/handlers/get-tournament-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { default as converter } from '@/converters/tournament-documents-to-response-converter';
import { pathParameters } from '@/schemas/get-tournament-schemas';

const getTournamentService = getTournamentServiceFactory(databaseService, converter);

export default apiRequestValidator({
  pathParameters
})(handler(getTournamentService));
