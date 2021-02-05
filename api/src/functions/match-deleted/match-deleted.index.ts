import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { default as handler } from '@foci2020/api/functions/match-deleted/match-deleted-handler';
import { matchDeletedServiceFactory } from '@foci2020/api/functions/match-deleted/match-deleted-service';

const matchDeletedService = matchDeletedServiceFactory(databaseService);

export default handler(matchDeletedService);
