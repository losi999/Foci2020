import { default as handler } from '@/handlers/get-tournament-handler';
import { databaseService } from '@/dependencies';
import { getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { default as converter } from '@/converters/tournament-documents-to-response-converter';

const getTournamentService = getTournamentServiceFactory(databaseService, converter);

export default handler(getTournamentService);
