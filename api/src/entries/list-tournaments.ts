import { default as handler } from '@/handlers/list-tournaments-handler';
import { databaseService } from '@/dependencies';
import { listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(databaseService);

export default handler(listTournamentsService);
