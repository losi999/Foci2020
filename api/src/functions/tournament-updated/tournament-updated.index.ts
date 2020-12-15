import { databaseService } from '@foci2020/api/dependencies';
import { default as handler } from '@foci2020/api/functions/tournament-updated/tournament-updated-handler';
import { tournamentUpdatedServiceFactory } from '@foci2020/api/functions/tournament-updated/tournament-updated-service';

const tournamentUpdatedService = tournamentUpdatedServiceFactory(databaseService);

export default handler(tournamentUpdatedService);
