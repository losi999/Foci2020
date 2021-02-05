import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { default as handler } from '@foci2020/api/functions/tournament-deleted/tournament-deleted-handler';
import { tournamentDeletedServiceFactory } from '@foci2020/api/functions/tournament-deleted/tournament-deleted-service';

const tournamentDeletedService = tournamentDeletedServiceFactory(databaseService);

export default handler(tournamentDeletedService);
