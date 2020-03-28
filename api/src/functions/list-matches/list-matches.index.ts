import { default as handler } from '@/functions/list-matches/list-matches-handler';
import { matchDocumentConverter, databaseService, authorizer } from '@/dependencies';
import { listMatchesServiceFactory } from '@/functions/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(handler(listMatchesService));
