import { default as handler } from '@/functions/list-tournaments/list-tournaments-handler';
import { tournamentDocumentConverter, tournamentDocumentService, authorizer } from '@/dependencies';
import { listTournamentsServiceFactory } from '@/functions/list-tournaments/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(handler(listTournamentsService));
