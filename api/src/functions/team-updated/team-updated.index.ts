import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { default as handler } from '@foci2020/api/functions/team-updated/team-updated-handler';
import { teamUpdatedServiceFactory } from '@foci2020/api/functions/team-updated/team-updated-service';

const teamUpdatedService = teamUpdatedServiceFactory(databaseService);

export default handler(teamUpdatedService);
