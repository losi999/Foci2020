import { default as handler } from '@foci2020/api/functions/list-tournaments/list-tournaments-handler';
import { authorizer, databaseService, tournamentDocumentConverter } from '@foci2020/api/dependencies';
import { listTournamentsServiceFactory } from '@foci2020/api/functions/list-tournaments/list-tournaments-service';

const listTournamentsService = listTournamentsServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(handler(listTournamentsService));
