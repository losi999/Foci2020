import { default as handler } from '@foci2020/api/functions/list-matches/list-matches-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { listMatchesServiceFactory } from '@foci2020/api/functions/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(handler(listMatchesService));
