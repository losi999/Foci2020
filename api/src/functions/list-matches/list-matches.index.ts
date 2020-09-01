import { default as handler } from '@foci2020/api/functions/list-matches/list-matches-handler';
import { authorizer, databaseService, matchDocumentConverter } from '@foci2020/api/dependencies';
import { listMatchesServiceFactory } from '@foci2020/api/functions/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(handler(listMatchesService));
