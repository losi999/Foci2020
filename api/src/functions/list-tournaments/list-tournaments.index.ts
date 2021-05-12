import { default as handler } from '@foci2020/api/functions/list-tournaments/list-tournaments-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { listTournamentsServiceFactory } from '@foci2020/api/functions/list-tournaments/list-tournaments-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const listTournamentsService = listTournamentsServiceFactory(databaseService, tournamentDocumentConverter);

export default cors(authorizer('admin')(handler(listTournamentsService)));
