import { default as handler } from '@/handlers/list-tournaments-handler';
import { databaseService, tournamentDocumentConverter } from '@/dependencies';
import { listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(databaseService, tournamentDocumentConverter);

export default handler(listTournamentsService);
