import { default as handler } from '@/tournament/list-tournaments/list-tournaments-handler';
import { tournamentDocumentConverter, tournamentDocumentService } from '@/shared/dependencies';
import { listTournamentsServiceFactory } from '@/tournament/list-tournaments/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default handler(listTournamentsService);
