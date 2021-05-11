import { default as handler } from '@foci2020/api/functions/get-default-tournament-id/get-default-tournament-id-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { getDefaultTournamentIdServiceFactory } from '@foci2020/api/functions/get-default-tournament-id/get-default-tournament-id-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const getDefaultTournamentIdService = getDefaultTournamentIdServiceFactory(databaseService);

export default cors(authorizer('player')(handler(getDefaultTournamentIdService)));
