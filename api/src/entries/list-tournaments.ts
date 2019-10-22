import { default as handler } from '@/handlers/list-tournaments-handler';
import { databaseService } from '@/dependencies';
import { listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';
import { default as converter } from '@/converters/tournament-documents-to-response-converter';

const listTournamentsService = listTournamentsServiceFactory(databaseService, converter);

export default handler(listTournamentsService);
