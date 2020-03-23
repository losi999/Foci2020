import { default as handler } from '@/functions/list-matches/list-matches-handler';
import { matchDocumentConverter, matchDocumentService, authorizer } from '@/dependencies';
import { listMatchesServiceFactory } from '@/functions/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(matchDocumentService, matchDocumentConverter);

export default authorizer('admin')(handler(listMatchesService));
