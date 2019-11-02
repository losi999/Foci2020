import { default as handler } from '@/handlers/list-tournaments-handler';
import { tournamentDocumentConverter, tournamentDocumentService } from '@/dependencies';
import { listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default handler(listTournamentsService);
