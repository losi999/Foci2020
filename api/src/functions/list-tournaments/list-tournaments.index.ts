import { default as handler } from '@/functions/list-tournaments/list-tournaments-handler';
import { tournamentDocumentConverter, databaseService, authorizer } from '@/dependencies';
import { listTournamentsServiceFactory } from '@/functions/list-tournaments/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(handler(listTournamentsService));
