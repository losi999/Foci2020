import { databaseService } from '@foci2020/api/dependencies';
import { default as handler } from '@foci2020/api/functions/match-deleted/match-deleted-handler';
import { matchDeletedServiceFactory } from '@foci2020/api/functions/match-deleted/match-deleted-service';

const matchDeletedService = matchDeletedServiceFactory(databaseService);

export default handler(matchDeletedService);
