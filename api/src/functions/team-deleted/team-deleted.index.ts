import { databaseService } from '@foci2020/api/dependencies';
import { default as handler } from '@foci2020/api/functions/team-deleted/team-deleted-handler';
import { teamDeletedServiceFactory } from '@foci2020/api/functions/team-deleted/team-deleted-service';

const teamDeletedService = teamDeletedServiceFactory(databaseService);

export default handler(teamDeletedService);
